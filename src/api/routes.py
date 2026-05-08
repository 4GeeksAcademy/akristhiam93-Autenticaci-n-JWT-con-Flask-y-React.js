"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/users", methods=["GET"])
def get_users():
    users = db.session.execute(select(User)).scalars().all()

    return jsonify([user.serialize() for user in users]), 200


@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    return jsonify({
        "message": "User obtenido correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users", methods=["POST"])
def create_user():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Email y password son obligatorios"}), 400

    existing_user = db.session.execute(
        select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    new_user = User(
        email=email,
        password=password,
        is_active=is_active
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User creado correctamente",
        "results": new_user.serialize()
    }), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_user = db.session.execute(
            select(User).where(
                User.email == body["email"],
                User.id != user.id
            )
        ).scalar_one_or_none()

        if existing_user:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        user.email = body["email"]

    if "password" in body and body["password"]:
        user.password = body["password"]

 
    if "is_active" in body:
        user.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "User actualizado correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "User eliminado correctamente"
    }), 200

@api.route("/login", methods=["GET"])
@jwt_required()
def private():

    current_user_id = get_jwt_identity()

    user = db.session.get(User, int(current_user_id))

    return jsonify({
        "message": "Ruta privada",
        "user": user.serialize()
    }), 200

# ====================================
# LOGIN
# ====================================

@api.route("/login", methods=["POST"])
def login():

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar un JSON válido"
        }), 400

    email = body.get("email")
    password = body.get("password")

    user = db.session.execute(
        select(User).filter_by(
            email=email,
            password=password
        )
    ).scalar_one_or_none()

    if user is None:

        return jsonify({
            "message": "Credenciales incorrectas"
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200