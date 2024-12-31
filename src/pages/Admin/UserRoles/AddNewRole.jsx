import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Switch,
  Typography,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Plus, Trash, PencilSimple } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import LabeldInputField from "../../../components/LabeldInputField";
import TopAddNewBar from "../../../components/TopAddNewBar";
import {
  createNewUserRole,
  updateUserRole,
  getRoleById,
} from "../../../service/allApi";
import {
  CaretDown,
  CaretUp,
  ChartPieSlice,
  Circle,
  FileText,
  FlagBanner,
  HandCoins,
  Notification,
  Phone,
  Ranking,
  Scales,
  Shield,
  SquaresFour,
  Tag,
  Translate,
  Trophy,
  Users,
  UsersFour,
  HandArrowDown,
} from "@phosphor-icons/react";

const mainItems = [
  {
    text: "Dashboard",
    icon: <SquaresFour size={26} color="white" />,
    link: "/dashboard",
  },
  { text: "Users", icon: <Users size={26} color="white" />, link: "/users" },
  { text: "Calls", icon: <Phone size={26} color="white" />, link: "/calls" },
  {
    text: "Coins",
    icon: <HandCoins size={26} color="white" />,
    link: "/coins",
  },
  {
    text: "Conversion",
    icon: <Scales size={26} color="white" />,
    link: "/conversion",
  },
  {
    text: "Withdrawal",
    icon: <HandArrowDown size={26} color="white" />,
    link: "/withdrawals",
  },
  {
    text: "Leader Board",
    icon: <Trophy size={26} color="white" />,
    link: "/leaderboard",
  },
  {
    text: "Notifications",
    icon: <Notification size={26} color="white" />,
    link: "/notifications",
  },
  {
    text: "Report / Block",
    icon: <Shield size={26} color="white" />,
    link: "/reportandblock",
  },
  {
    text: "Reports",
    icon: <ChartPieSlice size={26} color="white" />,
    link: "/reports",
  },
  {
    text: "Language",
    icon: <Translate size={26} color="white" />,
    link: "/language",
  },
  // {
  //   text: "CMS Page",
  //   icon: <FileText size={26} color="white" />,
  //   link: "/cms",
  // },
];

