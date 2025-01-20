import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Rupee from "../../assets/DashboardRupeeSymbol.svg";
import TotalSales from "../../assets/DashboardTotalSalesSymbol.svg";
import TotalReturn from "../../assets/DashboardTotalReturnSymbol.svg";
import TotalShops from "../../assets/DashboardTotalShopsSymbol.svg";
import DashboardCards from "../../components/DashboardCards";
import DashboardLinechart from "../../components/DashboardLinechart";
import TopSellingPackages from "../../components/TopSellingPackages";
import { getDashboardData } from "../../service/allApi";
import DataTable from "../../components/DataTable";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const DashboardMain = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    totalTransactions: 0,
    totalProfit: 0,
    transactions: [],
  });
  const [ApiSuccess, setApiSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setApiSuccess(false);
    const response = await getDashboardData();
    console.log(response);
    if (response.status === 200) {
      setDashboardData(response.data);
    }
    setApiSuccess(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns = [
    { field: "userId", headerName: "User ID" },
    { field: "user", headerName: "User" },
    { field: "phone", headerName: "Phone" },
    { field: "dob", headerName: "DOB" },
    { field: "place", headerName: "Place" },
    { field: "gender", headerName: "Gender" },
    { field: "Coins", headerName: "Coins" },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <>
          <Button size="small" variant="contained">
            View
          </Button>
        </>
      ),
    },
  ];

  const cardData = [
    {
      icon: Rupee,
      label: "Total Revenue",
      amount: dashboardData?.totalRevenue,
    },
    {
      icon: TotalSales,
      label: "Total Users",
      amount: dashboardData?.totalExpense,
    },
    {
      icon: TotalReturn,
      label: "Total Withdrawal",
      amount: dashboardData?.totalTransactions,
    },
    {
      icon: TotalShops,
      label: "Total Profits",
      amount: dashboardData?.totalProfit,
    },
  ];

  return (
    <LoadingBackdrop
      open={!ApiSuccess}
      style={{ width: "100%", marginInline: "auto" }}
    >
      <p style={{ fontWeight: 600, fontSize: "20px" }}>Quick View</p>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 0, md: "20px" },
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
          mb: 10,
          gap: { xs: 10, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DashboardLinechart
            transactions={dashboardData.transactions.slice(0, 10)}
          />
        </Box>

        <Box
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            borderRadius: "16px",
            paddingInline: "30px",
            flexGrow: 0.5,
            minHeight: 300,
          }}
          py={2}
        >
          <p style={{ fontWeight: 600, fontSize: "22px" }}>
            Top Selling Packages
          </p>
          <Box height={"100%"}>
            <TopSellingPackages
              transactions={dashboardData.transactions.slice(0, 5)}
            />
          </Box>
        </Box>
      </Box>
      {/* <DataTable columns={columns} /> */}
    </LoadingBackdrop>
  );
};

export default DashboardMain;
