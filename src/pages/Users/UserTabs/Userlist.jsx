import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import DataTable from "../../../components/DataTable";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Pagination,
  TextField,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { blockUser, getAllUsers } from "../../../service/allApi";
import { Eye, Pencil, MagnifyingGlass, X } from "@phosphor-icons/react";
import formatDate from "../../../utils/formatdate";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { useSelector } from "react-redux";
import { userId } from "../../../redux/slices/authSlice";
import { Slide, toast } from "react-toastify";

const Userlist = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState(""); // New state for active search
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const adminUserId = useSelector(userId);

  // Define query key factory
  const userQueryKeys = {
    all: ["users"],
    list: (page, searchTerm) => [...userQueryKeys.all, { page, searchTerm }],
  };

  // Main query for fetching users
  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: userQueryKeys.list(page, activeSearchTerm), // Use activeSearchTerm instead of searchTerm
    queryFn: () =>
      isSearching ? getAllUsers(activeSearchTerm) : getAllUsers(page, 50),
  });

  // Extract data from response
  const users = response?.data?.users || response?.data || [];
  const paginationDetails = response?.data?.pagination || {};

  // Block user mutation
  const blockUserMutation = useMutation({
    mutationFn: ({ userId, blocked }) =>
      blockUser(adminUserId, userId, blocked),
    onMutate: async ({ userId, blocked }) => {
      await queryClient.cancelQueries(
        userQueryKeys.list(page, activeSearchTerm)
      );
      const previousUsers = queryClient.getQueryData(
        userQueryKeys.list(page, activeSearchTerm)
      );

      queryClient.setQueryData(
        userQueryKeys.list(page, activeSearchTerm),
        (old) => ({
          ...old,
          data: {
            ...old.data,
            users: old.data.users.map((user) =>
              user._id === userId ? { ...user, blocked } : user
            ),
          },
        })
      );

      return { previousUsers };
    },
    onError: (err, { userId, blocked }, context) => {
      queryClient.setQueryData(
        userQueryKeys.list(page, activeSearchTerm),
        context.previousUsers
      );
      toast.error("Failed to update user block status", {
        autoClose: 1000,
        transition: Slide,
      });
    },
    onSuccess: (response, { blocked }) => {
      const isSuccess = !blocked
        ? response.status === 200
        : response.status === 201;
      if (isSuccess) {
        toast.success(
          `User successfully ${blocked ? "Blocked" : "Unblocked"}`,
          {
            autoClose: 1000,
            transition: Slide,
          }
        );
      }
    },
  });

  const handleBlockUser = (userId, currentBlockedStatus) => {
    blockUserMutation.mutate({
      userId,
      blocked: !currentBlockedStatus,
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setPage(1);
      setActiveSearchTerm(searchTerm.trim()); // Update activeSearchTerm only when search is triggered
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsSearching(false);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSearch();
    }
  };

  const columns = [
    { field: "userId", headerName: "User ID" },
    {
      field: "username",
      headerName: "Username",
      renderCell: (params) => (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Avatar src={params.image} slotProps={{ img: { loading: "lazy" } }} />
          <span>{params.username}</span>
        </Box>
      ),
    },
    { field: "phone", headerName: "Phone" },
    { field: "email", headerName: "Email" },
    { field: "dob", headerName: "Date of Birth" },
    { field: "about", headerName: "About" },
    { field: "gender", headerName: "Gender" },
    { field: "coin", headerName: "Coin" },
    {
      field: "blacklist",
      headerName: "Blacklist",
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={() => handleBlockUser(params.userId, params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (user) => (
        <>
          <IconButton onClick={() => navigate(`/users/edit/${user}`)}>
            <Pencil />
          </IconButton>
          <IconButton onClick={() => navigate(`/users/view/${user}`)}>
            <Eye />
          </IconButton>
        </>
      ),
    },
    {
      field: "overview",
      renderCell: (params) => (
        <Link style={{ textDecoration: "underline" }} to={`overview/${params}`}>
          Overview
        </Link>
      ),
    },
  ];

  const formatUsersForDataTable = () => {
    return users?.map((user) => ({
      userId: user?._id,
      username: { image: user?.profile?.image, username: user?.username },
      phone: user?.mobileNumber,
      dob: user?.profile?.dateOfBirth
        ? formatDate(user?.profile?.dateOfBirth)
        : "No Date Found",
      email: user?.profile?.email,
      gender: user?.profile?.gender,
      coin: user?.profile?.coin,
      about: user?.profile?.userDescription,
      blacklist: { value: user?.blocked, userId: user?._id },
      actions: user?._id,
      overview: user?._id,
    }));
  };

  const formattedUsers = formatUsersForDataTable();

  return (
    <LoadingBackdrop open={isLoading || isFetching}>
      <Box
        sx={{
          display: "flex",
          mb: isSearching && 2,
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
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              endAdornment: (
                <>
                  {searchTerm && (
                    <IconButton size="small" onClick={handleClearSearch}>
                      <X />
                    </IconButton>
                  )}
                </>
              ),
            },
          }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          disabled={!searchTerm.trim()}
        >
          <MagnifyingGlass />
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
            mt: 2,
          }}
          onChange={(e, page) => setPage(page)}
        />
      )}
      <DataTable columns={columns} rows={formattedUsers} />
      {!isSearching && (
        <Pagination
          count={paginationDetails?.totalPages}
          color="primary"
          page={page}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            mt: 4,
          }}
          onChange={(e, page) => setPage(page)}
        />
      )}
    </LoadingBackdrop>
  );
};

export default Userlist;
