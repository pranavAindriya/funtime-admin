import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TextField, Box, Button, Typography, Pagination } from "@mui/material";
import { getRecentCalls } from "../../service/allApi";
import formatDate from "../../utils/formatdate";
import DataTable from "../../components/DataTable";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useSelector } from "react-redux";
import { isModuleBlocked } from "../../redux/slices/authSlice";

const CallsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]); // New state for filtered results

  const {
    data: callData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "recentCalls",
      page,
      limit,
      isDateFilterApplied ? fromDate : "",
      isDateFilterApplied ? toDate : "",
    ],
    queryFn: () =>
      getRecentCalls(
        page,
        limit,
        isDateFilterApplied ? fromDate : "",
        isDateFilterApplied ? toDate : ""
      ),
    keepPreviousData: true,
  });

  // Format data for the table
  const formattedRecentCalls = () => {
    return (
      callData?.data?.data?.map((call, ind) => ({
        id: ind + 1,
        caller: call?.caller?.username,
        callerId: call?.caller?.userId,
        host: call?.host?.username,
        hostId: call?.host?.userId,
        time: formatDate(call?.time),
        duration: call?.duration,
        coinDeducted: call?.coinDeducted,
        diamond: call?.heartsTransferred,
      })) || []
    );
  };

  // Update filtered rows whenever the data changes
  useEffect(() => {
    setFilteredRows(formattedRecentCalls());
  }, [callData]);

  // Handle search (frontend filtering)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRows(formattedRecentCalls());
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = formattedRecentCalls().filter((row) => {
      return (
        (row.caller?.toLowerCase() || "").includes(lowerCaseSearchTerm) ||
        (row.host?.toLowerCase() || "").includes(lowerCaseSearchTerm)
      );
    });
    setFilteredRows(filtered);
  };

  // Handle date filter
  const handleDateFilter = () => {
    setIsDateFilterApplied(true);
    setPage(1);
    refetch();
  };

  // Handle reset filter
  const handleResetFilter = () => {
    setIsDateFilterApplied(false);
    setFromDate("");
    setToDate("");
    setPage(1);
    setSearchTerm("");
    setFilteredRows(formattedRecentCalls());
    refetch();
  };

  // Handle pagination change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Table columns
  const columns = [
    { field: "caller", headerName: "Caller", flex: 1 },
    { field: "callerId", headerName: "Caller ID", flex: 1 },
    { field: "host", headerName: "Host", flex: 1 },
    { field: "hostId", headerName: "Host ID", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "coinDeducted", headerName: "Coin Reduced", flex: 1 },
    { field: "diamond", headerName: "Diamond", flex: 1 },
  ];

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Calls"));

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
    <LoadingBackdrop open={isLoading}>
      <Typography fontSize={22} fontWeight={600} mb={3}>
        Recent Calls List
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <TextField
          label="Search by Username"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value.trim()) {
              setFilteredRows(formattedRecentCalls());
            }
          }}
          size="small"
        />
        <Button variant="contained" onClick={handleSearch} size="small">
          Search
        </Button>
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          size="small"
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleDateFilter}
          size="small"
          disabled={!fromDate || !toDate}
        >
          Filter by Date
        </Button>
        <Button
          variant="outlined"
          onClick={handleResetFilter}
          size="small"
          color="primary"
          disabled={!isDateFilterApplied}
        >
          Reset Filter
        </Button>
      </Box>
      <Pagination
        count={callData?.data?.pagination?.totalPages || 1}
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
      <DataTable columns={columns} rows={filteredRows} />
      <Pagination
        count={callData?.data?.pagination?.totalPages || 1}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          mt: 4,
        }}
        onChange={handlePageChange}
      />
    </LoadingBackdrop>
  );
};

export default CallsList;
