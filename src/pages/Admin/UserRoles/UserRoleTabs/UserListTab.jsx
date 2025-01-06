import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Switch,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import DataTable from "../../../../components/DataTable";
import { getAllAdmins, deleteAdmin } from "../../../../service/allApi";

const UserListTab = () => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteAdmin(selectedUser._id);
      if (response.status === 200) {
        toast.success("User deleted successfully", {
          autoClose: 1000,
          transition: Slide,
        });
        fetchAllAdmins();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user. Please try again.", {
        autoClose: 1000,
        transition: Slide,
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    { field: "slNo", headerName: "#" },
    { field: "user", headerName: "User" },
    { field: "email", headerName: "Email" },
    { field: "role", headerName: "Role" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value) => (
        <Switch
          checked={value}
          color="primary"
          inputProps={{ "aria-label": "status switch" }}
        />
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (value) => (
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={() => navigate(`/admin/edit/${value._id}`)}>
            <Pencil color={theme.palette.info.main} />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(value)}>
            <Trash color={theme.palette.error.main} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchAllAdmins = async () => {
    try {
      const response = await getAllAdmins();
      if (response.status === 200) {
        setAllAdmins(response?.data?.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users. Please refresh the page.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formattedRows = allAdmins.map((admin, index) => ({
    slNo: index + 1,
    user: admin.name,
    email: admin.email,
    role: admin.role,
    status: true,
    edit: admin,
  }));

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  return (
    <Box>
      <DataTable columns={columns} rows={formattedRows} />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            p: 1,
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserListTab;
