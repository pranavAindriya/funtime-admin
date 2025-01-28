import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import {
  getSettings,
  updateSettings,
  getVersionById,
  updateVersion,
} from "../../service/allApi";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { hasPermission } from "../../redux/slices/authSlice";

const versionId = "6788be30a4a8627bf19d6082";

const Settings = () => {
  const [settingDetails, setSettingsDetails] = useState({
    razorPayKey: "",
    razorPaySecret: "",
  });

  const [versionDetails, setVersionDetails] = useState({
    versionNumber: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [versionEditMode, setVersionEditMode] = useState(false);

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

  const fetchVersion = async () => {
    const response = await getVersionById(versionId);
    if (response.status === 200) {
      setVersionDetails({
        versionNumber: response.data.version.versionNumber,
      });
    } else {
      toast.error("Failed to fetch version details", {
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
  };

  const handleVersionSave = async () => {
    const response = await updateVersion(versionId, {
      versionNumber: versionDetails.versionNumber,
    });
    if (response.status === 200) {
      setVersionEditMode(false);
      toast.success("Version Updated Successfully", {
        autoClose: 1000,
        transition: Slide,
      });
    } else {
      toast.error("Version Updation Failed", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettingsDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleVersionInputChange = (e) => {
    const { name, value } = e.target;
    setVersionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  useEffect(() => {
    fetchSettings();
    fetchVersion();
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
    // <Box
    //   sx={{
    //     display: "grid",
    //     gap: "40px",
    //   }}
    // >
    //   <ToastContainer position="top-center" transition={"Slide"} />

    //   <Box
    //     sx={{
    //       display: "grid",
    //       gap: "20px",
    //     }}
    //   >
    //     <Typography fontWeight={600} fontSize={20}>
    //       Payment Gateway Settings
    //     </Typography>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         backgroundColor: theme.palette.background.secondary,
    //         padding: "30px 20px",
    //         borderRadius: "10px",
    //         gap: 4,
    //         flexWrap: "wrap",
    //       }}
    //     >
    //       <Box
    //         sx={{
    //           display: "grid",
    //           gap: "20px",
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: "flex",
    //             gap: "20px",
    //             alignItems: "center",
    //             flexGrow: 1,
    //           }}
    //         >
    //           <Typography sx={{ width: "100px" }}>Razorpay Key</Typography>
    //           <InputField
    //             name={"razorPayKey"}
    //             value={settingDetails.razorPayKey}
    //             styles={{ width: "300px", height: "30px" }}
    //             disabled={!editMode}
    //             onChange={handleInputChange}
    //             error={validationError}
    //             setError={setValidationError}
    //           />
    //         </Box>
    //         <Box
    //           sx={{
    //             display: "flex",
    //             gap: "20px",
    //             alignItems: "center",
    //             flexGrow: 1,
    //           }}
    //         >
    //           <Typography sx={{ width: "100px" }}>Razorpay Secret</Typography>
    //           <InputField
    //             name={"razorPaySecret"}
    //             value={settingDetails.razorPaySecret}
    //             styles={{ width: "300px", height: "30px" }}
    //             disabled={!editMode}
    //             onChange={handleInputChange}
    //             error={validationError}
    //             setError={setValidationError}
    //           />
    //         </Box>
    //       </Box>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           gap: "10px",
    //           marginLeft: "auto",
    //           marginTop: "auto",
    //         }}
    //       >
    //         <Button
    //           sx={{ height: "30px" }}
    //           variant="contained"
    //           onClick={handleSave}
    //           disabled={!editMode}
    //         >
    //           Save
    //         </Button>
    //         <Button
    //           sx={{ height: "30px" }}
    //           variant="outlined"
    //           onClick={() => setEditMode(!editMode)}
    //         >
    //           {editMode ? "Cancel" : "Edit"}
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Box>

    //   <Box
    //     sx={{
    //       display: "grid",
    //       gap: "20px",
    //     }}
    //   >
    //     <Typography fontWeight={600} fontSize={20}>
    //       App Version Control
    //     </Typography>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         backgroundColor: theme.palette.background.secondary,
    //         padding: "30px 20px",
    //         borderRadius: "10px",
    //         gap: 4,
    //         flexWrap: "wrap",
    //       }}
    //     >
    //       <Box
    //         sx={{
    //           display: "grid",
    //           gap: "20px",
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: "flex",
    //             gap: "20px",
    //             alignItems: "center",
    //             flexGrow: 1,
    //           }}
    //         >
    //           <Typography sx={{ width: "100px" }}>Version Number</Typography>
    //           <InputField
    //             name={"versionNumber"}
    //             value={versionDetails.versionNumber}
    //             styles={{ width: "300px", height: "30px" }}
    //             disabled={!versionEditMode}
    //             onChange={handleVersionInputChange}
    //             error={validationError}
    //             setError={setValidationError}
    //           />
    //         </Box>
    //       </Box>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           gap: "10px",
    //           marginLeft: "auto",
    //           marginTop: "auto",
    //         }}
    //       >
    //         <Button
    //           sx={{ height: "30px" }}
    //           variant="contained"
    //           onClick={handleVersionSave}
    //           disabled={!versionEditMode}
    //         >
    //           Save
    //         </Button>
    //         <Button
    //           sx={{ height: "30px" }}
    //           variant="outlined"
    //           onClick={() => setVersionEditMode(!versionEditMode)}
    //         >
    //           {versionEditMode ? "Cancel" : "Edit"}
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Box>
    <Box sx={{ p: { xs: 2, md: 4 }, display: "grid", gap: { xs: 3, md: 4 } }}>
      <ToastContainer position="top-center" transition={"Slide"} />

      {/* Payment Settings Section */}
      <Box>
        <Typography fontWeight={600} fontSize={{ xs: 18, md: 20 }} mb={2}>
          Payment Gateway Settings
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.background.secondary,
            p: { xs: 2, md: 3 },
            borderRadius: "10px",
            display: "grid",
            gap: 3,
          }}
        >
          <Box sx={{ display: "grid", gap: 3 }}>
            {/* Razorpay Key */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, md: 6 },
                alignItems: { sm: "center" },
              }}
            >
              <Typography sx={{ width: { sm: 120 }, flexShrink: 0 }}>
                Razorpay Key
              </Typography>
              <InputField
                name="razorPayKey"
                value={settingDetails.razorPayKey}
                styles={{
                  width: { xs: "100%", sm: "300px" },
                  "& .MuiInputBase-root": { height: { xs: 40, sm: 32 } },
                }}
                disabled={!editMode}
                onChange={handleInputChange}
                error={validationError}
                setError={setValidationError}
              />
            </Box>

            {/* Razorpay Secret */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, md: 6 },
                alignItems: { sm: "center" },
              }}
            >
              <Typography sx={{ width: { sm: 120 }, flexShrink: 0 }}>
                Razorpay Secret
              </Typography>
              <InputField
                name="razorPaySecret"
                value={settingDetails.razorPaySecret}
                styles={{
                  width: { xs: "100%", sm: "300px" },
                  "& .MuiInputBase-root": { height: { xs: 40, sm: 32 } },
                }}
                disabled={!editMode}
                onChange={handleInputChange}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              gap: 2,
              justifyContent: "flex-end",
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setEditMode(!editMode)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {editMode ? "Cancel" : "Edit"}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!editMode}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Version Control Section */}
      <Box>
        <Typography fontWeight={600} fontSize={{ xs: 18, md: 20 }} mb={2}>
          App Version Control
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.background.secondary,
            p: { xs: 2, md: 3 },
            borderRadius: "10px",
            display: "grid",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, md: 6 },
              alignItems: { sm: "center" },
            }}
          >
            <Typography sx={{ width: { sm: 120 }, flexShrink: 0 }}>
              Version Number
            </Typography>
            <InputField
              name="versionNumber"
              value={versionDetails.versionNumber}
              styles={{
                width: { xs: "100%", sm: "300px" },
                "& .MuiInputBase-root": { height: { xs: 40, sm: 32 } },
              }}
              disabled={!versionEditMode}
              onChange={handleVersionInputChange}
              error={validationError}
              setError={setValidationError}
            />
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              gap: 2,
              justifyContent: "flex-end",
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setVersionEditMode(!versionEditMode)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {versionEditMode ? "Cancel" : "Edit"}
            </Button>
            <Button
              variant="contained"
              onClick={handleVersionSave}
              disabled={!versionEditMode}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
