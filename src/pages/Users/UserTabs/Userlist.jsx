import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import { Avatar, Box, Checkbox, IconButton, Pagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { blockUser, getAllUsers } from "../../../service/allApi";
import { Eye, Pencil } from "@phosphor-icons/react";
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

  const navigate = useNavigate();

  const adminUserId = useSelector(userId);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    const response = await getAllUsers(page, 100);
    if (response.status === 200) {
      setUsers(response?.data?.users);
      setPaginationDetails(response?.data?.pagination);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [page]);

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

  const columns = [
    { field: "userId", headerName: "User ID" },
    {
      field: "username",
      headerName: "Username",
      renderCell: (params) => (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Avatar src={params.image} />
          <span>{params.username}</span>
        </Box>
      ),
    },
    { field: "phone", headerName: "Phone" },
    { field: "email", headerName: "Email" },
    { field: "dob", headerName: "Date of Birth" },
    // { field: "location", headerName: "Location" },
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
      location: user?.profile?.place,
      gender: user?.profile?.gender,
      coin: user?.profile?.coin,
      about: user?.profile?.userDescription,
      blacklist: { value: user?.blocked, userId: user?._id },
      kyc: user?.kyc,
      actions: user?._id,
      overview: user?._id,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formattedUsers = formatUsersForDataTable();

  return (
    <LoadingBackdrop open={isLoading}>
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
      <DataTable columns={columns} rows={formattedUsers} />
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
    </LoadingBackdrop>
  );
};

export default Userlist;
