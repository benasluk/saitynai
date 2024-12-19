import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Header from "../../components/Header";
import Logo from "../../components/Logo";

interface Entry {
    id: string;
    logId: string;
    message: string;
    status: number;
    createdAt: string;
    userId?: string;
}

const DeleteEntry: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await apiFetch(`https://localhost:7076/api/entries/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data: Entry = await response.json();
                    setEntry(data);
                } else {
                    setError("Failed to fetch entry. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching entry:", err);
                setError("An error occurred while fetching the entry.");
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            const response = await apiFetch(`https://localhost:7076/api/entries/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                navigate("/entries");
            } else {
                setError("Failed to delete entry. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting entry:", err);
            setError("An error occurred while deleting the entry.");
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
                Delete Entry
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                {entry && (
                    <Box sx={{mt: 3}}>
                        <Typography variant="body1">
                            <strong>Message:</strong> {entry.message}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {entry.status}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Log ID:</strong> {entry.logId}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(entry.createdAt).toLocaleString()}
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
                                onClick={() => navigate("/entries")}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default DeleteEntry;