import React, { useEffect, useState } from "react";
import { getAllBlockedUsers } from "../../../service/allApi";
import { Avatar, Box, Button } from "@mui/material";
import DataTable from "../../../components/DataTable";

const BlackLists = () => {
  const [blockedUsers, setAllBlockedUsers] = useState([]);

  const fetchAllBlockedUSers = async () => {
    const response = await getAllBlockedUsers();
    if (response.status === 200) {
      setAllBlockedUsers(response.data.userReports);
    }
    console.log(response);
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
    { field: "warnings", headerName: "Warnings" },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   renderCell: () => (
    //     <Button variant="contained" size="small">
    //       Remove
    //     </Button>
    //   ),
    // },
  ];

  const formatedBlockedUsers = () => {
    return blockedUsers?.map((user) => ({
      userId: user?.reportedUserId,
      username: { username: user?.username, image: user?.profileImage },
      phone: user?.phoneNumber,
      warnings: user?.warning,
      actions: user?._id,
    }));
  };

  const formattedRows = formatedBlockedUsers();

  useEffect(() => {
    fetchAllBlockedUSers();
  }, []);
  return (
    <div>
      <DataTable columns={columns} rows={formattedRows} />
    </div>
  );
};

export default BlackLists;
