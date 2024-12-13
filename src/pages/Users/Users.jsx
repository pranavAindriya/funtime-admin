import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Userlist from "./UserTabs/Userlist";
import KycRequests from "./UserTabs/KycRequests";
import BlackLists from "./UserTabs/BlackLists";
import HostedUsers from "./UserTabs/HostedUsers";
import { Plus } from "@phosphor-icons/react";

const tabs = [
  {
    label: "User List",
    value: "users",
    component: <Userlist />,
  },
  {
    label: "Host Requests",
    value: "hosts",
    component: <HostedUsers />,
  },
  {
    label: "KYC Requests",
    value: "kyc",
    component: <KycRequests />,
  },
  {
    label: "Black List",
    value: "blacklist",
    component: <BlackLists />,
  },
];

const Users = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "users";

  const [value, setValue] = useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`);
  };

  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
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
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
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
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Users;
