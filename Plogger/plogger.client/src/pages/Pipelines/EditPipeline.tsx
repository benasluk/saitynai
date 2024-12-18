import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, CircularProgress } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";

interface Pipeline {
    id: string;
    name: string;
    createdAt: string;
}

const EditPipeline: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPipeline = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await apiFetch(`https://localhost:7076/api/pipelines/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data: Pipeline = await response.json();
                    setPipeline(data);
                    setName(data.name);
                } else {
                    setError("Failed to fetch pipeline. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching pipeline:", err);
                setError("An error occurred while fetching the pipeline.");
            } finally {
                setLoading(false);
            }
        };

        fetchPipeline();
    }, [id, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await apiFetch(`https://localhost:7076/api/pipelines/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                navigate("/");
            } else {
                setError("Failed to save pipeline. Please try again.");
            }
        } catch (err) {
            console.error("Error saving pipeline:", err);
            setError("An error occurred while saving the pipeline.");
        }
    };

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
            <Paper elevation={3} style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Pipeline
                </Typography>
                <TextField
                    label="Pipeline Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ marginTop: "1rem" }}
                >
                    Save
                </Button>
            </Paper>
        </Box>
    );
};

export default EditPipeline;