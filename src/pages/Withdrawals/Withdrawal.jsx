import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Tab,
  TextField,
  Stack,
  useTheme,
  Pagination,
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
import { hasPermission } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop"; // Import the LoadingBackdrop component

const Withdrawal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "pending";

  const [value, setValue] = useState(defaultTab);
  const [withdrawalDatas, setWithdrawaldatas] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [paginationDetails, setPaginationDetails] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Track if filter is applied

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`);
    setLoading(true); // Show loading when changing tabs
    await fetchWithdrawalHistory();
    setLoading(false); // Hide loading after fetching data
  };

  const fetchWithdrawalHistory = async () => {
    try {
      let queryParams = `status=${value}&page=${page}&limit=${limit}`;
      if (isFilterApplied && startDate && endDate) {
        queryParams += `&fromDate=${startDate}&toDate=${endDate}`;
      }

      const response = await getWithdrawalHistory(queryParams);
      if (response.status === 200) {
        setWithdrawaldatas(response?.data?.data || []);
        setPaginationDetails({
          totalRecords: response?.data?.totalRecords,
          currentPage: response?.data?.currentPage,
          totalPages: response?.data?.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch withdrawal history:", error);
      setWithdrawaldatas([]);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportWitrhdrawalData(value);
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
      setPage(1); // Reset to the first page when applying a new filter
      fetchWithdrawalHistory();
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterApplied(false);
    setPage(1); // Reset to the first page when clearing the filter
    fetchWithdrawalHistory();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatrows = () => {
    return withdrawalDatas?.map((item, ind) => ({
      slno: ind + 1,
      userId: item?.userId?._id,
      username: item?.userName,
      time: formatDate(item?.time),
      amount: item?.amount,
      status: item,
    }));
  };

  const rows = formatrows();

  const tabs = [
    {
      label: "Pending",
      value: "pending",
      component: (
        <WithdrawalTabs
          type={"pending"}
          rows={rows}
          data={withdrawalDatas}
          setRows={setWithdrawaldatas}
        />
      ),
    },
    {
      label: "Approved",
      value: "approved",
      component: (
        <WithdrawalTabs
          type={"approved"}
          rows={rows}
          data={withdrawalDatas}
          setRows={setWithdrawaldatas}
        />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <WithdrawalTabs
          type={"rejected"}
          rows={rows}
          data={withdrawalDatas}
          setRows={setWithdrawaldatas}
        />
      ),
    },
  ];

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Withdrawal", "readAndWrite")
  );

  useEffect(() => {
    setValue(defaultTab);
    fetchWithdrawalHistory();
  }, [defaultTab, page, limit, isFilterApplied]);

  return (
    <LoadingBackdrop open={loading}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Box display={"flex"} gap={2}>
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
