import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { apiFetch } from "../../helpers/Helpers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

interface Log {
    id: string;
    description: string;
}

const PostEntry: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [status, setStatus] = useState<number | "">("");
    const [message, setMessage] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());
    const [logId, setLogId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await apiFetch("/api/logs");
                const data: Log[] = await response.json();
                setLogs(data);
            } catch (err) {
                console.error("Error fetching logs:", err);
                setError("Failed to fetch logs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await apiFetch("/api/entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                    message,
                    createdAt: createdAt?.toISOString(),
                    logId,
                }),
            });

            if (response.ok) {
                navigate("/entries");
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
                Create New Entry
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Status"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}
                    />
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="log-select-label">Log</InputLabel>
                        <Select
                            labelId="log-select-label"
                            value={logId}
                            onChange={(e) => setLogId(e.target.value)}
                            sx={{ textAlign: "left"}}
                        >
                            {logs.map((log) => (
                                <MenuItem key={log.id} value={log.id}>
                                    {log.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Created at"
                            value={createdAt}
                            onChange={(newValue) => setCreatedAt(newValue)}
                        />
                    </LocalizationProvider>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            minHeight: "10vh",
                            marginTop: "1rem",
                            justifyContent: "space-between"
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ width: "70%" }}
                        >
                            Create Entry
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ width: "20%" }}
                            onClick={() => navigate("/entries")}
                        >
                            Cancel
                        </Button>
                    </Box>
                    
                </form>
            </Paper>
            <Footer />
        </Box>
    );
};

export default PostEntry;
