import React, { useEffect, useState } from "react";
import LabeldInputField from "../../Components/LabeldInputField";
import { Box, Input, TextField, Typography } from "@mui/material";
import TopAddNewBar from "../../components/TopAddNewBar";
import CreateNewTopBar from "../../Components/CreateNewTopBar";
import { createPrivacyPolicy, getPolicyById } from "../../service/allApi";
import { useNavigate, useParams } from "react-router-dom";

const CMSAddNew = () => {
  const [privacyData, setPrivacyData] = useState({
    title: "",
    content: "",
  });

  const { type, id } = useParams();

  const navigate = useNavigate();

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setPrivacyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNewPrivacyPolicy = async () => {
    const repsonse = await createPrivacyPolicy(privacyData);
    console.log(repsonse);
    if (repsonse.status === 201) {
      navigate("/cms");
    }
  };

  const fetchPolicyById = async () => {
    const response = await getPolicyById(id);
    console.log(response);
  };

  useEffect(() => {
    if (type === "edit") {
      fetchPolicyById();
    }
  }, [type, id]);

  return (
    <Box display={"grid"} gap={4}>
      <CreateNewTopBar
        label={"Back"}
        onAddButtonClick={handleCreateNewPrivacyPolicy}
        disableAddButton={(privacyData.content && privacyData.title) === ""}
        onBackButtonClick={() => navigate("/cms")}
      />

      <Box display={"flex"} flexWrap={"wrap"} gap={2}>
        <Typography minWidth={"200px"}>Policy</Typography>
        <TextField
          size="small"
          onChange={handleInputFieldChange}
          name="title"
        />
      </Box>

      <Box display={"flex"} flexWrap={"wrap"} gap={2}>
        <Typography minWidth={"200px"}>Description</Typography>
        <TextField
          multiline
          minRows={10}
          fullWidth
          onChange={handleInputFieldChange}
          name="content"
        />
      </Box>
    </Box>
  );
};

export default CMSAddNew;
