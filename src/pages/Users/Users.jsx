import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Userlist from "./UserTabs/Userlist";
import KycRequests from "./UserTabs/KycRequests";
import BlackLists from "./UserTabs/BlackLists";
import HostedUsers from "./UserTabs/HostedUsers";
import { Plus } from "@phosphor-icons/react";
import {
  hasPermission,
  isModuleBlocked,
  userPermissions,
} from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import HostUsers from "./UserTabs/HostUsers";

const tabs = [
  {
    label: "User List",
    value: "users",
    component: Userlist,
  },
  {
    label: "Host Requests",
    value: "hosts",
    component: HostedUsers,
  },
  {
    label: "Host Users",
    value: "hostusers",
    component: HostUsers,
  },
  {
    label: "KYC Requests",
    value: "kyc",
    component: KycRequests,
  },
  {
    label: "Black List",
    value: "blacklist",
    component: BlackLists,
  },
];

const Users = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const permissions = useSelector(userPermissions);

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "users";

  const [value, setValue] = useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`);
  };

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Users"));

  if (isBlocked) {
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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Collapse in={value === "users"}>
        {hasAccess && (
          <Button
            variant="contained"
            sx={{
              display: "flex",
              gap: "5px",
              marginLeft: "auto",
            }}
            onClick={() => navigate("/users/add")}
          >
            <Plus size={18} />
            Add New
          </Button>
        )}
      </Collapse>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disableRipple
              />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab) => (
          <TabPanel key={tab.value} value={tab.value}>
            <tab.component key={tab.value} />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Users;
