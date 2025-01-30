import { Typography, Button, Pagination } from "@mui/material";
import React, { useState } from "react";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import DataTable from "../../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import {
  getCoinPurchaseReports,
  exportCoinPurchaseReport,
} from "../../service/allApi";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";

const CoinPurchase = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "coinPurchaseReport",
      isFilterApplied ? { startDate, endDate, page, limit } : { page, limit },
    ],
    queryFn: () =>
      getCoinPurchaseReports(
        isFilterApplied ? { startDate, endDate, page, limit } : { page, limit }
      ),
    select: (data) => data?.data,
  });

  const columns = [
    { field: "invoiceBillNo", headerName: "Invoice Bill number" },
    { field: "customerId", headerName: "Customer ID" },
    { field: "customerName", headerName: "Customer Name" },
    { field: "customerMobileNumber", headerName: "Mobile Number" },
    { field: "country", headerName: "Country" },
    { field: "state", headerName: "State" },
    { field: "date", headerName: "Date" },
    { field: "totalAmount", headerName: "Total Amount" },
    { field: "saleAmount", headerName: "Sale Amount" },
    { field: "gst", headerName: "GST" },
  ];

  const rows = data?.data?.map((data) => ({
    invoiceBillNo: data.invoiceBillNo,
    customerId: data.customerId,
    customerName: data.customerName,
    customerMobileNumber: data.mobileNo,
    country: data.country,
    state: data.state,
    date: data.date,
    totalAmount: data.totalAmount,
    saleAmount: data.saleAmount,
    gst: data.GST,
  }));

  const today = new Date().toISOString().split("T")[0];

  const handleFilterClick = () => {
    setIsFilterApplied(true);
    setPage(1);
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterApplied(false);
    setPage(1);
    refetch();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      let response;

      if (isFilterApplied) {
        response = await exportCoinPurchaseReport({
          fromDate: startDate,
          toDate: endDate,
        });
      } else {
        response = await exportCoinPurchaseReport();
      }

      if (response?.data?.fileUrl) {
        window.open(response?.data?.fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Coin Purchase", "readAndWrite")
  );

  const isBlocked = useSelector((state) =>
    isModuleBlocked(state, "Coin Purchase")
  );

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

  return (
    <LoadingBackdrop open={isLoading || isExporting}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography fontSize={23} fontWeight={600}>
          Coin Purchase Reports
        </Typography>
        {hasAccess && (
          <Button variant="contained" onClick={handleExport}>
            Export
          </Button>
        )}
      </Box>

      <Box mb={3}>
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          flexWrap={"wrap"}
          justifyContent={{ xs: "center", md: "flex-start" }}
        >
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: startDate, max: today }}
            />
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Button
              variant="contained"
              onClick={handleFilterClick}
              disabled={!startDate || !endDate}
            >
              Filter by Date
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              disabled={!isFilterApplied}
            >
              Clear Filter
            </Button>
          </Box>
        </Box>
      </Box>

      <Pagination
        count={data?.totalPages || 1}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          mt: 4,
        }}
        onChange={handlePageChange}
      />
      <DataTable columns={columns} rows={rows} />
      <Pagination
        count={data?.totalPages || 1}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          mt: 4,
        }}
        onChange={handlePageChange}
      />
    </LoadingBackdrop>
  );
};

export default CoinPurchase;
