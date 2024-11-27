import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import { Button, ButtonGroup, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../../service/allApi";
import theme from "../../../../theme";

const columns = [
  { field: "userId", headerName: "User ID" },
  { field: "username", headerName: "Username" },
  { field: "phone", headerName: "Phone" },
  { field: "dob", headerName: "Date of Birth" },
  { field: "location", headerName: "Location" },
  { field: "gender", headerName: "Gender" },
  { field: "coin", headerName: "Coin" },
  {
    field: "blacklist",
    headerName: "Blacklist",
    renderCell: (value) => <Checkbox checked={value} disabled />,
  },
  {
    field: "kyc",
    headerName: "KYC",
    renderCell: (value) => {
      let color;
      switch (value) {
        case "approved":
          color = theme.palette.success.main;
          break;
        case "requested":
          color = theme.palette.warning.main;
          break;
        case "declined":
          color = theme.palette.error.main;
          break;
        default:
          color = "inherit";
      }
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: () => <Link>View</Link>,
  },
];

const Userlist = () => {
  const [users, setUsers] = useState();

  const fetchAllUsers = async () => {
    const response = await getAllUsers();
    setUsers(response?.data);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const formatUsersForDataTable = () => {
    return users?.map((user) => ({
      userId: user?._id,
      username: user?.username,
      phone: user?.mobileNumber,
      dob: user?.profile?.dateOfBirth,
      location: user?.profile?.place,
      gender: user?.profile?.gender,
      coin: user?.coin,
      blacklist: user?.blacklist,
      kyc: user?.kyc,
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
