import React from "react";
import { Box, ButtonBase } from "@mui/material";

const DashboardCards = ({
  label,
  icon,
  amount,
  renderIcon,
  disableRupeeSymbol,
}) => {
  return (
    <Box>
      <ButtonBase
        sx={{
          borderRadius: "10px",
          boxShadow: " 0px 3.01px 3.01px 0px rgba(0, 0, 0, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "15px",
          width: "max-content",
          minWidth: "220px",
        }}
      >
        {renderIcon}
        {icon && <img src={icon} />}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {amount ? (
            <p
              style={{
                fontWeight: 700,
                fontSize: "22px",
                margin: 0,
                padding: 0,
              }}
            >
              {!disableRupeeSymbol && "₹"}
              {amount}
            </p>
          ) : (
            <p
              style={{
                fontWeight: 700,
                fontSize: "22px",
                margin: 0,
                padding: 0,
              }}
            >
              {!disableRupeeSymbol && "₹"}0
            </p>
          )}
          <p
            style={{
              margin: 0,
              padding: 0,
              fontWeight: 500,
            }}
          >
            {label}
          </p>
        </Box>
      </ButtonBase>
    </Box>
  );
};

export default DashboardCards;
