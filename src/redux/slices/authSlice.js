import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: null,
  permissions: {},
  userId: null,
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

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
