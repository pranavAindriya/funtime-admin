import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Coins,
  CurrencyInr,
  ArrowCircleDown,
  ArrowLeft,
} from "@phosphor-icons/react";
import DashboardCards from "../../../components/DashboardCards";
import {
  getCallHistory,
  getProfileDataById,
  getTransactionHistory,
} from "../../../service/allApi";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../../components/DataTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container maxWidth={"md"} sx={{ py: 3 }}>
          {children}
        </Container>
      )}
    </div>
  );
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function UserOverview() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [callHistory, setCallHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const [profileData, setProfileData] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const totalRecharge = transactionHistory.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalCoins = transactionHistory.reduce(
    (sum, transaction) => sum + transaction.coins,
    0
  );
  const totalDiamondsSpent = callHistory.reduce(
    (sum, call) => sum + call.heartsTransferred,
    0
  );

  const processedCallHistory = callHistory?.map((call, index) => ({
    slno: index + 1,
    date: formatDate(call.createdAt),
    time: formatTime(call.createdAt),
    userId: call.fromUserId.username,
    userName: call.fromUserId.username,
    duration: `${call.callDurationMinutes} min`,
    diamondsEarned: call.heartsTransferred,
  }));

  const processedTransactionHistory = transactionHistory?.map(
    (transaction, index) => ({
      slno: index + 1,
      date: formatDate(transaction.createdAt),
      time: formatTime(transaction.createdAt),
      transactionId: transaction._id,
      rechargeAmount: `₹${transaction.amount}`,
      balanceCoins: transaction.coins,
    })
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const [profileResponse, callResponse, transactionResponse] =
            await Promise.all([
              getProfileDataById(id),
              getCallHistory(id, 1, 50),
              getTransactionHistory(id, 1, 50),
            ]);

          if (profileResponse.status === 200)
            setProfileData(profileResponse.data);
          if (callResponse.status === 200) setCallHistory(callResponse.data);
          if (transactionResponse.status === 200)
            setTransactionHistory(transactionResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  const callHistoryColumns = [
    { field: "slno", headerName: "SlNo" },
    { field: "date", headerName: "Date" },
    { field: "time", headerName: "Time" },
    { field: "userId", headerName: "User ID" },
    { field: "userName", headerName: "User Name" },
    { field: "duration", headerName: "Duration" },
    { field: "diamondsEarned", headerName: "Diamonds Earned" },
  ];

  const rechargeHistoryColumns = [
    { field: "slno", headerName: "SlNo" },
    { field: "date", headerName: "Date" },
    { field: "time", headerName: "Time" },
    { field: "transactionId", headerName: "Transaction ID" },
    { field: "rechargeAmount", headerName: "Recharge Amount" },
    { field: "balanceCoins", headerName: "Balance Coins" },
  ];

  const withdrawalHistoryColumns = [
    { field: "slno", headerName: "SlNo" },
    { field: "date", headerName: "Date" },
    { field: "time", headerName: "Time" },
    { field: "transactionId", headerName: "Transaction ID" },
    { field: "amount", headerName: "Amount" },
    { field: "diamondsDeducted", headerName: "Diamonds Deducted" },
    { field: "status", headerName: "Status" },
  ];

  return (
    <Box>
      <IconButton sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        <ArrowLeft color="black" />
      </IconButton>
      {/* User Profile Section */}
      <Box>
        <Typography variant="h6" fontWeight={600}>
          User Profile
        </Typography>
        <Box sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={profileData?.userProfile?.image}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.5, color: "text.primary" }}
              >
                User Name : {profileData?.userName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                User Id : {profileData?.userId}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Gender : {profileData?.userProfile?.gender}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Host : {profileData?.hosting ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since ...
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Overview Section */}
        <Typography variant="h6" fontWeight={600}>
          Quick Overview
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            mb: 4,
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          <DashboardCards
            label={"Total Recharges"}
            amount={totalRecharge}
            renderIcon={
              <IconButton
                color="error"
                size="large"
                sx={{ backgroundColor: "#FCEAFA", my: 1 }}
              >
                <CurrencyInr />
              </IconButton>
            }
          />
          <DashboardCards
            label={"Total Coins"}
            amount={totalCoins}
            renderIcon={
              <IconButton
                color="error"
                size="large"
                sx={{ backgroundColor: "#FCEAFA", my: 1 }}
              >
                <Coins />
              </IconButton>
            }
          />
          <DashboardCards
            label={"Total Withdrawal"}
            amount={0}
            renderIcon={
              <IconButton
                color="error"
                size="large"
                sx={{ backgroundColor: "#FCEAFA", my: 1 }}
              >
                <ArrowCircleDown />
              </IconButton>
            }
          />
        </Box>

        {/* History Tabs Section */}
        <Box sx={{ width: "100%" }}>
          <Tabs
            component={Container}
            maxWidth={"sm"}
            value={tabValue}
            onChange={handleTabChange}
            aria-label="history tabs"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.light",
                },
                display: "flex",
                alignItems: "center",
                mx: "auto",
              },
            }}
          >
            <Tab label="Recharge History" />
            <Tab label="Call History" />
            {/* <Tab label="Withdrawal History" /> */}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <DataTable
              columns={rechargeHistoryColumns}
              rows={processedTransactionHistory}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DataTable
              columns={callHistoryColumns}
              rows={processedCallHistory}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DataTable columns={withdrawalHistoryColumns} />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
