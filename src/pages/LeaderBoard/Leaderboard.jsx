import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../service/allApi";
import DataTable from "../../components/DataTable";
import { Box, Typography } from "@mui/material";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { isModuleBlocked } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    const response = await getLeaderboard();
    if (response.status === 200) {
      setLeaderboardData(response.data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const columns = [
    { field: "rank", headerName: "Rank" },
    { field: "username", headerName: "Username" },
    { field: "diamonds", headerName: "Diamonds" },
  ];

  const formatedLeaderboard = () => {
    return leaderboardData?.map((user) => ({
      userId: user?._id,
      rank: user?.rank,
      username: user?.username,
      diamonds: user?.heartBalance,
    }));
  };

  const formattedRows = formatedLeaderboard();

  const isBlocked = useSelector((state) =>
    isModuleBlocked(state, "Leaderboard")
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
    <LoadingBackdrop open={isLoading}>
      <Typography fontSize={21} fontWeight={600} mb={2}>
        Leaderboard
      </Typography>
      <DataTable columns={columns} rows={formattedRows} />
    </LoadingBackdrop>
  );
};

export default Leaderboard;
