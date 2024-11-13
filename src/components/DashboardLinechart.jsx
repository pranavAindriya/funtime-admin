import { Box, Stack, Typography } from "@mui/material";
import { LineChart, areaElementClasses, useDrawingArea } from "@mui/x-charts";
import React from "react";

const DashboardLinechart = () => {
  function ColorPalette({ id }) {
    const { top, height, bottom } = useDrawingArea();
    const svgHeight = top + bottom + height;

    const scale = 2; // You can provide the axis Id if you have multiple ones

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
          <stop offset="10%" stop-color="#FFB7F8" />
          <stop offset="100%" stop-color="#FFFFFF" />
          <stop offset="10%" stop-color="#8A2387" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </defs>
    );
  }

  return (
    <Box>
      <Typography fontWeight={600} fontSize={22} mb={2}>
        Revenue
      </Typography>
      <LineChart
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: "url(#swich-color-id-2)",
          },
        }}
        margin={{ top: 20, bottom: 30, left: 75 }}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            area: true,
            color: "#8A2387",
          },
        ]}
        width={700}
        height={300}
      >
        <ColorPalette id="swich-color-id-2" />
        <rect width="100%" height="100%" fill="url(#gradient1)" />
        <rect y="1" width="100%" height="100%" fill="url(#gradient2)" />
      </LineChart>
    </Box>
  );
};

export default DashboardLinechart;
