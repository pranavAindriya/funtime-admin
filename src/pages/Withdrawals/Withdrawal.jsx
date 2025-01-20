import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Tab,
  TextField,
  Stack,
  useTheme,
  Pagination,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WithdrawalTabs from "./Tabs/WithdrawalTabs";
import {
  exportWitrhdrawalData,
  getWithdrawalHistory,
} from "../../service/allApi";
import formatDate from "../../utils/formatdate";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const Withdrawal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "pending";

  // Separate states for each status
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [approvedWithdrawals, setApprovedWithdrawals] = useState([]);
  const [rejectedWithdrawals, setRejectedWithdrawals] = useState([]);

  const [value, setValue] = useState(defaultTab);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [paginationDetails, setPaginationDetails] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Helper function to get the appropriate setState function based on status
  const getSetStateFunction = (status) => {
    switch (status) {
      case "pending":
        return setPendingWithdrawals;
      case "approved":
        return setApprovedWithdrawals;
      case "rejected":
        return setRejectedWithdrawals;
      default:
        return setPendingWithdrawals;
    }
  };

  // Helper function to get the appropriate state data based on status
  const getStateData = (status) => {
    switch (status) {
      case "pending":
        return pendingWithdrawals;
      case "approved":
        return approvedWithdrawals;
      case "rejected":
        return rejectedWithdrawals;
      default:
        return pendingWithdrawals;
    }
  };

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`);
    await fetchWithdrawalHistory(newValue);
  };

  const fetchWithdrawalHistory = async (status = value) => {
    setLoading(true);
    try {
      let queryParams = `status=${status}&page=${page}&limit=${limit}`;
      if (isFilterApplied && startDate && endDate) {
        queryParams += `&fromDate=${startDate}&toDate=${endDate}`;
      }
      const response = await getWithdrawalHistory(queryParams);
      if (response.status === 200) {
        const setStateFunction = getSetStateFunction(status);
        setStateFunction(response?.data?.data || []);
        setPaginationDetails({
          totalRecords: response?.data?.totalRecords,
          currentPage: response?.data?.currentPage,
          totalPages: response?.data?.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch withdrawal history:", error);
      const setStateFunction = getSetStateFunction(status);
      setStateFunction([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportWitrhdrawalData(
        value,
        isFilterApplied ? startDate : "",
        isFilterApplied ? endDate : ""
      );

      if (response.status === 200) {
        window.open(response?.data?.fileUrl, "_blank");
      } else {
        console.error("Failed to generate file:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      setIsFilterApplied(true);
      setPage(1);
      fetchWithdrawalHistory();
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterApplied(false);
    setPage(1);
    fetchWithdrawalHistory();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatrows = (data) => {
    return data?.map((item, ind) => ({
      slno: ind + 1,
      userId: item?.userId?._id,
      username: item?.userName,
      time: formatDate(item?.time),
      amount: item?.amount,
      status: item,
    }));
  };

  const tabs = [
    {
      label: "Pending",
      value: "pending",
      component: (
        <WithdrawalTabs
          type="pending"
          rows={formatrows(pendingWithdrawals)}
          data={pendingWithdrawals}
          setRows={setPendingWithdrawals}
        />
      ),
    },
    {
      label: "Approved",
      value: "approved",
      component: (
        <WithdrawalTabs
          type="approved"
          rows={formatrows(approvedWithdrawals)}
          data={approvedWithdrawals}
          setRows={setApprovedWithdrawals}
        />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <WithdrawalTabs
          type="rejected"
          rows={formatrows(rejectedWithdrawals)}
          data={rejectedWithdrawals}
          setRows={setRejectedWithdrawals}
        />
      ),
    },
  ];

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Withdrawal", "readAndWrite")
  );

  useEffect(() => {
    setValue(defaultTab);
    fetchWithdrawalHistory(defaultTab);
  }, [defaultTab, page, limit, isFilterApplied]);

  const isBlocked = useSelector((state) =>
    isModuleBlocked(state, "Withdrawal")
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
    <LoadingBackdrop open={loading}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" gap={2}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              size="small"
              onChange={(e) => handleDateChange(e, "start")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: endDate || undefined,
              }}
            />
            <TextField
              type="date"
              label="End Date"
              size="small"
              value={endDate}
              onChange={(e) => handleDateChange(e, "end")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate || undefined,
              }}
            />
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
            >
              Apply Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              disabled={!isFilterApplied}
            >
              Clear Filter
            </Button>
          </Box>
          {hasAccess && (
            <Button
              variant="contained"
              sx={{
                marginLeft: "auto",
              }}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
        </Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  disableRipple
                />
              ))}
            </TabList>
          </Box>
          {tabs.map((tab) => (
            <TabPanel keepMounted key={tab.value} value={tab.value}>
              {tab.component}
            </TabPanel>
          ))}
        </TabContext>
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
          }}
          onChange={handlePageChange}
        />
      </Box>
    </LoadingBackdrop>
  );
};

export default Withdrawal;
