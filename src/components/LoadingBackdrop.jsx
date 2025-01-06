import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
}));

const LoadingBackdrop = ({ open = false, children }) => {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <StyledBackdrop open={open}>
        <CircularProgress color="primary" />
      </StyledBackdrop>
    </div>
  );
};

export default LoadingBackdrop;
