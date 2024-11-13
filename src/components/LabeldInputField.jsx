import React from "react";
import InputField from "./InputField";
import { Box } from "@mui/material";

const LabeldInputField = ({
    label,
    input
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "420px",
      }}
    >
      <span>{label}</span>
      {input}
    </Box>
  );
};

export default LabeldInputField;
