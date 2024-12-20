import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
} from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

const DeletePipeline: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pipelineName, setPipelineName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                const response = await apiFetch(`/api/pipelines/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPipelineName(data.name);
                } else {
                    setError("Failed to fetch pipeline details. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching pipeline:", err);
                setError("An error occurred while fetching the pipeline.");
            } finally {
                setLoading(false);
            }
        };

        fetchPipeline();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await apiFetch(`/api/pipelines/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                navigate("/");
            } else {
                setError("Failed to delete pipeline. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting pipeline:", err);
            setError("An error occurred while deleting the pipeline.");
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
                Delete Pipeline
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Typography variant="body1">
                    Are you sure you want to delete the pipeline "{pipelineName}"?
                </Typography>
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        sx={{ width: "45%" }}
                    >
                        Confirm Delete
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/")}
                        sx={{ width: "45%" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
            <Footer />
        </Box>
    );
};

export default DeletePipeline;