import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Button } from "@mui/material";
import Header from "../../components/Header";
import { apiFetch } from "../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/Plogger.png';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await apiFetch("https://localhost:7076/api/entries/", {
                    method: "GET",
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

    const handleEditEntry = (entryId: string) => {
        navigate(`/entries/edit/${entryId}`);
    };

    const handleDeleteEntry = (entryId: string) => {
        navigate(`/entries/delete/${entryId}`);
    };

    const handleCreateEntry = () => {
        navigate(`/entries/create/`);
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
            <img src={logo} width={470} />
            <Typography variant="h4" component="h1" gutterBottom>
                Entries
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                <List>
                    <ListItem>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleCreateEntry()}
                        >
                            Create new entry
                        </Button>
                    </ListItem>
                    {entries.map((entry) => (
                        <ListItem key={entry.id} divider>
                            <ListItemText
                                primary={`Message: ${entry.message}`}
                                secondary={`Status: ${entry.status} | Created At: ${new Date(entry.createdAt).toLocaleString()}`}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditEntry(entry.id)}
                                sx={{ml: "10px"}}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteEntry(entry.id)}
                                sx={{ml: "10px"}}
                            >
                                Delete
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default EntryList;