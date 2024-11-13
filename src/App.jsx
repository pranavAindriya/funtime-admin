import React, { useEffect } from "react";
import Login from "./pages/login";
import { Box, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashboardMain from "./pages/dashboard";
import { useSelector } from "react-redux";
import AdminProfile from "./pages/profile/AdminProfile";
import Users from "./pages/Users/Users";
import AddNewUser from "./pages/Users/AddNewUser";
import Coins from "./pages/Coins/Coins";
import AddNewCoin from "./pages/Coins/AddNewCoin";
import LanguageList from "./pages/Language/LanguageList";
import AddNewLanguage from "./pages/Language/AddNewLanguage";
import CMSAddNew from "./pages/CMS Page/CMSAddNew";
import CMSPage from "./pages/CMS Page/CMSPage";
import Settings from "./pages/Settings/Settings";
import Leaderboard from "./pages/LeaderBoard/Leaderboard";
import AddNewLeaderboard from "./pages/LeaderBoard/AddNewLeaderboard";
import Conversion from "./pages/Conversion/Conversion";
import UserRoles from "./pages/Admin/UserRoles/UserRoles";
import Notifications from "./pages/notifications/Notifications";
import AddNewNotification from "./pages/notifications/AddNewNotification";

const App = () => {
  const mediaQuery800px = useMediaQuery("(min-width:800px)");
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isLoggedIn = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box sx={{ display: !mediaQuery800px && "none" }}>
        <Sidebar />
      </Box>

      <Box
        sx={{ marginLeft: mediaQuery800px && "16%", flexGrow: 1, width: "84%" }}
      >
        <Box>
          <Header />
        </Box>

        <Box sx={{ padding: "30px" }}>
          <ToastContainer position="top-center" transition={"Slide"} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardMain />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/coins" element={<Coins />} />
            <Route path="/language" element={<LanguageList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/cms" element={<CMSPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/conversion" element={<Conversion />} />
            <Route path="/user-roles" element={<UserRoles />} />
            {/* <Route path="/wallpapers" element={<Wallpapers />} />
            <Route path="/frames" element={<Frames />} />
            <Route path="/language" element={<LanguageList />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/moods" element={<Moods />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/banner" element={<Banners />} />
            <Route path="/cms" element={<CMSPage />} /> */}

            {/* Users */}
            <Route path="/users/add" element={<AddNewUser />} />
            <Route path="/users/:type/:id" element={<AddNewUser />} />

            {/* Coins */}
            <Route path="/coins/add" element={<AddNewCoin />} />
            <Route path="/coins/:type/:id" element={<AddNewCoin />} />

            {/* Language */}
            <Route path="/language/add" element={<AddNewLanguage />} />
            <Route path="/language/:type/:id" element={<AddNewLanguage />} />

            {/* CMS */}
            <Route path="/cms/addnew" element={<CMSAddNew />} />
            <Route path="/cms/:type/:id" element={<CMSAddNew />} />

            {/* Notification */}
            <Route
              path="/notifications/addnew"
              element={<AddNewNotification />}
            />
            <Route
              path="/notifications/:type/:id"
              element={<AddNewNotification />}
            />

            {/* Leaderboard */}
            <Route path="/leaderboard/add" element={<AddNewLeaderboard />} />
            <Route
              path="/leaderboard/:type/:id"
              element={<AddNewLeaderboard />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
