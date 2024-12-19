import React from "react";
import { Typography, Button, AppBar, Toolbar, Box, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    function handleNavigate(url: string) {
        navigate(url);
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: isMobile ? "center" : "space-between",
                        alignItems: "center",
                        width: "100%",
                        gap: isMobile ? 2 : 0,
                    }}
                >
                    <Typography variant="h6" sx={{ textAlign: isMobile ? "center" : "inherit" }}>Plogger</Typography>
                    <Button color="inherit" onClick={() => handleNavigate("/")}>Pipelines</Button>
                    <Button color="inherit" onClick={() => handleNavigate("/logs")}>Logs</Button>
                    <Button color="inherit" onClick={() => handleNavigate("/entries")}>Entries</Button>
                    <Button color="error" variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;