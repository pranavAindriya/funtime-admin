import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import { getSettings, updateSettings } from "../../service/allApi";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { hasPermission } from "../../redux/slices/authSlice";

const Settings = () => {
  const [settingDetails, setSettingsDetails] = useState({
    razorPayKey: "",
    razorPaySecret: "",
  });

  const [editMode, setEditMode] = useState(false);

  const theme = useTheme();

  const [validationError, setValidationError] = useState();

  const fetchSettings = async () => {
    const response = await getSettings();
    if (response.status === 200) {
      setSettingsDetails({
        razorPayKey: response.data.RAZORPAY_KEY_ID,
        razorPaySecret: response.data.RAZORPAY_KEY_SECRET,
      });
    } else {
      toast.error("Failed to fetch payment settings details", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const handleSave = async () => {
    const response = await updateSettings({
      RAZORPAY_KEY_ID: settingDetails.razorPayKey,
      RAZORPAY_KEY_SECRET: settingDetails.razorPaySecret,
    });
    if (response.status === 200) {
      setEditMode(false);
      toast.success("Payment Settings Updated Successfully", {
        autoClose: 1000,
        transition: Slide,
      });
    } else {
      toast.error("Payment Settings Updation Failed", {
        autoClose: 1000,
        transition: Slide,
      });
    }
    console.log(response);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettingsDetails((prev) => ({ ...prev, [name]: value }));
  };

  console.log(settingDetails);

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h4">
          You do not have access to this page
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: "40px",
      }}
    >
      <ToastContainer position="top-center" transition={"Slide"} />

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
            gap: 4,
            flexWrap: "wrap",
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
              <Typography sx={{ width: "100px" }}>Razorpay Key</Typography>
              <InputField
                name={"razorPayKey"}
                value={settingDetails.razorPayKey}
                styles={{ width: "300px", height: "30px" }}
                disabled={!editMode}
                onChange={handleInputChange}
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
              <Typography sx={{ width: "100px" }}>Razorpay Secret</Typography>
              <InputField
                name={"razorPaySecret"}
                value={settingDetails.razorPaySecret}
                styles={{ width: "300px", height: "30px" }}
                disabled={!editMode}
                onChange={handleInputChange}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              marginLeft: "auto",
              marginTop: "auto",
            }}
          >
            <Button
              sx={{ height: "30px" }}
              variant="contained"
              onClick={handleSave}
              disabled={!editMode}
            >
              Save
            </Button>
            <Button
              sx={{ height: "30px" }}
              variant="outlined"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
