import React from "react";
import { useUser } from "./main"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

function Home(){

    const userContext = useUser();
        if (!userContext) {
            throw new Error("useUser must be used within a UserProvider");
        }
    const { setUser } = userContext;
    const { user } = userContext;
    const navigate = useNavigate()

    const handleLogout = () => {
        setUser(null); // Clear user context
        localStorage.removeItem("token"); // Remove token from local storage
        navigate("/login");
    }

    return(
        <center>
            <h1>
                User : {user ? user.name : "Guest"},  {user ? user.email : "Guest"}
            </h1>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
        </center>
    )
}

export default Home;