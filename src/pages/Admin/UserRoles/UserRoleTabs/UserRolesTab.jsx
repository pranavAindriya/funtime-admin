import { Box, Chip, IconButton, Switch } from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import React from "react";
import DataTable from "../../../../Components/DataTable";

const UserRolesTab = () => {
  const columns = [
    { field: "slNo", headerName: "Sl No" },
    { field: "userRoles", headerName: "User Roles" },
    {
      field: "accessTo",
      headerName: "Access To",
      renderCell: (value) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {(Array.isArray(value) ? value : [value])?.map(
            (accessItem, index) => (
              <Chip
                key={index}
                label={accessItem}
                size="medium"
                variant="outlined"
                sx={{ borderRadius: "8px", fontWeight: 700 }}
              />
            )
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value, row) => (
        <Switch
          checked={value === "Active"}
          onChange={(event) => handleStatusChange(event, row)}
          color="primary"
          inputProps={{ "aria-label": "status switch" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (value, row) => (
        <Box sx={{ display: "flex" }}>
          <IconButton
            onClick={() => navigate(`/admin/addnewrole/view/${value}`)}
          >
            <Eye color="black" />
          </IconButton>
          <IconButton>
            <Pencil color={theme.palette.info.main} />
          </IconButton>
          <IconButton>
            <Trash color={theme.palette.error.main} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <DataTable columns={columns} />
    </Box>
  );
};

export default UserRolesTab;
