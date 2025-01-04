import React, { useEffect, useRef, useState } from "react";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import {
  addNewNotification,
  getNotificationById,
  updateNotification,
} from "../../service/allApi";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { hasPermission } from "../../redux/slices/authSlice";

const AddNewNotification = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
  });

  const { type, id } = useParams();

  const fetchNotificationById = async () => {
    const response = await getNotificationById(id);
    if (response.status === 200) {
      setNotificationData({
        description: response.data.data.description,
        title: response.data.data.title,
      });
    }
    console.log(response);
  };

  useEffect(() => {
    if (type && id) {
      fetchNotificationById();
    }
  }, [type, id]);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleAddNewNotification = async () => {
    try {
      const formData = new FormData();
      formData.append("title", notificationData.title);
      formData.append("description", notificationData.description);
      formData.append("image", image);

      if (type === "edit") {
        const response = await updateNotification(id, {
          title: notificationData.title,
          description: notificationData.description,
        });
        if (response.status === 200) {
          toast.success("Notification added successfully!", {
            position: "top-center",
            autoClose: 2000,
            transition: Slide,
          });
        }
      } else {
        const response = await addNewNotification(formData);
        if (response.status === 200) {
          toast.success("Notification added successfully!", {
            position: "top-center",
            autoClose: 2000,
            transition: Slide,
          });
        }
      }
      navigate("/notifications");
    } catch (error) {
      toast.error("Failed to add notification. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        transition: Slide,
      });
      console.error("Error adding new notification:", error);
    }
  };

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setNotificationData((prevdata) => ({ ...prevdata, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Notifications", "readAndWrite")
  );

  if (!hasAccess) {
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
    <Box display={"grid"} gap={4}>
      <ToastContainer />
      <CreateNewTopBar
        label={"Back"}
        onAddButtonClick={handleAddNewNotification}
        disableAddButton={
          notificationData.description === "" ||
          notificationData.title === "" ||
          (!image && type !== "edit")
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

      {type !== "edit" && (
        <Box display={"flex"} flexWrap={"wrap"} gap={2}>
          <Typography minWidth={"200px"}>Image</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => inputRef.current.click()}
          >
            Upload
          </Button>
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>
      )}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Notification Preview"
          style={{ width: 300, marginInline: "auto" }}
        />
      )}

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
