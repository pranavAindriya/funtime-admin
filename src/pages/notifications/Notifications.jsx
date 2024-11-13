import { Box, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import TopAddNewBar from "../../components/TopAddNewBar";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [validationErrors, setValidationErrors] = useState();

  const theme = useTheme();

  const navigte = useNavigate();

  return (
    <>
      <Box
        sx={{
          padding: "25px",
          backgroundColor: theme.palette.secondary.light,
          borderRadius: "10px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "16px" }}>
          Notification API
        </span>
        <InputField
          styles={{
            flexGrow: { xs: 1, sm: 0.3 },
          }}
          value={""}
          error={validationErrors}
          setError={setValidationErrors}
          name={""}
        />
        <Button variant="contained">Update</Button>
      </Box>
      <TopAddNewBar
        label={"Push Notification List"}
        onAddButtonClick={() => navigte("/notifications/addnew")}
      />
      <DataTable />
    </>
  );
};

export default Notifications;
