import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("https://localhost:7076/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                localStorage.removeItem("authToken");
                navigate("/login");
            } else {
                console.error("Failed to log out.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    function handleNavigate(url:string){
        navigate(url)
    }

    return (
        <AppBar position="static">
            <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Plogger</Typography>
                <Button color="inherit" onClick={() => {handleNavigate("/")}}>
                    Pipelines
                </Button>
                <Button color="inherit" onClick={() => {handleNavigate("/entries")}}>
                    Entries
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;