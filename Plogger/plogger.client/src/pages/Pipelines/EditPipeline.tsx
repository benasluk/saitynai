import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, CircularProgress } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";


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
            try {
                const response = await apiFetch(`/api/pipelines/${id}`, {
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
        var newPipeline: Pipeline = JSON.parse(JSON.stringify(pipeline))
        newPipeline.name = name
        try {
            const response = await apiFetch(`/api/pipelines/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPipeline),
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
                <Logo />
                <Header />
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Logo />
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Pipeline
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0 auto", width: "80%" }}>
            <Header />
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
            <Footer />
        </Box>
    );
};

export default EditPipeline;