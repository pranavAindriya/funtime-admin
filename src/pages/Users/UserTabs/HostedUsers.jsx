import React, { useEffect, useState } from "react";
import {
  getAllHostedUsers,
  updateHostedUserStatus,
} from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Pagination,
  TextField,
  IconButton,
} from "@mui/material";
import { hasPermission } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { X, MagnifyingGlass } from "@phosphor-icons/react";

const HostedUsers = () => {
  const [hostedUsers, setHostedUsers] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchAllHostedUsers = async (currentPage, searchQuery = "") => {
    setIsLoading(true);
    try {
      let url = `page=${currentPage}&limit=100`;
      if (searchQuery) {
        url = `userName=${searchQuery}`;
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }

      const response = await getAllHostedUsers(url);
      if (response.status === 200) {
        setHostedUsers(response?.data?.users);
        setPaginationDetails(response?.data?.pagination);
      }
    } catch (error) {
      handleErrorNotification("Failed to fetch hosted users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setPage(1);
      fetchAllHostedUsers(1, searchTerm.trim());
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1);
    fetchAllHostedUsers(1, "");
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (isSearching) {
      fetchAllHostedUsers(newPage, searchTerm);
    } else {
      fetchAllHostedUsers(newPage);
    }
  };

  const formatUsersForDataTable = () => {
    return hostedUsers
      ?.filter((user) => user.status !== "declined")
      .map((user) => ({
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
    fetchAllHostedUsers(page);
  }, []); // Initial load only

  return (
    <LoadingBackdrop open={isLoading}>
      <Box
        sx={{
          display: "flex",
          mb: isSearching ? 2 : 3,
          mt: 2,
          gap: 2,
        }}
      >
        <TextField
          label="Search by username"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={handleClearSearch}>
                <X size={16} />
              </IconButton>
            ),
          }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          disabled={!searchTerm.trim()}
        >
          <MagnifyingGlass size={20} />
        </Button>
      </Box>

      <Pagination
        count={paginationDetails?.totalPages}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
        onChange={handlePageChange}
      />

      <DataTable columns={columns} rows={formatUsersForDataTable()} />

      <Pagination
        count={paginationDetails?.totalPages}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          mt: 4,
        }}
        onChange={handlePageChange}
      />

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
    </LoadingBackdrop>
  );
};

export default HostedUsers;
