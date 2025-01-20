import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Toolbar,
  useTheme,
} from "@mui/material";
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
import sidebarItems, { MODULES } from "../utils/sidebarItems";
import { isModuleBlocked } from "../redux/slices/authSlice";

const drawerWidth = "16%";

// const mainItems = [
//   {
//     text: "Dashboard",
//     icon: <SquaresFour size={26} color="white" />,
//     link: "/dashboard",
//     module: "Dashboard", // Dashboard will always be shown
//   },
//   {
//     text: "Users",
//     icon: <Users size={26} color="white" />,
//     link: "/users",
//     module: "Users",
//   },
//   {
//     text: "Calls",
//     icon: <Phone size={26} color="white" />,
//     link: "/calls",
//     module: "Calls",
//   },
//   {
//     text: "Coins",
//     icon: <HandCoins size={26} color="white" />,
//     link: "/coins",
//     module: "Coins",
//   },
//   {
//     text: "Conversion",
//     icon: <Scales size={26} color="white" />,
//     link: "/conversion",
//     module: "Conversion",
//   },
//   {
//     text: "Withdrawal",
//     icon: <HandArrowDown size={26} color="white" />,
//     link: "/withdrawals",
//     module: "Withdrawal",
//   },
//   {
//     text: "Leader Board",
//     icon: <Trophy size={26} color="white" />,
//     link: "/leaderboard",
//     module: "Leaderboard",
//   },
//   {
//     text: "Notifications",
//     icon: <Notification size={26} color="white" />,
//     link: "/notifications",
//     module: "Notifications",
//   },
//   {
//     text: "Report / Block",
//     icon: <Shield size={26} color="white" />,
//     link: "/reportandblock",
//     module: "ReportBlock",
//   },
//   {
//     text: "Reports",
//     icon: <ChartPieSlice size={26} color="white" />,
//     link: "/reports",
//     module: "Reports",
//   },
//   {
//     text: "Language",
//     icon: <Translate size={26} color="white" />,
//     link: "/language",
//     module: "Language",
//   },
// ];

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const permissions = useSelector((state) => state.auth.permissions);

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          boxSizing: "border-box",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <Toolbar>
        <img
          src={"https://i.postimg.cc/Y0Ffvbsx/heart-angle-svgrepo-com-1.png"}
          style={{ marginInline: "auto", marginBlock: "30px", width: "50px" }}
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
          >
            <item.icon size={26} color="white" />
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
