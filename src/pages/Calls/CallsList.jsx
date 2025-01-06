import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box, Button, Typography, Pagination } from "@mui/material";
import { getRecentCalls } from "../../service/allApi";
import formatDate from "../../utils/formatdate";
import DataTable from "../../components/DataTable";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const CallsList = () => {
  const [recentCalls, setRecentCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchCallHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getRecentCalls(page, 100);
      if (response.status === 200) {
        setRecentCalls(response.data.data);
        setFilteredCalls(response.data.data);
        setPaginationDetails(response.data.pagination);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, [page]);

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredData = recentCalls.filter((call) => {
      return (
        call?.caller?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        call?.host?.username?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    console.log(filteredData);

    setFilteredCalls(filteredData);
  };

  const handleDateFilter = () => {
    const filteredData = recentCalls.filter((call) => {
      const callTime = new Date(call?.time);
      return (
        (!fromDate || callTime >= new Date(fromDate)) &&
        (!toDate || callTime <= new Date(toDate))
      );
    });
    setFilteredCalls(filteredData);
  };

  const formattedRecentCalls = () => {
    return filteredCalls?.map((call, ind) => ({
      id: ind + 1,
      caller: call?.caller?.username,
      callerId: call?.caller?.userId,
      host: call?.host?.username,
      hostId: call?.host?.userId,
      time: formatDate(call?.time),
      duration: call?.duration,
      coinDeducted: call?.coinDeducted,
      diamond: call?.heartsTransferred,
    }));
  };

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

  const rows = formattedRecentCalls();

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
          onChange={(e) => setSearchTerm(e.target.value)}
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

        <Button variant="contained" onClick={handleDateFilter} size="small">
          Filter by Date
        </Button>
      </Box>
      <Pagination
        count={paginationDetails?.totalPages}
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
        onChange={(e, page) => setPage(page)}
      />
      <DataTable columns={columns} rows={rows} />
      <Pagination
        count={paginationDetails?.totalPages}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          mt: 4,
        }}
        onChange={(e, page) => setPage(page)}
      />
    </LoadingBackdrop>
  );
};

export default CallsList;
