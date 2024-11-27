import { Box, IconButton, Switch } from "@mui/material";
import React from "react";
import DataTable from "../../../../components/DataTable";

const UserListTab = () => {
  const columns = [
    { field: "slNo", headerName: "#" },
    { field: "user", headerName: "User" },
    { field: "email", headerName: "Email" },
    { field: "role", headerName: "Role" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value, row) => (
        <Switch
          checked={value === "active"}
          onChange={() => handleStatusChange(row)}
          color="primary"
          inputProps={{ "aria-label": "status switch" }}
        />
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (value, row) => (
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(row)}>
            <Pencil color={theme.palette.info.main} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row)}>
            <Trash color={theme.palette.error.main} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleStatusChange = (row) => {
    console.log("Status changed for user:", row);
  };

  const handleEdit = (row) => {
    console.log("Edit user:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete user:", row);
  };

  return (
    <Box>
      <DataTable columns={columns} />
    </Box>
  );
};

export default UserListTab;
