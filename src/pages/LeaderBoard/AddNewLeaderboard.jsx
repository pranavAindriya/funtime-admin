import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CreateNewTopBar from "../../Components/CreateNewTopBar";
import InputField from "../../components/InputField";
import LabeldInputField from "../../Components/LabeldInputField";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import iconPlaceholder from "../../assets/Heart.svg";
import SelectField from "../../Components/SelectField";

const AddNewLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    name: "",
    icon: null,
    viewingOrder: "",
    status: false,
    criteria: "",
    numberOfList: "",
  });

  const [iconPreview, setIconPreview] = useState(""); // State to hold the image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaderboardData({
      ...leaderboardData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    setLeaderboardData({
      ...leaderboardData,
      status: isChecked,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLeaderboardData({
        ...leaderboardData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <CreateNewTopBar
        label={"Add New Leaderboard"}
        buttonStyles={{ width: "200px" }}
      />

      <Box
        sx={{
          display: "grid",
          gap: "30px",
        }}
      >
        <LabeldInputField
          label={"Name"}
          input={
            <InputField
              name="name"
              value={leaderboardData.name}
              onChange={handleChange}
            />
          }
        />
        <LabeldInputField
          label={"Icon"}
          input={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "200px",
              }}
            >
              <img
                src={iconPreview || leaderboardData.icon || iconPlaceholder}
                alt="Icon Preview"
                style={{
                  width: "50px",
                  height: "50px",
                  border: "rgba(0, 0, 0, 0.5) 1px solid",
                  borderRadius: "10px",
                }}
              />
              <input
                type="file"
                id="icon"
                onChange={handleIconChange}
                style={{ display: "none" }}
              />
              <label
                htmlFor="icon"
                style={{
                  backgroundColor: "#E5E5E5",
                  padding: "6px 20px",
                  width: "max-content",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                Change
              </label>
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                Upload PNG of resolution 100x100 and size below 1mb
              </span>
            </Box>
          }
        />
        <LabeldInputField
          label={"Viewing Order"}
          input={
            <InputField
              name="viewingOrder"
              value={leaderboardData.viewingOrder}
              onChange={handleChange}
            />
          }
        />
        <LabeldInputField
          label={"Status"}
          input={
            <Box sx={{ width: "130px" }}>
              <TableToggleSwitch
                checked={leaderboardData.status}
                onChange={handleStatusChange}
              />
            </Box>
          }
        />
        <LabeldInputField
          label={"Criteria"}
          input={
            <Box sx={{ width: "205px" }}>
              <SelectField
                name="criteria"
                value={leaderboardData.criteria}
                onChange={handleChange}
              />
            </Box>
          }
        />
        <LabeldInputField
          label={"Number of List"}
          input={
            <InputField
              name="numberOfList"
              value={leaderboardData.numberOfList}
              onChange={handleChange}
            />
          }
        />
      </Box>
    </div>
  );
};

export default AddNewLeaderboard;
