import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Button } from "@mui/material";
import { apiFetch } from "../helpers/Helpers";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    interface Pipeline {
        id: string;
        name: string;
        createdAt: string;
    }

    useEffect(() => {
        const fetchPipelines = async () => {
            try {
                setLoading(true);
                const response = await apiFetch("/api/pipelines", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setPipelines(data);
                } else {
                    console.error("Failed to fetch pipelines");
                }
            } catch (error) {
                console.error("Error fetching pipelines:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRoles = () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const userRoles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
                    setRoles(Array.isArray(userRoles) ? userRoles : [userRoles]);
                } catch (error) {
                    console.error("Error parsing token payload:", error);
                }
            }
        };

        fetchRoles();
        fetchPipelines();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    const handleEditPipeline = (pipelineId: string) => {
        navigate(`/pipelines/edit/${pipelineId}`);
    };

    const handleCreatePipeline = () => {
        navigate(`/pipelines/create/`);
    };

    const handleDeletePipeline = (id: string) => {
        navigate(`/pipelines/delete/${id}`);
    };

    return (
        <Box
            p={3}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Logo />
            <Typography variant="h4" component="h1" gutterBottom>
                Pipelines
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                <List>
                    {roles.includes("Developer") && (
                        <ListItem>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleCreatePipeline()}
                            >
                                Create new pipeline
                            </Button>
                        </ListItem>
                    )}
                    {pipelines.map((pipeline) => (
                        <ListItem key={pipeline.id} divider>
                            <ListItemText
                                primary={pipeline.name}
                                secondary={`Created At: ${new Date(pipeline.createdAt).toLocaleString()}`}
                            />
                            {roles.includes("Developer") && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEditPipeline(pipeline.id)}
                                >
                                    Edit
                                </Button>
                            )}
                            {roles.includes("Admin") && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeletePipeline(pipeline.id)}
                                    sx={{ ml: "10px" }}
                                >
                                    Delete
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Footer />
        </Box>
    );
};

export default HomePage;