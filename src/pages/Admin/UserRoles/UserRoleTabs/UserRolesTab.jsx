import { Box, Chip, IconButton, Switch, useTheme } from "@mui/material";
import { Eye, Pencil, Trash } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/DataTable";
import { getAllRoles } from "../../../../service/allApi";
import { useNavigate } from "react-router-dom";

const UserRolesTab = () => {
  const [roles, setAllRoles] = useState([]);

  const theme = useTheme();

  const navigate = useNavigate();

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
          <IconButton onClick={() => navigate(`/admin/role/view/${value}`)}>
            <Eye color="black" />
          </IconButton>
          <IconButton onClick={() => navigate(`/admin/role/edit/${value}`)}>
            <Pencil color={theme.palette.info.main} />
          </IconButton>
          <IconButton>
            <Trash color={theme.palette.error.main} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const processRolesForTable = (rolesData) => {
    return rolesData.map((role, index) => ({
      id: role._id,
      slNo: index + 1,
      userRoles: role.name,
      accessTo: role.access.map((access) => access.module),
      status: role.status ? "Active" : "Inactive",
      actions: role._id,
    }));
  };

  const fetchAllUserRoles = async () => {
    const response = await getAllRoles();
    if (response.status === 200) {
      const processedRoles = processRolesForTable(response?.data?.data);
      setAllRoles(processedRoles);
    }
    console.log(response);
  };

  useEffect(() => {
    fetchAllUserRoles();
  }, []);

  return (
    <Box>
      <DataTable columns={columns} rows={roles} />
    </Box>
  );
};

export default UserRolesTab;
