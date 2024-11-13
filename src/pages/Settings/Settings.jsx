import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import InputField from "../../components/InputField";

const Settings = () => {
  const [settingDetails, setSettingsDetails] = useState({
    paymentGatewaySetting: {
      secretKey: "",
      stripeKey: "",
    },
    forceUpdate: {
      appVersion: "",
    },
  });

  const [editMode, setEditMode] = useState({
    paymentGatewaySetting: false,
    forceUpdate: false,
  });

  const theme = useTheme();

  const [validationError, setValidationError] = useState();
  const handleEdit = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: true }));
  };

  const handleSave = async (section) => {
    let payload = {};
    switch (section) {
      case "paymentGatewaySetting":
        payload = {
          paymentGatewaySetting: {
            secretKey: settingDetails.paymentGatewaySetting.secretKey,
            stripeKey: settingDetails.paymentGatewaySetting.stripeKey,
          },
        };
        break;
      case "forceUpdate":
        payload = {
          forceUpdate: {
            appVersion: settingDetails.forceUpdate.appVersion,
          },
        };
        break;
      default:
        break;
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettingsDetails((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  return (
    <Box
      sx={{
        display: "grid",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: "20px",
        }}
      >
        <Typography fontWeight={600} fontSize={20}>
          Payment Gateway Settings
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.secondary,
            padding: "30px 20px",
            borderRadius: "10px",
            alignItems: "flex-end",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ width: "100px" }}>Stripe Key</Typography>
              <InputField
                value={settingDetails.paymentGatewaySetting.stripeKey}
                styles={{ width: "300px", height: "30px" }}
                disabled={!editMode.paymentGatewaySetting}
                onChange={(e) =>
                  handleInputChange(
                    "paymentGatewaySetting",
                    "stripeKey",
                    e.target.value
                  )
                }
                error={validationError}
                setError={setValidationError}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ width: "100px" }}>Secret Key</Typography>
              <InputField
                value={settingDetails.paymentGatewaySetting.secretKey}
                styles={{ width: "300px", height: "30px" }}
                disabled={!editMode.paymentGatewaySetting}
                onChange={(e) =>
                  handleInputChange(
                    "paymentGatewaySetting",
                    "secretKey",
                    e.target.value
                  )
                }
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              sx={{ height: "30px" }}
              variant="contained"
              onClick={() => handleSave("paymentGatewaySetting")}
              disabled={!editMode.paymentGatewaySetting}
            >
              Save
            </Button>
            <Button
              sx={{ height: "30px" }}
              variant="outlined"
              onClick={() => handleEdit("paymentGatewaySetting")}
              disabled={editMode.paymentGatewaySetting}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: "20px",
        }}
      >
        <Typography fontWeight={600} fontSize={20}>
          Force Update
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "background.secondary",
            padding: "30px 20px",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Typography sx={{ width: "100px" }}>App Version</Typography>
            <InputField
              value={settingDetails.forceUpdate.appVersion}
              styles={{ width: "300px", height: "30px" }}
              disabled={!editMode.forceUpdate}
              onChange={(e) =>
                handleInputChange("forceUpdate", "appVersion", e.target.value)
              }
              error={validationError}
              setError={setValidationError}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              sx={{ height: "30px" }}
              variant="contained"
              onClick={() => handleSave("forceUpdate")}
              disabled={!editMode.forceUpdate}
            >
              Save
            </Button>
            <Button
              sx={{ height: "30px" }}
              variant="outlined"
              onClick={() => handleEdit("forceUpdate")}
              disabled={editMode.forceUpdate}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
