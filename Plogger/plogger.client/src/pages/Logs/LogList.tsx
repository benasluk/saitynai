import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Button } from "@mui/material";
import { apiFetch } from "../../helpers/Helpers";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";

interface Log {
    id: string;
    pipelineId: string;
    description: string;
    createdAt: string;
    entries: { id: string }[];
}

const LogList: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
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
        const fetchRoles = () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const userRoles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
                    setRoles(Array.isArray(userRoles) ? userRoles : [userRoles]);
                } catch (error) {
                    console.error("Error parsing token payload:", error);
                }
            }
        };

        fetchRoles();
        fetchLogs();
    }, []);

    const handleEditLog = (logId: string) => {
        navigate(`/logs/edit/${logId}`);
    };

    const handleDeleteLog = (logId: string) => {
        navigate(`/logs/delete/${logId}`);
    };

    const handleCreateLog = () => {
        navigate(`/logs/create/`);
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
                Logs
            </Typography>
            <Paper elevation={3} style={{ padding: "1rem", margin: "0", width: "80%" }}>
                <Header />
                <List>
                    {roles.includes("Developer") && (
                        <ListItem>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleCreateLog()}
                            >
                                Create new log
                            </Button>
                        </ListItem>
                    )}
                    {logs.map((log) => (
                        <ListItem key={log.id} divider>
                            <ListItemText
                                primary={log.description}
                                secondary={`Created At: ${new Date(log.createdAt).toLocaleString()} | Entries: ${log.entries.length}`}
                            />
                            {roles.includes("Developer") && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEditLog(log.id)}
                                    sx={{ml: "10px"}}
                                >
                                    Edit
                                </Button>
                            )}
                            {roles.includes("Admin") && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeleteLog(log.id)}
                                    sx={{ml: "10px"}}
                                >
                                    Delete
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Footer />
        </Box>
    );
};

export default LogList;