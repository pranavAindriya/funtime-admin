import { Typography, Button, Pagination } from "@mui/material";
import React, { useState } from "react";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import DataTable from "../../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getTdsReports } from "../../service/allApi";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TdsReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "tdsReport",
      isFilterApplied ? { startDate, endDate, page, limit } : { page, limit },
    ],
    queryFn: () =>
      getTdsReports(
        isFilterApplied ? { startDate, endDate, page, limit } : { page, limit }
      ),
    select: (data) => data?.data,
  });

  const columns = [
    { field: "invoiceBillNo", headerName: "Invoice Bill number" },
    { field: "customerId", headerName: "Customer ID" },
    { field: "customerName", headerName: "Customer Name" },
    { field: "customerMobileNumber", headerName: "Mobile Number" },
    { field: "panNumber", headerName: "Pan Number" },
    { field: "country", headerName: "Country" },
    { field: "state", headerName: "State" },
    { field: "date", headerName: "Date" },
    { field: "hostCommissionEarned", headerName: "Host Commission Earned" },
  ];

  const rows = data?.data?.map((data) => ({
    invoiceBillNo: data.invoiceBillNo,
    customerId: data.hostCustomerId,
    customerName: data.hostCustomerName,
    customerMobileNumber: data.mobileNumber,
    panNumber: data.panNumber,
    country: data.country,
    state: data.state,
    date: data.date,
    hostCommissionEarned: data.hostCommissionEarned,
  }));

  const today = new Date().toISOString().split("T")[0];

  const handleFilterClick = () => {
    setIsFilterApplied(true);
    setPage(1); // Reset to first page when applying a new filter
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterApplied(false);
    setPage(1); // Reset to first page when clearing the filter
    refetch();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  return (
    <LoadingBackdrop open={isLoading}>
      <Typography fontSize={23} fontWeight={600} mb={3}>
        TDS Reports
      </Typography>
      <Box mb={3} display="flex" gap={2} alignItems="center">
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
      <Pagination
        count={data?.pagination?.totalPages || 1}
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
        count={data?.pagination?.totalPages || 1}
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

export default TdsReport;