const AddNewRole = () => {
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState(true);
  const [accessItems, setAccessItems] = useState(
    mainItems
      .filter((item) => item.text !== "Dashboard")
      .map((item) => ({
        module: item.text,
        permissions: { readOnly: true, readAndWrite: false },
      }))
  );

  const [newAccessName, setNewAccessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mode, setMode] = useState("create");

  const navigate = useNavigate();
  const { id, type } = useParams();

  useEffect(() => {
    const determineMode = () => {
      if (type === "edit") {
        setMode("edit");
        fetchRoleDetails();
      } else if (type === "view") {
        setMode("view");
        fetchRoleDetails();
      } else {
        setMode("create");
      }
    };

    determineMode();
  }, [id, type]);

  const fetchRoleDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getRoleById(id);
      const roleData = response.data.data;

      setRoleName(roleData.name);
      setStatus(roleData.status);

      if (roleData.access && roleData.access.length > 0) {
        const updatedAccessItems = accessItems.map((defaultItem) => {
          const existingModule = roleData.access.find(
            (accessItem) => accessItem.module === defaultItem.module
          );

          return existingModule
            ? {
                ...defaultItem,
                permissions: existingModule.permissions,
              }
            : defaultItem;
        });

        const newModules = roleData.access.filter(
          (accessItem) =>
            !updatedAccessItems.some(
              (item) => item.module === accessItem.module
            )
        );

        setAccessItems([
          ...updatedAccessItems,
          ...newModules.map((item) => ({
            module: item.module,
            permissions: item.permissions,
          })),
        ]);
      }
    } catch (err) {
      setError("Failed to fetch role details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    if (mode !== "view") {
      setStatus(!status);
    }
  };

  const handleAccessChange = (module, permissionType) => {
    if (mode === "view") return;

    setAccessItems((prev) =>
      prev.map((item) =>
        item.module === module
          ? {
              ...item,
              permissions: {
                readOnly: permissionType === "Read Only",
                readAndWrite: permissionType === "Read and Write",
              },
            }
          : item
      )
    );
  };

  const handleDeleteAccessItem = (module) => {
    if (mode === "view") return;

    setAccessItems((prev) => prev.filter((item) => item.module !== module));
  };

  const handleAddAccessItem = () => {
    if (
      mode === "view" ||
      !newAccessName.trim() ||
      accessItems.some((item) => item.module === newAccessName.trim())
    )
      return;

    setAccessItems((prev) => [
      ...prev,
      {
        module: newAccessName.trim(),
        permissions: { readOnly: true, readAndWrite: false },
      },
    ]);
    setNewAccessName("");
  };

  const handleSubmit = async () => {
    if (mode === "view") return;

    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    const payload = {
      name: roleName,
      access: accessItems,
      status: status,
    };

    try {
      setLoading(true);
      let response;

      if (mode === "create") {
        response = await createNewUserRole(payload);
      } else if (mode === "edit") {
        response = await updateUserRole(id, { access: payload.access });
      }

      setSuccess(response.data.message || "Role saved successfully");
      setError(null);
      navigate("/user-roles");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save role. Please try again."
      );
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      <TopAddNewBar
        label={
          mode === "create"
            ? "Add New User Role"
            : mode === "edit"
            ? "Edit User Role"
            : "View User Role"
        }
        buttonLabel={
          mode === "create"
            ? "Create User Role"
            : mode === "edit"
            ? "Update Role"
            : "Back"
        }
        onAddButtonClick={
          mode === "view" ? () => navigate("/user-roles") : handleSubmit
        }
        disabled={loading || mode === "view"}
      />

      <Box
        display={"flex"}
        alignItems={"center"}
        gap={8}
        flexWrap={"wrap"}
        mb={4}
      >
        <LabeldInputField
          label={"Name"}
          input={
            <TextField
              size="small"
              variant="outlined"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              error={!roleName.trim()}
              helperText={!roleName.trim() ? "Role name is required" : ""}
              disabled={mode === "view"}
            />
          }
        />

        <LabeldInputField
          label={"Status"}
          input={
            <Switch
              checked={status}
              onChange={handleToggleStatus}
              disabled={mode === "view"}
            />
          }
        />
      </Box>

      {mode !== "view" && (
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter new access name"
            value={newAccessName}
            onChange={(e) => setNewAccessName(e.target.value)}
            sx={{ marginLeft: "206px", width: "480px" }}
            error={accessItems.some(
              (item) => item.module === newAccessName.trim()
            )}
            helperText={
              accessItems.some((item) => item.module === newAccessName.trim())
                ? "This module already exists"
                : ""
            }
          />
          <Button
            variant="outlined"
            startIcon={<Plus size={20} />}
            onClick={handleAddAccessItem}
            sx={{ height: "fit-content", marginLeft: 5 }}
            disabled={
              !newAccessName.trim() ||
              accessItems.some((item) => item.module === newAccessName.trim())
            }
          >
            Add New
          </Button>
        </Box>
      )}

      <Box display={"flex"} alignItems={"flex-start"} gap={"120px"}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 3 }}>
          Access to
        </Typography>
        <Box>
          {accessItems.map((item) => (
            <Box
              key={item.module}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 2,
                borderRadius: 2,
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                value={item.module}
                disabled
                sx={{ mr: 8 }}
              />
              <RadioGroup
                row
                value={
                  item.permissions.readOnly ? "Read Only" : "Read and Write"
                }
                onChange={(e) =>
                  handleAccessChange(item.module, e.target.value)
                }
                sx={{ mr: 2 }}
                disabled={mode === "view"}
              >
                <FormControlLabel
                  value="Read Only"
                  control={<Radio />}
                  label="Read Only"
                  disabled={mode === "view"}
                />
                <FormControlLabel
                  value="Read and Write"
                  control={<Radio />}
                  label="Read and Write"
                  disabled={mode === "view"}
                />
              </RadioGroup>
              {mode !== "view" && (
                <Box display="flex">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteAccessItem(item.module)}
                  >
                    <Trash size={20} />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewRole;
