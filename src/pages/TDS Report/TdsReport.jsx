import { Typography, Button, Pagination, Chip } from "@mui/material";
import React, { useState } from "react";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import DataTable from "../../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getTdsReports, exportTdsReport } from "../../service/allApi";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import formatDate from "../../utils/formatdate";

const TDS_FILTER_TYPES = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const TdsReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedFilterType, setSelectedFilterType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "tdsReport",
      isFilterApplied
        ? { startDate, endDate, page, limit }
        : selectedFilterType
        ? { filterType: selectedFilterType, page, limit }
        : { page, limit },
    ],
    queryFn: () =>
      getTdsReports(
        isFilterApplied
          ? { startDate, endDate, page, limit }
          : selectedFilterType
          ? { filterType: selectedFilterType, page, limit }
          : { page, limit }
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
    { field: "tds", headerName: "TDS @ 2%" },
    { field: "platformFeeCollected", headerName: "Platform Fee Collected" },
    { field: "gstOnPlatformFee", headerName: "GST On Platform Fee" },
    { field: "netCommissionPaid", headerName: "Net Commission Paid" },
  ];

  const rows = data?.data?.map((data) => ({
    invoiceBillNo: data.invoiceBillNo,
    customerId: data.hostCustomerId,
    customerName: data.hostCustomerName,
    customerMobileNumber: data.mobileNumber,
    panNumber: data.panNumber,
    country: data.country,
    state: data.state,
    date: formatDate(data.date),
    hostCommissionEarned: data.hostCommissionEarned,
    tds: data.tds,
    platformFeeCollected: data.platformFeeCollected,
    gstOnPlatformFee: data.gstOnPlatformFee,
    netCommissionPaid: data.netCommissionPaid,
  }));

  const today = new Date().toISOString().split("T")[0];

  const handleFilterClick = () => {
    setIsFilterApplied(true);
    setSelectedFilterType(null);
    setPage(1);
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterApplied(false);
    setSelectedFilterType(null);
    setPage(1);
    refetch();
  };

  const handleFilterTypeClick = (filterType) => {
    if (selectedFilterType === filterType) {
      setSelectedFilterType(null);
    } else {
      setSelectedFilterType(filterType);
    }
    setIsFilterApplied(false);
    setStartDate("");
    setEndDate("");
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
        response = await exportTdsReport({
          fromDate: startDate,
          toDate: endDate,
        });
      } else if (selectedFilterType) {
        response = await exportTdsReport({
          filterType: selectedFilterType,
        });
      } else {
        response = await exportTdsReport();
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
    hasPermission(state, "TDS Report", "readAndWrite")
  );

  const isBlocked = useSelector((state) =>
    isModuleBlocked(state, "TDS Report")
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
          TDS Reports
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
              disabled={!!selectedFilterType}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: startDate, max: today }}
              disabled={!!selectedFilterType}
            />
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Button
              variant="contained"
              onClick={handleFilterClick}
              disabled={!startDate || !endDate || !!selectedFilterType}
            >
              Filter by Date
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              disabled={!isFilterApplied && !selectedFilterType}
            >
              Clear Filter
            </Button>
          </Box>
        </Box>

        <Box
          display="flex"
          gap={2}
          mt={4}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Typography>Quick Filters</Typography>
          {TDS_FILTER_TYPES.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              clickable
              color={
                selectedFilterType === filter.value ? "primary" : "default"
              }
              onClick={() => handleFilterTypeClick(filter.value)}
              variant={
                selectedFilterType === filter.value ? "filled" : "outlined"
              }
            />
          ))}
        </Box>
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
