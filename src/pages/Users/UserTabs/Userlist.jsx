import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../service/allApi";
import theme from "../../../../theme";
import { Eye, Pencil } from "@phosphor-icons/react";
import formatDate from "../../../utils/formatdate";

const Userlist = () => {
  const [users, setUsers] = useState();

  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    const response = await getAllUsers();
    setUsers(response?.data);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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
    // {
    //   field: "blacklist",
    //   headerName: "Blacklist",
    //   renderCell: (value) => <Checkbox checked={value} disabled />,
    // },
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
      blacklist: user?.blacklist,
      kyc: user?.kyc,
      actions: user?._id,
    }));
  };

  const formattedUsers = formatUsersForDataTable();

  return (
    <div>
      <DataTable columns={columns} rows={formattedUsers} />
    </div>
  );
};

export default Userlist;
