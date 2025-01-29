import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
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
import DataTable from "../../components/DataTable";
import { BASE_URL } from "../../service/environment";
import formatDate from "../../utils/formatdate";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { isModuleBlocked } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";

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

const fetchSalesData = async ({
  page,
  limit,
  filter,
  startDate,
  endDate,
  type,
}) => {
  const params = { page, limit };

  if (filter === "week" || filter === "today") {
    params.filter = filter;
  } else if (startDate && endDate) {
    params.fromDate = startDate;
    params.toDate = endDate;
  }

  if (type) {
    params.type = type;
  }

  const response = await axios.get(
    `${BASE_URL}api/users/getCoinPackagePurchases`,
    { params }
  );
  return response.data;
};

const exportTransactionHistory = async (startDate, endDate) => {
  const response = await axios.get(
    `${BASE_URL}api/users/transactionHistoryExport`,
    {
      params: { fromDate: startDate, toDate: endDate },
    }
  );
  return response.data;
};

const Report = () => {
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    type: null,
    dateFilter: "all",
    startDate: null,
    endDate: null,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["salesData", filter],
    queryFn: () =>
      fetchSalesData({
        page: filter.page,
        limit: filter.limit,
        filter: filter.dateFilter,
        startDate: filter.startDate,
        endDate: filter.endDate,
        type: filter.type,
      }),
  });

  const handlePageChange = (event, newPage) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handleQuickFilter = (type) => {
    const newFilter = { ...filter, page: 1 };

    switch (type) {
      case "all":
        newFilter.dateFilter = "all";
        newFilter.startDate = null;
        newFilter.endDate = null;
        newFilter.type = null;
        break;
      case "today":
        newFilter.dateFilter = "today";
        newFilter.startDate = null;
        newFilter.endDate = null;
        break;
      case "week":
        newFilter.dateFilter = "week";
        newFilter.startDate = null;
        newFilter.endDate = null;
        break;
      case "currentMonth":
        newFilter.dateFilter = "currentMonth";
        newFilter.startDate = getFirstDayOfMonth();
        newFilter.endDate = getLastDayOfMonth();
        break;
      case "lastMonth":
        newFilter.dateFilter = "lastMonth";
        newFilter.startDate = getFirstDayOfLastMonth();
        newFilter.endDate = getLastDayOfLastMonth();
        break;
      case "purchaseOnly":
        newFilter.type = "Purchase";
        break;
      default:
        newFilter.type = null;
    }

    setFilter(newFilter);
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setFilter((prev) => ({
        ...prev,
        dateFilter: "custom",
        startDate: customStartDate,
        endDate: customEndDate,
        page: 1,
      }));
      setOpenDateDialog(false);
    }
  };

  const handleExport = async () => {
    if (exportStartDate && exportEndDate) {
      try {
        const response = await exportTransactionHistory(
          exportStartDate,
          exportEndDate
        );
        window.open(response.fileUrl, "_blank");
        setOpenExportDialog(false);
      } catch (error) {
        console.error("Error exporting transaction history:", error);
      }
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
    { field: "orderId", headerName: "Order ID" },
    { field: "paymentId", headerName: "Payment ID" },
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

  const formattedRows =
    data?.transactions.map((transaction) => ({
      _id: transaction?._id,
      username: transaction?.userId?.username,
      type: transaction?.type,
      amount: { amount: transaction?.amount, type: transaction?.type },
      coins: transaction?.coins,
      orderId: transaction?.orderId,
      paymentId: transaction?.paymentId,
      status: transaction?.status,
      description: transaction?.description,
      createdAt: formatDate(transaction?.createdAt),
    })) || [];

  const chartData =
    data?.transactions.map((transaction) => ({
      name: formatDate(transaction.createdAt).split(" ")[0],
      value: transaction.amount,
    })) || [];

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Reports"));

  if (isBlocked) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h4">
          You do not have access to this page
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error loading sales data</Typography>;
  }

  return (
    <LoadingBackdrop open={isLoading}>
      <Typography mb={4} sx={{ fontWeight: 700, fontSize: "28px" }}>
        Sales Report
      </Typography>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={2}
        flexWrap={"wrap"}
        gap={1}
      >
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Chip
            label="All"
            onClick={() => handleQuickFilter("all")}
            color={filter.dateFilter === "all" ? "primary" : "default"}
          />
          <Chip
            label="Today"
            onClick={() => handleQuickFilter("today")}
            color={filter.dateFilter === "today" ? "primary" : "default"}
          />
          <Chip
            label="This Week"
            onClick={() => handleQuickFilter("week")}
            color={filter.dateFilter === "week" ? "primary" : "default"}
          />
          <Chip
            label="Current Month"
            onClick={() => handleQuickFilter("currentMonth")}
            color={filter.dateFilter === "currentMonth" ? "primary" : "default"}
          />
          <Chip
            label="Last Month"
            onClick={() => handleQuickFilter("lastMonth")}
            color={filter.dateFilter === "lastMonth" ? "primary" : "default"}
          />
          <Chip
            label="Custom Date Range"
            onClick={() => setOpenDateDialog(true)}
            color={
              filter.dateFilter === "custom" &&
              filter.startDate &&
              filter.endDate
                ? "primary"
                : "default"
            }
          />
        </Box>
        <Button
          sx={{
            marginLeft: "auto",
            marginInline: { xs: "auto", md: 0 },
          }}
          variant="contained"
          color="primary"
          onClick={() => setOpenExportDialog(true)}
        >
          Export Transaction History
        </Button>
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

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
      >
        <DialogTitle>Export Transaction History</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)}>Cancel</Button>
          <Button
            onClick={handleExport}
            disabled={!exportStartDate || !exportEndDate}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" mb={4} mt={3} fontWeight={500} fontSize={26}>
        Sales Overview
      </Typography>

      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={8}>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              p: 2,
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h4" color="primary">
                  ₹{data?.totalAmount || 0}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Expense
                </Typography>
                <Typography variant="h4" color="error">
                  ₹{data?.totalExpense || 0}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Profit
                </Typography>
                <Typography variant="h4" color="success">
                  ₹{data?.totalProfit || 0}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          Transactions
        </Typography>
        <DataTable rows={formattedRows} columns={columns} />

        <Pagination
          count={data?.pagination?.totalPages || 1}
          page={filter.page}
          color="primary"
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
          onChange={handlePageChange}
        />
      </Box>
    </LoadingBackdrop>
  );
};

export default Report;
