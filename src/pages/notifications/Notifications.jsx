import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import TopAddNewBar from "../../components/TopAddNewBar";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import {
  getAllNotifications,
  sendPushNotification,
} from "../../service/allApi";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { hasPermission } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const Notifications = () => {
  const [notifications, setAllNotifications] = useState([]);
  const [validationErrors, setValidationErrors] = useState();
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, isloading] = useState(false);

  const theme = useTheme();
  const navigte = useNavigate();

  const fetchAllNotifications = async () => {
    isloading(true);
    const response = await getAllNotifications();
    if (response.status === 200) {
      setAllNotifications(response?.data?.data);
    }
    isloading(false);
  };

  const handleSuccess = (text) => {
    setMessage({ text, severity: "success" });
    setOpenSnackbar(true);
  };

  const handleError = (text) => {
    setMessage({ text, severity: "error" });
    setOpenSnackbar(true);
  };

  const handleSendPushNotification = async (id) => {
    const response = await sendPushNotification(id);
    if (response.status === 200) {
      handleSuccess("Notification Send Successfully");
    } else {
      handleError("Error while Sending Notification");
    }
    console.log(response);
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Notifications", "readAndWrite")
  );

  const columns = [
    { field: "slno", headerName: "#" },
    { field: "title", headerName: "Title" },
    { field: "description", headerName: "Description" },
    {
      field: "image",
      headerName: "Image",
      renderCell: (value) => (
        <img src={value} alt="img unavilable" style={{ width: "50px" }} />
      ),
    },
    hasAccess && {
      field: "actions",
      headerName: "Actions",
      renderCell: (value) => (
        <>
          <IconButton onClick={() => navigte(`/notifications/edit/${value}`)}>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton aria-describedby="delete-pop">
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={() => handleSendPushNotification(value)}
          >
            Send
          </Button>
        </>
      ),
    },
  ];

  const formatedNotifications = () => {
    return notifications?.map((notification, ind) => ({
      id: notification?._id,
      actions: notification?._id,
      slno: ind + 1,
      title: notification?.title,
      description: notification?.description,
      image: notification?.image,
    }));
  };

  const formattedRows = formatedNotifications();

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <LoadingBackdrop open={loading}>
      {/* <Box
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
      </Box> */}
      <TopAddNewBar
        label={"Push Notification List"}
        onAddButtonClick={() => navigte("/notifications/addnew")}
        hasAccess={hasAccess}
      />
      <DataTable columns={columns} rows={formattedRows} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </LoadingBackdrop>
  );
};

export default Notifications;
