import React, { useRef, useState } from "react";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

const AddNewNotification = () => {
  const [image, setImage] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  const inputRef = useRef(null);

  const handleAddNewNotification = () => {
    return;
  };

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setNotificationData((prevdata) => ({ ...prevdata, [name]: value }));
  };

  console.log(notificationData);

  return (
    <Box display={"grid"} gap={4}>
      <CreateNewTopBar
        label={"Back"}
        onAddButtonClick={handleAddNewNotification}
        disableAddButton={
          notificationData.description === "" || notificationData.title === ""
        }
        onBackButtonClick={() => navigate("/notifications")}
      />

      <Box display={"flex"} flexWrap={"wrap"} gap={2}>
        <Typography minWidth={"200px"}>Title</Typography>
        <TextField
          value={notificationData.title}
          size="small"
          onChange={handleInputFieldChange}
          name="title"
        />
      </Box>

      <Box display={"flex"} flexWrap={"wrap"} gap={2}>
        <Typography minWidth={"200px"}>Image</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current.click()}
        >
          upload
        </Button>
      </Box>

      <input type="file" ref={inputRef} style={{ display: "none" }} />

      <Box display={"flex"} flexWrap={"wrap"} gap={2}>
        <Typography minWidth={"200px"}>Description</Typography>
        <TextField
          value={notificationData.description}
          multiline
          minRows={10}
          sx={{
            flexGrow: 1,
          }}
          onChange={handleInputFieldChange}
          name="description"
        />
      </Box>
    </Box>
  );
};

export default AddNewNotification;
