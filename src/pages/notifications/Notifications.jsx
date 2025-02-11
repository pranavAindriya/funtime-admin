import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import TopAddNewBar from "../../components/TopAddNewBar";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import {
  getAllNotifications,
  sendPushNotification,
  deleteNotification,
} from "../../service/allApi";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const Notifications = () => {
  const [notifications, setAllNotifications] = useState([]);
  const [validationErrors, setValidationErrors] = useState();
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, isloading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

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

  const handleDeleteClick = (id) => {
    setSelectedNotificationId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    isloading(true);
    try {
      const response = await deleteNotification(selectedNotificationId);
      if (response.status === 200) {
        handleSuccess("Notification deleted successfully");
        await fetchAllNotifications();
      } else {
        handleError("Error deleting notification");
      }
    } catch (error) {
      handleError("Error deleting notification");
      console.error("Delete notification error:", error);
    }
    setDeleteDialogOpen(false);
    setSelectedNotificationId(null);
    isloading(false);
  };

  const handleSendPushNotification = async (id) => {
    const response = await sendPushNotification(id);
    if (response.status === 200) {
      handleSuccess("Notification Send Successfully");
    } else {
      handleError("Error while Sending Notification");
    }
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
          <IconButton
            aria-describedby="delete-pop"
            onClick={() => handleDeleteClick(value)}
          >
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

  const isBlocked = useSelector((state) =>
    isModuleBlocked(state, "Notifications")
  );

  if (isBlocked) {
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
    <LoadingBackdrop open={loading}>
      <TopAddNewBar
        label={"Push Notification List"}
        onAddButtonClick={() => navigte("/notifications/addnew")}
        hasAccess={hasAccess}
      />
      <DataTable columns={columns} rows={formattedRows} />
      {formattedRows?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            p: 1,
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">Delete Notification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
