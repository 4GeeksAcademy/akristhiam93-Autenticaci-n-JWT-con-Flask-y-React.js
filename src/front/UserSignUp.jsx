import React, { useState } from "react"
import useGlobalReducer from "./hooks/useGlobalReducer"
import { Link } from "react-router-dom"

export const UserSignUp = () => {

    const { signup } = useGlobalReducer()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {

        e.preventDefault()

        const data = await signup(email, password)

        alert(data.message)
    }

    return (

        <div className="container mt-5">

            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary">
                    Registrarse
                </button>

                <Link to="/login">

                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                    >
                        Cancelar
                    </button>

                </Link>

            </form>

        </div>
    )
}