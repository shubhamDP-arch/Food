import {createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const storeTokenInLS = (token) => {
        setToken(token)
        localStorage.setItem("token", tok)
    }

    const backapi = "http://localhost:5000"

    const LogoutUser = () => {
        setToken("")
        localStorage.removeItem("token")
    }
    const getMyDetails = async() => {
        if(token){
            setIsLoading(true)
            try {
                const response = await fetch(`${backapi}/api/auth/getmydetails`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const message = await response.json()
                    setData(message.detail)
                    setIsLoading(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getMyDetails()
    }, [])

    return(
        <>
            <AuthContext.Provider value={{storeTokenInLS, token, LogoutUser, data}}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext)
    return authContextValue
}