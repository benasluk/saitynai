import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Button } from "@mui/material";
import { apiFetch } from "../helpers/Helpers";
import Header from "../components/Header";
import logo from '../assets/Plogger.png';


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
            try {
                setLoading(true)
                const response = await apiFetch("https://localhost:7076/api/pipelines", {
                    method: "GET",
                    credentials: "include"
                });
                setLoading(false)

                if (response.ok) {
                    const data = await response.json();
                    setPipelines(data)
                } else {
                    console.error("Failed to fetch pipelines");
                }
            } catch (error) {
                console.error("Error fetching pipelines:", error);
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

    const handleEditPipeline = (pipelineId: string) => {
        navigate(`/pipelines/edit/${pipelineId}`);
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
            <img src={logo} width={470} />
            <Typography variant="h4" component="h1" gutterBottom>
                Pipelines
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                <List>
                    {pipelines.map((pipeline) => (
                        <ListItem key={pipeline.id} divider>
                            <ListItemText
                                primary={pipeline.name}
                                secondary={`Created At: ${new Date(pipeline.createdAt).toLocaleString()}`}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditPipeline(pipeline.id)}
                            >
                                Edit
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default HomePage;