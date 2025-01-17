import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../service/allApi";
import DataTable from "../../components/DataTable";
import { Typography } from "@mui/material";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const navigate = useNavigate();

  const fetchLeaderboardData = async () => {
    const response = await getLeaderboard();
    if (response.status === 200) {
      setLeaderboardData(response.data.data);
    }
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

  return (
    <div>
      <Typography fontSize={21} fontWeight={600} mb={2}>
        Leaderboard
      </Typography>
      <DataTable columns={columns} rows={formattedRows} />
    </div>
  );
};

export default Leaderboard;
