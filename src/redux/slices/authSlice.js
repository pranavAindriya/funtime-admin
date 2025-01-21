import { createSlice } from "@reduxjs/toolkit";
import { MODULES } from "../../utils/sidebarItems";

const initialState = {
  isLoggedIn: false,
  role: null,
  permissions: {},
  userId: null,
  blockedModules: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      const { role } = action.payload;
      state.role = role.name;
      state.permissions = role.access.reduce((acc, item) => {
        acc[item.module] = item.permissions;
        return acc;
      }, {});
      state.userId = role.id;
      const allowedModules = new Set(role.access.map((item) => item.module));
      state.blockedModules = {
        [MODULES.USERS]: !allowedModules.has(MODULES.USERS),
        [MODULES.CALLS]: !allowedModules.has(MODULES.CALLS),
        [MODULES.COINS]: !allowedModules.has(MODULES.COINS),
        [MODULES.CONVERSION]: !allowedModules.has(MODULES.CONVERSION),
        [MODULES.WITHDRAWAL]: !allowedModules.has(MODULES.WITHDRAWAL),
        [MODULES.LEADERBOARD]: !allowedModules.has(MODULES.LEADERBOARD),
        [MODULES.NOTIFICATIONS]: !allowedModules.has(MODULES.NOTIFICATIONS),
        [MODULES.REPORT_BLOCK]: !allowedModules.has(MODULES.REPORT_BLOCK),
        [MODULES.REPORTS]: !allowedModules.has(MODULES.REPORTS),
        [MODULES.LANGUAGE]: !allowedModules.has(MODULES.LANGUAGE),
      };
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.permissions = {};
      state.userId = null;
    },
  },
});

export const isLoggedIn = (state) => state.auth.isLoggedIn;
export const userRole = (state) => state.auth.role;
export const userId = (state) => state.auth.userId;
export const userPermissions = (state) => state.auth.permissions;

export const hasPermission = (
  state,
  module,
  requiredPermission = "readOnly"
) => {
  const permissions = state.auth.permissions[module];
  if (!permissions) return false;

  if (requiredPermission === "readAndWrite") {
    return permissions.readAndWrite;
  }
  return permissions.readOnly || permissions.readAndWrite;
};

export const isModuleBlocked = (state, module) => {
  if (module === "Dashboard") return false;
  // return state?.auth?.blockedModules[module] || false;
  if (state?.auth?.blockedModules) {
    return state.auth.blockedModules[module] || false;
  }
  return true;
};

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
