import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { apiFetch } from "../../helpers/Helpers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

interface Entry {
    message: string;
    status: number;
    createdAt: string;
}

interface Log {
    description: string;
    createdAt: string;
    entries: Entry[];
}

interface Pipeline {
    name: string;
    createdAt: string;
    logs: Log[];
}

const CreatePipeline: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());
    const [logs, setLogs] = useState<Log[]>([]);
    const [newLogDescription, setNewLogDescription] = useState<string>("");
    const [newLogCreatedAt, setNewLogCreatedAt] = useState<Dayjs | null>(dayjs());
    const [newLogEntries, setNewLogEntries] = useState<Entry[]>([]);
    const [newEntryMessage, setNewEntryMessage] = useState<string>("");
    const [newEntryStatus, setNewEntryStatus] = useState<number | "">("");
    const navigate = useNavigate();

    const handleSave = async () => {
        const newPipeline: Pipeline = {
            name,
            createdAt: createdAt?.toISOString() || new Date().toISOString(),
            logs,
        };

        try {
            const response = await apiFetch(`/api/pipelines`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPipeline),
            });

            if (response.ok) {
                navigate("/");
            } else {
                console.error("Failed to create pipeline. Please try again.");
            }
        } catch (err) {
            console.error("Error creating pipeline:", err);
        }
    };

    const handleAddLog = () => {
        const newLog: Log = {
            description: newLogDescription,
            createdAt: newLogCreatedAt?.toISOString() || new Date().toISOString(),
            entries: newLogEntries,
        };
        setLogs([...logs, newLog]);
        setNewLogDescription("");
        setNewLogCreatedAt(dayjs());
        setNewLogEntries([]);
    };

    const handleAddEntryToNewLog = () => {
        const newEntry: Entry = {
            message: newEntryMessage,
            status: Number(newEntryStatus),
            createdAt: new Date().toISOString(),
        };
        setNewLogEntries([...newLogEntries, newEntry]);
        setNewEntryMessage("");
        setNewEntryStatus("");
    };

    const handleRemoveEntryFromNewLog = (entryIndex: number) => {
        const updatedEntries = newLogEntries.filter((_, index) => index !== entryIndex);
        setNewLogEntries(updatedEntries);
    };

    const handleRemoveLog = (logIndex: number) => {
        const updatedLogs = logs.filter((_, index) => index !== logIndex);
        setLogs(updatedLogs);
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
            <Logo />
            <Typography variant="h4" component="h1" gutterBottom>
                Create Pipeline
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <TextField
                    label="Pipeline Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Created At"
                        value={createdAt}
                        onChange={(newValue) => setCreatedAt(newValue)}
                    />
                </LocalizationProvider>
                <Typography variant="h6" gutterBottom>
                    Logs
                </Typography>
                <List>
                    {logs.map((log, index) => (
                        <ListItem key={index} divider>
                            <TextField
                                label="Log Description"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={log.description}
                                disabled
                            />
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => handleRemoveLog(index)}
                            >
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6">Add New Log</Typography>
                <TextField
                    label="Log Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newLogDescription}
                    onChange={(e) => setNewLogDescription(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Log Created At"
                        value={newLogCreatedAt}
                        onChange={(newValue) => setNewLogCreatedAt(newValue)}
                    />
                </LocalizationProvider>
                <Typography variant="h6">Add Entries to New Log</Typography>
                <List>
                    {newLogEntries.map((entry, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={`Message: ${entry.message}, Status: ${entry.status}`}
                                secondary={`Created At: ${new Date(entry.createdAt).toLocaleString()}`}
                            />
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => handleRemoveEntryFromNewLog(index)}
                            >
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <TextField
                    label="Entry Message"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newEntryMessage}
                    onChange={(e) => setNewEntryMessage(e.target.value)}
                />
                <TextField
                    label="Entry Status"
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
                    onClick={handleAddEntryToNewLog}
                    style={{ marginTop: "1rem" }}
                >
                    Add Entry
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddLog}
                    style={{ marginTop: "1rem" }}
                >
                    Add Log
                </Button>
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ width: "68%" }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/")}
                        sx={{ width: "28%" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
            <Footer />
        </Box>
    );
};

export default CreatePipeline;