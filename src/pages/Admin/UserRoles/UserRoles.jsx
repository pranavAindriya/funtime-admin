import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, useTheme } from "@mui/material";
import { Plus } from "@phosphor-icons/react";
import React, { useState } from "react";
import UserListTab from "./UserRoleTabs/UserListTab";
import UserRolesTab from "./UserRoleTabs/UserRolesTab";
import { useNavigate } from "react-router-dom";

const UserRoles = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Admin User List",
      component: <UserListTab />,
    },
    {
      label: "Admin User Roles",
      component: <UserRolesTab />,
    },
  ];

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                  color: "black !important",
                  fontWeight: value === (ind + 1).toString() && 700,
                  zIndex: value === (ind + 1).toString() && 1,
                  borderRadius: "4px",
                }}
                disableRipple
              />
            ))}
          </TabList>
          <Box>
            {value === "1" ? (
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  gap: "5px",
                  marginLeft: "auto",
                }}
                onClick={() => navigate("/admin/addnewadmin")}
              >
                <Plus size={18} color="white" />
                Add New User
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  gap: "5px",
                  marginLeft: "auto",
                }}
                onClick={() => navigate("/admin/addnewrole")}
              >
                <Plus size={18} color="white" />
                Add New Role
              </Button>
            )}
          </Box>
        </Box>
        {tabs.map((tab, ind) => (
          <TabPanel key={ind} value={(ind + 1).toString()}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default UserRoles;
