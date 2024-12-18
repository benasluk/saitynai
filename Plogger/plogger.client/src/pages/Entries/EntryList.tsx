import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress } from "@mui/material";
import Header from "../../components/Header";

interface Entry {
    id: string;
    logId: string;
    message: string;
    status: number;
    createdAt: string;
    userId?: string;
}

const EntryList: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntries = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                window.location.href = "/login";
                return;
            }

            try {
                const response = await fetch("https://localhost:7076/api/entries/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Entry[] = await response.json();
                    setEntries(data);
                } else {
                    setError("Failed to fetch entries. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching entries:", err);
                setError("An error occurred while fetching entries.");
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, []);

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
                Entries
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem" }}>
                <Header />
                <List>
                    {entries.map((entry) => (
                        <ListItem key={entry.id} divider>
                            <ListItemText
                                primary={`Message: ${entry.message}`}
                                secondary={`Status: ${entry.status} | Created At: ${new Date(entry.createdAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default EntryList;