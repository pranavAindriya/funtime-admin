import React, { useEffect, useState } from "react";
import TopAddNewBar from "../../../components/TopAddNewBar";
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import {
  getAllRoles,
  createNewAdmin,
  getAdminById,
  updateAdmin,
} from "../../../service/allApi";
import { Slide, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { hasPermission } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";

const AddNewAdmin = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [allRoles, setAllRoles] = useState([]);

  const navigate = useNavigate();

  const { type, id } = useParams();

  const fetchAllRoles = async () => {
    try {
      const response = await getAllRoles();
      if (response.status === 200) {
        setAllRoles(response.data.data);
      } else {
        toast.error("Failed to fetch roles. Please try again later.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching roles.");
      console.error(error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInput = () => {
    const { name, email, password, role } = adminData;
    if (!name) {
      toast.error("Name is required.");
      return false;
    }
    if (!email) {
      toast.error("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!role) {
      toast.error("Role is required.");
      return false;
    }
    return true;
  };

  const handleAddNewAdmin = async () => {
    if (!validateInput()) return;

    try {
      if (type === "edit") {
        const response = await updateAdmin(id, adminData);
        if (response.status === 200) {
          toast.success("Admin updated successfully.", {
            autoClose: 1000,
            transition: Slide,
          });
          navigate("/user-roles");
          setAdminData({ name: "", email: "", password: "", role: "" });
        } else {
          toast.error("Failed to update admin. Please try again.", {
            autoClose: 1000,
            transition: Slide,
          });
        }
        return;
      }
      const response = await createNewAdmin(adminData);
      if (response.status === 200) {
        toast.success("Admin created successfully.", {
          autoClose: 1000,
          transition: Slide,
        });
        navigate("/user-roles");
        setAdminData({ name: "", email: "", password: "", role: "" });
      } else {
        toast.error("Failed to create admin. Please try again.", {
          autoClose: 1000,
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error("An error occurred while creating the admin.", {
        autoClose: 1000,
        transition: Slide,
      });
      console.error(error);
    }
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  const fetchAdminById = async (id) => {
    const response = await getAdminById(id);
    if (response?.status === 200) {
      setAdminData(response?.data?.data);
    }
  };

  useEffect(() => {
    fetchAllRoles();
    if (type) {
      fetchAdminById(id);
    }
  }, [type, id]);

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h4">
          You do not have access to this page
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <TopAddNewBar
        label={"Add New Admin"}
        onAddButtonClick={handleAddNewAdmin}
        hasAccess={hasAccess}
        buttonLabel={type === "edit" && "Update Admin "}
      />

      <Box display={"flex"} flexDirection={"column"} gap={3}>
        <Box display={"flex"} flexWrap={"wrap"} gap={2}>
          <Typography minWidth={"200px"}>Name</Typography>
          <TextField
            size="small"
            name="name"
            value={adminData.name}
            onChange={onInputChange}
          />
        </Box>
        <Box display={"flex"} flexWrap={"wrap"} gap={2}>
          <Typography minWidth={"200px"}>Email</Typography>
          <TextField
            size="small"
            name="email"
            value={adminData.email}
            onChange={onInputChange}
          />
        </Box>
        {!type && (
          <Box display={"flex"} flexWrap={"wrap"} gap={2}>
            <Typography minWidth={"200px"}>Password</Typography>
            <TextField
              size="small"
              name="password"
              type="password"
              value={adminData.password}
              onChange={onInputChange}
            />
          </Box>
        )}
        <Box display={"flex"} flexWrap={"wrap"} gap={2}>
          <Typography minWidth={"200px"}>Title</Typography>
          <Select
            size="small"
            displayEmpty
            value={adminData.role}
            sx={{
              width: 225,
            }}
            name={"role"}
            onChange={onInputChange}
          >
            <MenuItem disabled value="">
              <em style={{ color: "grey" }}>Select a role</em>
            </MenuItem>
            {allRoles.length > 0 &&
              allRoles?.map((role, ind) => (
                <MenuItem value={role.name} key={ind}>
                  {role.name}
                </MenuItem>
              ))}
          </Select>
        </Box>
      </Box>
    </div>
  );
};

export default AddNewAdmin;
