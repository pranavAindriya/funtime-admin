import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { setLogout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    handleClose();
    navigate("/");
  };

  return (
    <Box
      sx={{
        borderBottom: "#b5b5b5 1px solid",
        paddingBlock: "18px",
      }}
    >
      <div
        style={{
          backgroundColor: "background.secondary",
          width: "min-content",
          borderRadius: "12px",
          marginLeft: "auto",
          marginRight: "50px",
        }}
      >
        <IconButton
          size="small"
          disableRipple
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <img
            src={PlaceholderImage}
            style={{ width: "40px", height: "40px", borderRadius: "12px" }}
          /> */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingRight: "10px",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600 }}>Admin</span>
            {/* <span style={{ fontSize: "10px", fontWeight: 400 }}>Admin</span> */}
          </div>
          <CaretDown size={22} style={{ marginRight: "10px" }} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          keepMounted
          transformOrigin={{
            vertical: "right",
            horizontal: "left",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate("profile");
              handleClose();
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/user-roles");
              handleClose();
            }}
          >
            User Roles
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/settings");
              handleClose();
            }}
          >
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </Box>
  );
};

export default Header;
