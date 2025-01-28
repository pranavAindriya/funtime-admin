import React, { Suspense, lazy } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login";
import DashboardMain from "./pages/dashboard";

// Lazy load all route components
const AdminProfile = lazy(() => import("./pages/profile/AdminProfile"));
const Users = lazy(() => import("./pages/Users/Users"));
const AddNewUser = lazy(() => import("./pages/Users/AddNewUser"));
const UserOverview = lazy(() => import("./pages/Users/UserTabs/UserOverview"));
const KycDetails = lazy(() => import("./pages/Users/UserTabs/KycDetails"));
const Coins = lazy(() => import("./pages/Coins/Coins"));
const AddNewCoin = lazy(() => import("./pages/Coins/AddNewCoin"));
const LanguageList = lazy(() => import("./pages/Language/LanguageList"));
const AddNewLanguage = lazy(() => import("./pages/Language/AddNewLanguage"));
const CMSPage = lazy(() => import("./pages/CMS Page/CMSPage"));
const CMSAddNew = lazy(() => import("./pages/CMS Page/CMSAddNew"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Leaderboard = lazy(() => import("./pages/LeaderBoard/Leaderboard"));
const AddNewLeaderboard = lazy(() =>
  import("./pages/LeaderBoard/AddNewLeaderboard")
);
const Banner = lazy(() => import("./pages/Banner/Banner"));
const AddNewBanner = lazy(() => import("./pages/Banner/AddNewBanner"));
const TdsReport = lazy(() => import("./pages/TDS Report/TdsReport"));
const Conversion = lazy(() => import("./pages/Conversion/Conversion"));
const UserRoles = lazy(() => import("./pages/Admin/UserRoles/UserRoles"));
const Notifications = lazy(() => import("./pages/notifications/Notifications"));
const AddNewNotification = lazy(() =>
  import("./pages/notifications/AddNewNotification")
);
const AddNewAdmin = lazy(() => import("./pages/Admin/UserRoles/AddNewAdmin"));
const AddNewRole = lazy(() => import("./pages/Admin/UserRoles/AddNewRole"));
const Reports = lazy(() => import("./pages/Report/Reports"));
const ReportAndBlock = lazy(() =>
  import("./pages/ReportOrBlock/ReportAndBlock")
);
const CallsList = lazy(() => import("./pages/Calls/CallsList"));
const Withdrawal = lazy(() => import("./pages/Withdrawals/Withdrawal"));

// Route configurations
const routes = [
  { path: "/dashboard", component: DashboardMain },
  { path: "/profile", component: AdminProfile },
  { path: "/users", component: Users },
  { path: "/coins", component: Coins },
  { path: "/language", component: LanguageList },
  { path: "/notifications", component: Notifications },
  { path: "/reportandblock", component: ReportAndBlock },
  { path: "/banner", component: Banner },
  { path: "/cms", component: CMSPage },
  { path: "/settings", component: Settings },
  { path: "/leaderboard", component: Leaderboard },
  { path: "/withdrawals", component: Withdrawal },
  { path: "/conversion", component: Conversion },
  { path: "/calls", component: CallsList },
  { path: "/reports", component: Reports },
  { path: "/tdsreport", component: TdsReport },
  { path: "/user-roles", component: UserRoles },
  // Users routes
  { path: "/users/add", component: AddNewUser },
  { path: "/users/overview/:id", component: UserOverview },
  { path: "/users/:type/:id", component: AddNewUser },
  { path: "/users/kyc-details/:id", component: KycDetails },
  // Admin routes
  { path: "/admin/addnewadmin", component: AddNewAdmin },
  { path: "/admin/:type/:id", component: AddNewAdmin },
  { path: "/admin/addnewrole", component: AddNewRole },
  { path: "/admin/role/:type/:id", component: AddNewRole },
  // Banner routes
  { path: "/banner/:type/:id", component: AddNewBanner },
  { path: "/banner/addnewbanner", component: AddNewBanner },
  // Coins routes
  { path: "/coins/add", component: AddNewCoin },
  { path: "/coins/:type/:id", component: AddNewCoin },
  // Language routes
  { path: "/language/add", component: AddNewLanguage },
  { path: "/language/:type/:id", component: AddNewLanguage },
  // CMS routes
  { path: "/cms/addnew", component: CMSAddNew },
  { path: "/cms/:type/:id", component: CMSAddNew },
  // Notification routes
  { path: "/notifications/addnew", component: AddNewNotification },
  { path: "/notifications/:type/:id", component: AddNewNotification },
  // Leaderboard routes
  { path: "/leaderboard/add", component: AddNewLeaderboard },
  { path: "/leaderboard/:type/:id", component: AddNewLeaderboard },
];

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false,
  //       refetchOnMount: false,
  //     },
  //   },
  // });

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ToastContainer position="top-center" transition="Slide" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          isWideScreen={isWideScreen}
        />

        <Box
          sx={{
            flexGrow: 1,
            width: isWideScreen ? "84%" : "100%",
            // marginLeft: isWideScreen ? "16%" : 0,
          }}
        >
          <Header
            isWideScreen={isWideScreen}
            handleDrawerToggle={handleDrawerToggle}
          />

          <Box sx={{ padding: { xs: theme.spacing(2), lg: theme.spacing(4) } }}>
            <ToastContainer position="top-center" transition="Slide" />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                {routes.map(({ path, component: Component }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute>
                        <Component />
                      </ProtectedRoute>
                    }
                  />
                ))}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default App;
