import React, { useEffect, useState } from "react";
import {
  getAllHostedUsers,
  updateHostedUserStatus,
} from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { hasPermission } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";

const HostedUsers = () => {
  const [hostedUsers, setHostedUsers] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAllHostedUsers = async () => {
    try {
      const response = await getAllHostedUsers();
      if (response.status === 200) {
        setHostedUsers(response.data);
      }
    } catch (error) {
      handleErrorNotification("Failed to fetch hosted users");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    const currentUser = hostedUsers.find((user) => user._id === userId);
    const originalStatus = currentUser.status;

    setHostedUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      )
    );

    try {
      const response = await updateHostedUserStatus({
        hostedUserId: userId,
        status: newStatus,
      });

      if (response.status !== 200) {
        throw new Error("Status update failed");
      }

      handleSuccessNotification(`User ${newStatus} successfully`);
    } catch (error) {
      setHostedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: originalStatus } : user
        )
      );

      handleErrorNotification("Failed to update user status");
    }
  };

  const handleSuccessNotification = (message) => {
    setNotification({
      open: true,
      message,
      severity: "success",
    });
  };

  const handleErrorNotification = (message) => {
    setNotification({
      open: true,
      message,
      severity: "error",
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const formatUsersForDataTable = () => {
    return hostedUsers?.map((user) => ({
      userId: user?._id,
      username: user?.username,
      phone: user?.mobileNumber,
      status: user?.status,
      action: { userId: user?._id, status: user?.status },
    }));
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  const columns = [
    { field: "userId", headerName: "User Id" },
    { field: "username", headerName: "Username" },
    { field: "phone", headerName: "Phone" },
    { field: "status", headerName: "Status" },
    hasAccess && {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        const { userId, status } = params;

        return (
          <Box display={"flex"} marginLeft={"auto"}>
            {status === "pending" && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  sx={{ mr: 1, color: "white" }}
                  onClick={() => handleStatusChange(userId, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusChange(userId, "declined")}
                >
                  Decline
                </Button>
              </>
            )}
            {status === "approved" && (
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleStatusChange(userId, "declined")}
              >
                Decline
              </Button>
            )}
            {status === "declined" && (
              <Button
                size="small"
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                onClick={() => handleStatusChange(userId, "approved")}
              >
                Approve
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAllHostedUsers();
  }, []);

  return (
    <>
      <DataTable columns={columns} rows={formatUsersForDataTable()} />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HostedUsers;
