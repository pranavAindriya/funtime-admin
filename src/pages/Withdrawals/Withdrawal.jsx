import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, TextField, Stack, useTheme } from "@mui/material";
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`);
  };

  const fetchWithdrawalHistory = async () => {
    try {
      let queryParams = `status=${value}`;
      if (startDate) {
        queryParams += `&startDate=${startDate}`;
      }
      if (endDate) {
        queryParams += `&endDate=${endDate}`;
      }

      const response = await getWithdrawalHistory(queryParams);
      if (response.status === 200) {
        setWithdrawaldatas(response?.data?.data || []);
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

  const formatrows = () => {
    return withdrawalDatas?.map((item, ind) => ({
      slno: ind + 1,
      userId: item?.userId,
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
  }, [defaultTab, startDate, endDate]);

  return (
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
          <TabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Withdrawal;
