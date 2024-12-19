import React from "react";
import logo from "../assets/Plogger.png";
import { Box } from "@mui/material";

const Logo: React.FC = () => {
    return (
        <Box
            component="img"
            src={logo}
            alt="Plogger Logo"
            sx={{
                width: "100%",
                maxWidth: "470px",
                minWidth: "240px",
                height: "auto",
            }}
        />
    );
};

export default Logo;