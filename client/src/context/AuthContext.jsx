import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const getCookie = () => {
        const cookieArray = document.cookie.split(";");
        if (cookieArray) {
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i].trim();
                if (cookie.startsWith("user=")) {
                    let value = cookie.substring("user=".length, cookie.length);
                    // remove path=/; from cookie
                    value = value.substring(0, value.length - 7);

                    return JSON.parse(value);
                }
            }
        }
        return null;
    };

    const currentCookie = getCookie();
    const [user, setUser] = useState(currentCookie);
    const [authTokens, setAuthTokens] = useState(
        currentCookie ? currentCookie.authTokens : null
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const registerUser = async (event, handleNext) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}users/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: formData.get("firstName"),
                    user_name: formData.get("username"),
                    last_name: formData.get("lastName"),
                    email: formData.get("email"),
                    bio: formData.get("bio"),
                    password: formData.get("password"),
                }),
            }
        );

        const data = await response.json();

        console.log(data);

        if (response.status === 201) {
            setAuthTokens(data);
            const user = {
                user_name: formData.get("username"),
                authTokens: data,
            };
            setUser(user);
            document.cookie = `user=${JSON.stringify(user)} path=/;`;
            handleNext();
        } else {
            if (response.status === 400) {
                if (data.email) {
                    alert("Email is already in use");
                }
                if (data.user_name) {
                    alert("Username is already in use");
                }
            } else {
                alert("Something went wrong");
            }
        }
    };

    let loginUser = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}users/login/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_name: formData.get("user_name"),
                    password: formData.get("password"),
                }),
            }
        );

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            const user = {
                user_name: formData.get("user_name"),
                authTokens: data,
            };
            setUser(user);
            document.cookie = `user=${JSON.stringify(user)} path=/;`;
            navigate("/dashboard");
        } else {
            alert("Something went wrong");
        }
    };

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        // delete cookie by setting expiry date to past
        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    let updateToken = async () => {
        console.log("Update Token Called");

        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}users/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authTokens?.access,
                },
                body: JSON.stringify({
                    refresh: authTokens?.refresh,
                }),
            }
        );
        let data = await response.json();

        console.log(data);

        if (response.status === 200) {
            setAuthTokens(data);
            const curUser = {
                user_name: user.user_name,
                authTokens: data,
            };
            setUser(curUser);
            document.cookie = `user=${JSON.stringify(curUser)} path=/;`;
        } else {
            logoutUser();
        }

        console.log(loading);

        if (loading) {
            setLoading(false);
        }
    };

    let contextData = {
        user: user,
        loginUser: loginUser,
        registerUser: registerUser,
        logoutUser: logoutUser,
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        const timeToRefresh = 1000 * 60 * 150;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, timeToRefresh);
        return () => {
            clearInterval(interval);
        };
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
