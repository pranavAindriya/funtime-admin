import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Toolbar,
  useTheme,
  Box,
} from "@mui/material";
import sidebarItems, { MODULES } from "../utils/sidebarItems";
import { isModuleBlocked } from "../redux/slices/authSlice";

const Sidebar = ({ mobileOpen, handleDrawerToggle, isWideScreen }) => {
  const location = useLocation();
  const theme = useTheme();

  const drawerWidth = isWideScreen ? "16%" : "50%";

  const getListItemStyle = (link) => ({
    backgroundColor:
      location.pathname === link ? theme.palette.error.main : "inherit",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor:
        location.pathname === link ? theme.palette.error.main : "inherit",
    },
    display: "flex",
    gap: "20px",
    alignItems: "center",
  });

  const visibleItems = sidebarItems.filter((item) => {
    if (item.module === MODULES.DASHBOARD) return true;
    return !useSelector((state) => isModuleBlocked(state, item.module));
  });

  const drawer = (
    <>
      <Toolbar>
        <img
          src="https://i.postimg.cc/Y0Ffvbsx/heart-angle-svgrepo-com-1.png"
          style={{ marginInline: "auto", marginBlock: "30px", width: "50px" }}
          alt="Logo"
        />
      </Toolbar>
      <List>
        {visibleItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={item.text}
            sx={getListItemStyle(item.link)}
            onClick={!isWideScreen ? handleDrawerToggle : undefined}
          >
            <item.icon size={26} color="white" />
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
