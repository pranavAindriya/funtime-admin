import React from "react";
import TopAddNewBar from "../../components/TopAddNewBar";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TopAddNewBar
        label={"Add New Category"}
        onAddButtonClick={() => navigate("/leaderboard/add")}
      />
    </div>
  );
};

export default Leaderboard;
