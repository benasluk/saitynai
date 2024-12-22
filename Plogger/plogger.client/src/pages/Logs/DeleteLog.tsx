import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

interface Log {
    id: string;
    pipelineId: string;
    description: string;
    createdAt: string;
    entries: Array<{ id: string; message: string; status: number; createdAt: string }>;
}

const DeleteLog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [log, setLog] = useState<Log | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const response = await apiFetch(`/api/logs/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data: Log = await response.json();
                    setLog(data);
                } else {
                    setError("Failed to fetch log. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching log:", err);
                setError("An error occurred while fetching the log.");
            } finally {
                setLoading(false);
            }
        };

        fetchLog();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            const response = await apiFetch(`/api/logs/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                navigate("/logs");
            } else {
                setError("Failed to delete log. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting log:", err);
            setError("An error occurred while deleting the log.");
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
                Delete Log
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                {log && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1">
                            <strong>Description:</strong> {log.description}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Pipeline ID:</strong> {log.pipelineId}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(log.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Number of Entries:</strong> {log.entries.length}
                        </Typography>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDelete}
                            >
                                Confirm Delete
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/logs")}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
            <Footer />
        </Box>
    );
};

export default DeleteLog;