import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import DataTable from "../../components/DataTable";
import { BASE_URL } from "../../service/environment";
import formatDate from "../../utils/formatdate";

const getFirstDayOfMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;
};

const getLastDayOfMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}`;
};

const getFirstDayOfLastMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;
};

const getLastDayOfLastMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}`;
};

const Report = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filter, setFilter] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
    page: 1,
    limit: 10,
    type: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/users/getCoinPackagePurchases`,
          {
            params: {
              filter: "custom",
              startDate: filter.startDate,
              endDate: filter.endDate,
              page: filter.page,
              limit: filter.limit,
              type: filter.type,
            },
          }
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

  const handleQuickFilter = (type) => {
    switch (type) {
      case "currentMonth":
        setFilter({
          ...filter,
          startDate: getFirstDayOfMonth(),
          endDate: getLastDayOfMonth(),
          type: null,
          page: 1,
        });
        break;
      case "lastMonth":
        setFilter({
          ...filter,
          startDate: getFirstDayOfLastMonth(),
          endDate: getLastDayOfLastMonth(),
          type: null,
          page: 1,
        });
        break;
      case "purchaseOnly":
        setFilter({
          ...filter,
          type: "Purchase",
          page: 1,
        });
        break;
      default:
        setFilter({
          ...filter,
          type: null,
          page: 1,
        });
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setFilter({
        ...filter,
        startDate: customStartDate,
        endDate: customEndDate,
        page: 1,
      });
      setOpenDateDialog(false);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID" },
    { field: "username", headerName: "User" },
    { field: "type", headerName: "Type" },
    {
      field: "amount",
      headerName: "Amount",
      renderCell: (value) => (
        <Typography
          sx={{
            color: value.type === "Purchase" ? "success.main" : "error.main",
          }}
        >
          {value.type === "Purchase" ? "+" : "-"} {value.amount}
        </Typography>
      ),
    },
    { field: "coins", headerName: "Coins" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value) => (
        <Typography
          sx={{
            color:
              value === "success"
                ? "success.main"
                : value === "pending"
                ? "warning.main"
                : "error.main",
          }}
        >
          {value}
        </Typography>
      ),
    },
    { field: "description", headerName: "Description" },
    { field: "createdAt", headerName: "Date" },
  ];

  const formatedTransactions = () => {
    return filteredData?.transactions?.map((transaction, ind) => ({
      _id: transaction?._id,
      username: transaction?.userId?.username,
      type: transaction?.type,
      amount: { amount: transaction?.amount, type: transaction?.type },
      coins: transaction?.coins,
      status: transaction?.status,
      description: transaction?.description,
      createdAt: formatDate(transaction?.createdAt),
    }));
  };

  const formattedRows = formatedTransactions();

  const chartData = filteredData
    ? filteredData.transactions.map((transaction) => ({
        name: formatDate(transaction.createdAt).split(" ")[0],
        value: transaction.amount,
      }))
    : [];

  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Sales Report
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        <Chip
          label="Current Month"
          onClick={() => handleQuickFilter("currentMonth")}
          color={
            filter.startDate === getFirstDayOfMonth() ? "primary" : "default"
          }
          sx={{
            backgroundColor:
              filter.startDate === getFirstDayOfMonth() && "primary.main",
          }}
        />
        <Chip
          label="Last Month"
          onClick={() => handleQuickFilter("lastMonth")}
          color={
            filter.startDate === getFirstDayOfLastMonth()
              ? "primary"
              : "default"
          }
          sx={{
            backgroundColor:
              filter.startDate === getFirstDayOfLastMonth() && "primary.main",
          }}
        />
        <Chip
          label="Purchases Only"
          onClick={() => handleQuickFilter("purchaseOnly")}
          color={filter.type === "Purchase" ? "primary" : "default"}
          sx={{
            backgroundColor: filter.type === "Purchase" && "primary.main",
          }}
        />

        <Chip
          label={`${filter.startDate} to ${filter.endDate}`}
          onClick={() => setOpenDateDialog(true)}
        />

        <Chip
          label="Reset Filters"
          onClick={() => {
            setFilter({
              startDate: getFirstDayOfMonth(),
              endDate: getLastDayOfMonth(),
              page: 1,
              limit: 10,
              type: null,
            });
          }}
        />
      </Box>

      <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCustomDateApply}
            disabled={!customStartDate || !customEndDate}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" mb={4} mt={3} fontWeight={500} fontSize={26}>
        Sales Overview
      </Typography>

      <Grid2 container spacing={5} alignItems={"center"}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid2>

        <Grid2
          size={{ xs: 12, md: 4 }}
          textAlign={"center"}
          display={"flex"}
          flexDirection={"column"}
          gap={1}
          sx={{
            backgroundColor: "#F5F5F5",
            p: 2,
            borderRadius: "20px",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4" color="primary">
                ₹{filteredData?.totalAmount || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Expense
              </Typography>
              <Typography variant="h4" color="error">
                ₹{filteredData?.totalExpense || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Profit
              </Typography>
              <Typography variant="h4" color="success">
                ₹{filteredData?.totalProfit || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          Transactions
        </Typography>
        <DataTable rows={formattedRows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Report;
