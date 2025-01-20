import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Pagination,
  TextField,
  InputAdornment,
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
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const adminUserId = useSelector(userId);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    let response;
    if (isSearching) {
      response = await getAllUsers(searchTerm);
      console.log(response);
    } else {
      response = await getAllUsers(page, 50);
    }
    if (response.status === 200) {
      setUsers(response?.data?.users || response?.data || []);
      setPaginationDetails(response?.data?.pagination || {});
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [page, isSearching]);

  const handleBlockUser = async (userId, currentBlockedStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, blocked: !currentBlockedStatus } : user
      )
    );

    try {
      const response = await blockUser(
        adminUserId,
        userId,
        !currentBlockedStatus
      );

      const isSuccess = currentBlockedStatus
        ? response.status === 200
        : response.status === 201;

      if (!isSuccess) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, blocked: currentBlockedStatus }
              : user
          )
        );
        throw new Error("Failed to update user block status");
      }

      toast.success(
        `User successfully ${!currentBlockedStatus ? "Blocked" : "Unblocked"}`,
        {
          autoClose: 1000,
          transition: Slide,
        }
      );
    } catch (error) {
      toast.error("Failed to update user block status", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      setIsSearching(true); // Enable search mode
      setPage(1); // Reset to the first page when searching
    } else {
      setIsSearching(false); // Disable search mode if search term is empty
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
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
    // {
    //   field: "kyc",
    //   headerName: "KYC",
    //   renderCell: (value) => {
    //     let color;
    //     switch (value) {
    //       case "approved":
    //         color = theme.palette.success.main;
    //         break;
    //       case "requested":
    //         color = theme.palette.warning.main;
    //         break;
    //       case "declined":
    //         color = theme.palette.error.main;
    //         break;
    //       default:
    //         color = "inherit";
    //     }
    //     return <span style={{ color }}>{value}</span>;
    //   },
    // },
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
    <LoadingBackdrop open={isLoading}>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
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
      {!isSearching && ( // Only show pagination if not in search mode
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
      {!isSearching && ( // Only show pagination if not in search mode
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
