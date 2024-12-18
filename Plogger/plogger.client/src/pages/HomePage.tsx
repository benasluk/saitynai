import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress } from "@mui/material";

const HomePage: React.FC = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
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
            const token = localStorage.getItem("authToken");
            console.log(token)

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("https://localhost:7076/api/pipelines", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Pipeline[] = await response.json();
                    setPipelines(data);
                } else {
                    setError("Failed to fetch pipelines. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching pipelines:", err);
                setError("An error occurred while fetching pipelines.");
            } finally {
                setLoading(false);
            }
        };

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

    return (
        <Box p={3}>
            <Typography variant="h4" component="h1" gutterBottom>
                Pipelines
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem" }}>
                <List>
                    {pipelines.map((pipeline) => (
                        <ListItem key={pipeline.id} divider>
                            <ListItemText
                                primary={pipeline.name}
                                secondary={`Created At: ${new Date(pipeline.createdAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default HomePage;