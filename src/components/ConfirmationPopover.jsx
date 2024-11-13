import React from "react";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { Check, X } from "@phosphor-icons/react";
import theme from "../../theme";

const ConfirmationPopover = ({ anchorEl, handleClose, handleConfirm }) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      id="delete-pop"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          maxWidth: "180px",
          padding: "15px",
          display: "grid",
          gap: "8px",
        }}
      >
        <Typography>Are you sure you want to delete?</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton onClick={handleConfirm}>
            <Check size={20} color={theme.palette.success.main} />
          </IconButton>
          <IconButton onClick={handleClose}>
            <X size={20} color={theme.palette.error.main} />
          </IconButton>
        </Box>
      </Box>
    </Popover>
  );
};

export default ConfirmationPopover;
