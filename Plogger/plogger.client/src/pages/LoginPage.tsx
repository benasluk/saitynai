import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Plogger.png';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [responseMessage, setResponseMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("https://localhost:7076/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.accessToken);
                navigate("/");
                setResponseMessage("Login successful!");
            } else {
                setResponseMessage("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setResponseMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <img src={logo} width={470} />
            <Paper elevation={3} style={{ padding: "2rem", maxWidth: "400px", width: "100%" }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "1rem" }}
                    >
                        Login
                    </Button>
                </form>
                {responseMessage && (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                        style={{ marginTop: "1rem" }}
                    >
                        {responseMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default LoginPage;
