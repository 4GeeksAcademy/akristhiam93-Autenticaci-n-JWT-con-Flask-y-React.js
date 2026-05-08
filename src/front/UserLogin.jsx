import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useGlobalReducer from "./hooks/useGlobalReducer"

export const UserLogin = () => {

    const { login } = useGlobalReducer()

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {

        e.preventDefault()

        const data = await login(email, password)

        if (data.token) {

            navigate("/")

        } else {

            alert("Credenciales incorrectas")
        }
    }

    return (

        <div className="container mt-5">

            <h1>Login</h1>

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

                <button className="btn btn-success">
                    Login
                </button>

                <div className="mt-3">

                    <Link to="/signup">

                        <button className="btn btn-primary">

                            Crear usuario

                        </button>

                    </Link>

                </div>

            </form>

        </div>
    )
}