import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, useTheme } from "@mui/material";
import React, { useState } from "react";
import Userlist from "./UserTabs/Userlist";
import KycRequests from "./UserTabs/KycRequests";
import BlackLists from "./UserTabs/BlackLists";
import { Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    label: "User List",
    component: <Userlist />,
  },
  {
    label: "KYC Requests",
    component: <KycRequests />,
  },
  {
    label: "Black List",
    component: <BlackLists />,
  },
];

const Users = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{ backgroundColor: "white" }}
            TabIndicatorProps={{
              sx: {
                backgroundColor: "white",
                height: "100%",
              },
            }}
          >
            {tabs.map((tab, ind) => (
              <Tab
                key={ind}
                label={tab.label}
                value={(ind + 1).toString()}
                sx={{
                  backgroundColor:
                    value === (ind + 1).toString()
                      ? "white"
                      : theme.palette.secondary.main,
                  marginRight: "4px",
                  zIndex: value === (ind + 1).toString() && 1,
                  borderTopRightRadius: "8px",
                  borderTopLeftRadius: "8px",
                }}
                disableRipple
              />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab, ind) => (
          <TabPanel key={ind} value={(ind + 1).toString()}>
            {tab?.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Users;
