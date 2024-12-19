import React, { createRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, CircularProgress } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Header from "../../components/Header";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import CustomNumberInput from "../../components/NumberInput";
import logo from '../../assets/Plogger.png';

interface Entry {
    id: string;
    logId: string;
    message: string;
    status: number;
    createdAt?: string;
    userId?: string;
}

const EditEntry: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [status, setStatus] = useState<number>(0);
    const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs(Date.now.toString()));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                const response = await apiFetch(`https://localhost:7076/api/entries/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data: Entry = await response.json();
                    setEntry(data);
                    setMessage(data.message);
                    setCreatedDate(dayjs(data.createdAt))
                    setStatus(data.status)
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
        var createdAt = createdDate?.toJSON()
        var newEntry: Entry = JSON.parse(JSON.stringify(entry))
        newEntry.createdAt = createdAt !== undefined ? createdAt : newEntry.createdAt
        newEntry.message = message !== undefined ? message : newEntry.message
        newEntry.status = status !== 0 ? status : newEntry.status

        console.log(newEntry)

        try {
            const response = await apiFetch(`https://localhost:7076/api/entries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                navigate("/entries");
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
                <Header />
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
                Edit entry
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                <TextField
                    label="Entry message"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Created at"
                        value={createdDate}
                        onChange={(newValue) => setCreatedDate(newValue)}
                    />
                </LocalizationProvider>
                <CustomNumberInput value={status} onChange={(e, v) => setStatus(v !== null ? v : status)}/>
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

export default EditEntry;