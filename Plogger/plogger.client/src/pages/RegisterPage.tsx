import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { apiFetch } from "../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

type RolesType = {
  Developer: boolean;
  Client: boolean;
};

const RegisterPage = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [roles, setRoles] = useState<RolesType>({
    Developer: false,
    Client: false,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRoleChange = (role: keyof RolesType) => {
    setRoles({ ...roles, [role]: !roles[role] });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
        const selectedRoles = Object.keys(roles).filter(
            (role) => roles[role as keyof RolesType]
        );

        console.log(JSON.stringify({
            userName,
            email,
            password,
            company,
            roles: selectedRoles,
          }))

      const response = await apiFetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          company,
          roles: selectedRoles,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setUserName("");
        setEmail("");
        setPassword("");
        setCompany("");
        setRoles({ Developer: false, Client: false });
        navigate("/login");
      } else if (response.status === 422) {
        const errorText = await response.text();
        setErrorMessage(errorText);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setErrorMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
        <Logo />
      <Paper elevation={3} sx={{ padding: 4, width: "80%", maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Company"
            fullWidth
            margin="normal"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Assign Roles:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={roles.Developer}
                  onChange={() => handleRoleChange("Developer")}
                />
              }
              label="Developer"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={roles.Client}
                  onChange={() => handleRoleChange("Client")}
                />
              }
              label="Client"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={success || Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        {success ? (
          <Alert onClose={handleCloseSnackbar} severity="success">
            Registration successful!
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;