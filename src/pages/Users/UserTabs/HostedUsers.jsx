import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Typography,
} from "@mui/material";
import { hasPermission } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { X, MagnifyingGlass } from "@phosphor-icons/react";

const HostedUsers = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const queryClient = useQueryClient();
  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  // Query keys
  const hostedUsersKeys = {
    all: ["hostedUsers"],
    list: (page, searchTerm) => [...hostedUsersKeys.all, { page, searchTerm }],
  };

  // Main query for fetching hosted users
  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: hostedUsersKeys.list(page, activeSearchTerm),
    queryFn: async () => {
      let url;
      if (isSearching) {
        url = `userName=${activeSearchTerm}`;
      } else {
        url = `page=${page}&limit=50`;
      }
      return getAllHostedUsers(url);
    },
    onError: () => handleNotification("Failed to fetch hosted users", "error"),
  });

  const hostedUsers = response?.data?.users || [];
  const paginationDetails = response?.data?.pagination || {};

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ hostedUserId, status }) =>
      updateHostedUserStatus({ hostedUserId, status }),
    onMutate: async ({ hostedUserId, status }) => {
      await queryClient.cancelQueries(
        hostedUsersKeys.list(page, activeSearchTerm)
      );

      const previousData = queryClient.getQueryData(
        hostedUsersKeys.list(page, activeSearchTerm)
      );

      // Optimistically update
      queryClient.setQueryData(
        hostedUsersKeys.list(page, activeSearchTerm),
        (old) => ({
          ...old,
          data: {
            ...old.data,
            users: old.data.users.map((user) =>
              user._id === hostedUserId ? { ...user, status } : user
            ),
          },
        })
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        hostedUsersKeys.list(page, activeSearchTerm),
        context.previousData
      );
      handleNotification("Failed to update user status", "error");
    },
    onSuccess: (data, { status }) => {
      handleNotification(`User ${status} successfully`, "success");
    },
  });

  const handleNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleStatusChange = (userId, newStatus) => {
    statusMutation.mutate({
      hostedUserId: userId,
      status: newStatus,
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setPage(1);
      setActiveSearchTerm(searchTerm.trim());
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsSearching(false);
    setPage(1);
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

  return (
    <LoadingBackdrop open={isLoading || isFetching}>
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
          onKeyDown={(e) => {
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

      {!isSearching && (
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
          onChange={(e, newPage) => setPage(newPage)}
        />
      )}

      <DataTable columns={columns} rows={formatUsersForDataTable()} />
      {formatUsersForDataTable()?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}

      {!isSearching && (
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
          onChange={(e, newPage) => setPage(newPage)}
        />
      )}

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
