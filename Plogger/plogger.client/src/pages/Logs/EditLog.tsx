import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { apiFetch } from "../../helpers/Helpers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

interface Entry {
    id: string;
    logId: string;
    message: string;
    status: number;
    createdAt: string;
    userId?: string;
}

interface Log {
    id: string;
    pipelineId: string;
    description: string;
    createdAt: string;
    entries: Entry[];
}

const EditLog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [log, setLog] = useState<Log | null>(null);
    const [description, setDescription] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());
    const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newEntryMessage, setNewEntryMessage] = useState<string>("");
    const [newEntryStatus, setNewEntryStatus] = useState<number | "">("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const logResponse = await apiFetch(`/api/logs/${id}`);
                const logData: Log = await logResponse.json();
                setLog(logData);
                setDescription(logData.description);
                setCreatedAt(dayjs(logData.createdAt));
                setSelectedEntries(logData.entries);
            } catch (err) {
                console.error("Error fetching log:", err);
                setError("Failed to fetch log. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLog();
    }, [id]);

    const handleSave = async () => {
        var createdDate = createdAt?.toJSON()
        var newLog: Log = JSON.parse(JSON.stringify(log))
        newLog.createdAt = createdDate  !== undefined ? createdDate : newLog.createdAt
        newLog.description = description
        newLog.entries = selectedEntries
        console.log(JSON.stringify(newLog))
        try {
            const response = await apiFetch(`/api/logs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newLog),
            });

            if (response.ok) {
                navigate("/logs");
            } else {
                setError("Failed to update log. Please try again.");
            }
        } catch (err) {
            console.error("Error saving log:", err);
            setError("An error occurred while saving the log.");
        }
    };

    const handleRemoveEntry = async (entryId: string) => {
        var newEntries = selectedEntries.filter((entry) => entry.id !== entryId) 
        await setSelectedEntries(newEntries);
        console.log(selectedEntries)
    };

    const handleCreateEntry = async () => {
        try {
            const response = await apiFetch("/api/entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: newEntryMessage,
                    status: newEntryStatus,
                    logId: log?.id,
                    createdAt: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                const newEntry: Entry = await response.json();
                setSelectedEntries([...selectedEntries, newEntry]);
                setNewEntryMessage("");
                setNewEntryStatus("");
            } else {
                setError("Failed to create entry. Please try again.");
            }
        } catch (err) {
            console.error("Error creating entry:", err);
            setError("An error occurred while creating the entry.");
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
                Edit Log
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Created at"
                        value={createdAt}
                        onChange={(newValue) => setCreatedAt(newValue)}
                    />
                </LocalizationProvider>
                <Typography variant="h6" gutterBottom>
                    Entries
                </Typography>
                <List>
                    {selectedEntries.map((entry) => (
                        <ListItem key={entry.id} divider>
                            <ListItemText
                                primary={entry.message}
                                secondary={`Status: ${entry.status} | Created At: ${new Date(entry.createdAt).toLocaleString()}`}
                            />
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => handleRemoveEntry(entry.id)}
                            >
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6" gutterBottom>
                    Add New Entry
                </Typography>
                <TextField
                    label="Message"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newEntryMessage}
                    onChange={(e) => setNewEntryMessage(e.target.value)}
                />
                <TextField
                    label="Status"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newEntryStatus}
                    onChange={(e) => setNewEntryStatus(Number(e.target.value))}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateEntry}
                    style={{ marginTop: "1rem" }}
                >
                    Create Entry
                </Button>
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{width: "68%"}}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/logs")}
                        sx={{width: "28%"}}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
            <Footer />
        </Box>
    );
};

export default EditLog;