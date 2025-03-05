import { useState } from "react";
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
  InputAdornment,
  Typography,
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
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("username");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const adminUserId = useSelector(userId);

  // Define query key factory
  const userQueryKeys = {
    all: ["users"],
    list: (page) => [...userQueryKeys.all, { page }],
    search: (searchTerm, searchType) => [
      ...userQueryKeys.all,
      "search",
      { searchTerm, searchType },
    ],
  };

  // Main query for fetching users
  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: isSearching
      ? userQueryKeys.search(activeSearchTerm, searchType)
      : userQueryKeys.list(page),
    queryFn: () => {
      if (isSearching) {
        return getAllUsers(activeSearchTerm);
      }
      return getAllUsers(page, 50);
    },
    keepPreviousData: true,
  });

  // Extract data from response
  const users = response?.data?.users || response?.data || [];
  const paginationDetails = response?.data?.pagination || {};

  // Block user mutation
  const blockUserMutation = useMutation({
    mutationFn: ({ userId, blocked }) =>
      blockUser(adminUserId, userId, blocked),
    onMutate: async ({ userId, blocked }) => {
      const queryKey = isSearching
        ? userQueryKeys.search(activeSearchTerm, searchType)
        : userQueryKeys.list(page);

      await queryClient.cancelQueries(queryKey);
      const previousUsers = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        data: {
          ...old.data,
          users: old.data.users.map((user) =>
            user._id === userId ? { ...user, blocked } : user
          ),
        },
      }));

      return { previousUsers, queryKey };
    },
    onError: (err, { userId, blocked }, context) => {
      queryClient.setQueryData(context.queryKey, context.previousUsers);
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
      setActiveSearchTerm(searchTerm.trim());
      // Prefetch the next page
      queryClient.prefetchQuery({
        queryKey: userQueryKeys.search(searchTerm.trim(), searchType),
        queryFn: () => getAllUsers(searchTerm.trim()),
      });
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

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSearch();
    }
  };

  const columns = [
    { field: "slno", headerName: "SlNo" },
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
    { field: "joined", headerName: "Member Since" },
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
    return users?.map((user, ind) => ({
      slno: (page - 1) * 50 + ind + 1,
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
      joined: formatDate(user?.createdAt),
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
          mb: isSearching ? 2 : 3,
          mt: 2,
          gap: 2,
        }}
      >
        <TextField
          label="Search users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <X />
                  </IconButton>
                )}
                {/* <Divider sx={{ height: 24, mx: 1 }} orientation="vertical" />
                <Select
                  disableUnderline
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  variant="standard"
                  sx={{
                    "& .MuiSelect-select": {
                      py: 0,
                      border: "none",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <MenuItem value="username">Username</MenuItem>
                  <MenuItem value="userId">User ID</MenuItem>
                </Select> */}
              </InputAdornment>
            ),
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
      {formattedUsers?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
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
