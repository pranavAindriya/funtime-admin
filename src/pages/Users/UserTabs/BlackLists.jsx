import React from "react";
import { getAllBlockedUsers } from "../../../service/allApi";
import { Avatar, Box, Button, Typography } from "@mui/material";
import DataTable from "../../../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const BlackLists = () => {
  const {
    data: blockedUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getAllBlockedUsers,
    select: (response) => response.data.data,
  });

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

  // Format the blocked users data for the DataTable
  const formattedRows =
    blockedUsers?.map((user) => ({
      userId: user?.reportedUserId,
      username: { username: user?.username, image: user?.profileImage },
      phone: user?.phoneNumber,
      warnings: user?.warning,
      actions: user?._id,
    })) || [];

  if (isError) {
    return <div>Error fetching blocked users. Please try again later.</div>; // Display an error state
  }

  return (
    <LoadingBackdrop open={isLoading}>
      <DataTable columns={columns} rows={formattedRows} />
      {formattedRows?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
    </LoadingBackdrop>
  );
};

export default BlackLists;
