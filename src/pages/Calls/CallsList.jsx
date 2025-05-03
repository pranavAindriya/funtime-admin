import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  Box,
  Button,
  Typography,
  Pagination,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { getRecentCalls } from "../../service/allApi";
import formatDate from "../../utils/formatdate";
import DataTable from "../../components/DataTable";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useSelector } from "react-redux";
import { isModuleBlocked } from "../../redux/slices/authSlice";
import { X } from "@phosphor-icons/react"; // Import X icon or use appropriate icon

const CallsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeFromDate, setActiveFromDate] = useState("");
  const [activeToDate, setActiveToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);

  // Define query keys
  const callsQueryKeys = {
    all: ["recentCalls"],
    list: (page, limit) => [...callsQueryKeys.all, { page, limit }],
    search: (username, page, limit) => [
      ...callsQueryKeys.all,
      "search",
      { username, page, limit },
    ],
    dateFilter: (fromDate, toDate, page, limit) => [
      ...callsQueryKeys.all,
      "dateFilter",
      { fromDate, toDate, page, limit },
    ],
    searchWithDate: (username, fromDate, toDate, page, limit) => [
      ...callsQueryKeys.all,
      "searchWithDate",
      { username, fromDate, toDate, page, limit },
    ],
  };

  // Determine the appropriate query key based on active filters
  const getQueryKey = () => {
    if (isSearching && isDateFilterApplied) {
      return callsQueryKeys.searchWithDate(
        activeSearchTerm,
        activeFromDate,
        activeToDate,
        page,
        limit
      );
    } else if (isSearching) {
      return callsQueryKeys.search(activeSearchTerm, page, limit);
    } else if (isDateFilterApplied) {
      return callsQueryKeys.dateFilter(
        activeFromDate,
        activeToDate,
        page,
        limit
      );
    } else {
      return callsQueryKeys.list(page, limit);
    }
  };

  const {
    data: callData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: getQueryKey(),
    queryFn: () =>
      getRecentCalls(
        page,
        limit,
        isDateFilterApplied ? activeFromDate : "",
        isDateFilterApplied ? activeToDate : "",
        isSearching ? activeSearchTerm : ""
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
        hostWalletBalance: call?.hostWalletBalance || 0,
        userWalletBalance: call?.userWalletBalance || 0,
      })) || []
    );
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setActiveSearchTerm(searchTerm.trim());
      setPage(1);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsSearching(false);
    setPage(1);
  };

  // Handle search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSearch();
    }
  };

  // Handle date filter
  const handleDateFilter = () => {
    if (fromDate && toDate) {
      setActiveFromDate(fromDate);
      setActiveToDate(toDate);
      setIsDateFilterApplied(true);
      setPage(1);
    }
  };

  // Handle reset filter
  const handleResetFilter = () => {
    if (isDateFilterApplied) {
      setIsDateFilterApplied(false);
      setFromDate("");
      setToDate("");
      setActiveFromDate("");
      setActiveToDate("");
    }

    if (isSearching) {
      handleClearSearch();
    }

    setPage(1);
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
    { field: "hostWalletBalance", headerName: "Host Wallet Balance", flex: 1 },
    { field: "userWalletBalance", headerName: "User Wallet Balance", flex: 1 },
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
    <LoadingBackdrop open={isLoading || isFetching}>
      <Typography fontSize={22} fontWeight={600} mb={3}>
        Recent Calls List
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 3,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: { xs: "center", lg: "flex-start" },
        }}
      >
        <TextField
          label="Search by Username"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <X />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
        >
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
          disabled={!isDateFilterApplied && !isSearching}
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
      <DataTable columns={columns} rows={formattedRecentCalls()} />
      {formattedRecentCalls()?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
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
