import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";

// Crear contexto
const StoreContext = createContext()

// Provider
export function StoreProvider({ children }) {

    const [store, dispatch] = useReducer(
        storeReducer,
        initialStore()
    )

    // =========================
    // SIGNUP
    // =========================

    const signup = async (email, password) => {

        try {

            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const data = await response.json()

            dispatch({
                type: "signup"
            })

            return data

        } catch (error) {

            console.log(error)
        }
    }

    // =========================
    // LOGIN
    // =========================

    const login = async (email, password) => {

        try {

            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const data = await response.json()

            if (data.token) {

                dispatch({
                    type: "login",
                    payload: data
                })
            }

            return data

        } catch (error) {

            console.log(error)
        }
    }

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        dispatch({
            type: "logout"
        })
    }

    return (

        <StoreContext.Provider
            value={{
                store,
                dispatch,
                signup,
                login,
                logout
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}

// Hook personalizado
export default function useGlobalReducer() {

    const context = useContext(StoreContext)

    return context
}