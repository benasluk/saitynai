import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

const Footer: React.FC = () => {
    const token = localStorage.getItem("authToken");

    const getUserName = (): string | null => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Unknown User";
        } catch (e) {
            console.error("Error parsing token payload", e);
            return "Unknown User";
        }
    };

    const userName = getUserName();

    return (
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
            <Toolbar>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Typography variant="body1" sx={{fontFamily: "'Playfair Display', sans-serif"}}>&copy; 2024 Plogger</Typography>
                    <Typography variant="body1" sx={{fontFamily: "'Playfair Display', sans-serif"}}>Logged in as: {userName}</Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;