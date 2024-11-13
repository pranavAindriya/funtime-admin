import { Box, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import Rupee from "../../assets/DashboardRupeeSymbol.svg";
import TotalSales from "../../assets/DashboardTotalSalesSymbol.svg";
import TotalReturn from "../../assets/DashboardTotalReturnSymbol.svg";
import TotalShops from "../../assets/DashboardTotalShopsSymbol.svg";
import DashboardCards from "../../components/DashboardCards";
import DashboardLinechart from "../../components/DashboardLinechart";
import TopSellingPackages from "../../components/TopSellingPackages";

const DashboardMain = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [ApiSuccess, setApiSuccess] = useState(false);

  //   const getDashboardData = async () => {
  //     const response = await getDashboardDetails();
  //     if (response.status === 201) {
  //       setApiSuccess(true);
  //       setDashboardData(response.data);
  //     }
  //   };

  //   useEffect(() => {
  //     getDashboardData();
  //   }, []);

  const cardData = [
    {
      icon: Rupee,
      label: "Total Revenue",
      amount: dashboardData.TotalRevenue ? dashboardData.TotalRevenue : null,
    },
    {
      icon: TotalSales,
      label: "Total Sales Order",
      amount: dashboardData.TotalSalesOrder
        ? dashboardData.TotalSalesOrder
        : null,
    },
    {
      icon: TotalReturn,
      label: "Total Return Order",
      amount: dashboardData.TotalReturnOrder
        ? dashboardData.TotalReturnOrder
        : null,
    },
    {
      icon: TotalShops,
      label: "Total Shops",
      amount: dashboardData.TotalShop ? dashboardData.TotalShop : null,
    },
  ];

  return (
    <div style={{ width: "100%", marginInline: "auto" }}>
      <p style={{ fontWeight: 600, fontSize: "20px" }}>Quick View</p>
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          marginInline: "30px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {cardData?.map((item, index) => (
          <DashboardCards
            icon={item.icon}
            label={item.label}
            key={index}
            amount={item.amount}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexWrap: "wrap",
          marginBlock: "40px",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DashboardLinechart />
        </Box>

        <Box
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            borderRadius: "16px",
            paddingInline: "30px",
            flexGrow: 0.5,
          }}
        >
          <p style={{ fontWeight: 600, fontSize: "22px" }}>
            Top Selling Packages
          </p>
          <Box>
            <TopSellingPackages />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardMain;
