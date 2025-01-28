import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LineChart, areaElementClasses, useDrawingArea } from "@mui/x-charts";

const DashboardLinechart = ({ transactions }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [chartWidth, setChartWidth] = useState(700);

  function ColorPalette({ id }) {
    const { top, height, bottom } = useDrawingArea();
    const svgHeight = top + bottom + height;

    return (
      <defs>
        <linearGradient
          id={id}
          x1="0"
          x2="0"
          y1="0"
          y2={`${svgHeight}px`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="10%" stopColor="#FFB7F8" />
          <stop offset="100%" stopColor="#FFFFFF" />
          <stop offset="10%" stopColor="#8A2387" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      const width =
        window.innerWidth > 1200
          ? 700
          : window.innerWidth > 900
          ? 500
          : window.innerWidth > 600
          ? 350
          : window.innerWidth - 100;
      setChartWidth(width);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = transactions.map((transaction) => transaction.amount);
  const labels = transactions.map((transaction, index) => index + 1);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <Typography fontWeight={600} fontSize={22} mb={2}>
        Revenue
      </Typography>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <LineChart
          sx={{
            [`& .${areaElementClasses.root}`]: {
              fill: "url(#swich-color-id-2)",
            },
            width: "100%",
            minWidth: "300px",
          }}
          margin={{
            top: 20,
            bottom: 30,
            left: isSmallScreen ? 40 : 75,
            right: isSmallScreen ? 20 : 40,
          }}
          xAxis={[{ data: labels }]}
          series={[
            {
              data,
              area: true,
              color: "#8A2387",
            },
          ]}
          width={chartWidth}
          height={300}
        >
          <ColorPalette id="swich-color-id-2" />
          <rect width="100%" height="100%" fill="url(#gradient1)" />
          <rect y="1" width="100%" height="100%" fill="url(#gradient2)" />
        </LineChart>
      </Box>
    </Box>
  );
};

export default DashboardLinechart;
