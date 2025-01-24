import React, { useEffect, useState } from "react";
import {
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Switch,
  FormGroup,
} from "@mui/material";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import TopAddNewBar from "../../components/TopAddNewBar";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import { getBannerById, createBannerList } from "../../service/allApi";
import { Slide, toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddNewBanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "text",
    text: "",
    link: "",
    image: null,
    status: false,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const { type, id } = useParams();

  const fetchDataById = async () => {
    try {
      const response = await getBannerById(id);
      if (response.status === 200) {
        const { data } = response;
        setIsEditing(true);

        if (data.type === "text") {
          setFormData({
            type: "text",
            text: data.content,
            link: data.link,
            image: null,
            status: data.status,
          });
        } else {
          setFormData({
            type: "image",
            text: "",
            link: data.link,
            image: null,
            status: data.status,
          });
          setImagePreview(data.content);
        }
      }
    } catch (error) {
      handleSnackbarOpen("Error fetching banner data", "error");
    }
  };

  useEffect(() => {
    if (id && type === "edit") {
      fetchDataById();
    }
  }, [type, id]);

  const handleTypeChange = (event) => {
    setFormData({
      ...formData,
      type: event.target.value,
      text: event.target.value === "image" ? "" : formData.text,
      image: event.target.value === "text" ? null : formData.image,
    });
    if (event.target.value === "text") {
      setImagePreview("");
    }
  };

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      text: event.target.value,
    });
  };

  const handleLinkChange = (event) => {
    setFormData({
      ...formData,
      link: event.target.value,
    });
  };

  const handleSnackbarOpen = (message, severity) => {
    if (severity === "success") {
      toast.success(message, {
        autoClose: 1000,
        transition: Slide,
      });
    } else {
      toast.error(message, {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  // const handleStatusChange = (event) => {
  //   setFormData({
  //     ...formData,
  //     status: event.target.checked,
  //   });
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      if (formData.type === "text" && !formData.text) {
        handleSnackbarOpen("Please enter banner text", "error");
        return;
      }
      if (formData.type === "image" && !formData.image && !imagePreview) {
        handleSnackbarOpen("Please upload an image", "error");
        return;
      }

      const submitData = new FormData();
      submitData.append("type", formData.type);
      submitData.append("link", formData.link || "");
      submitData.append("status", formData.status.toString());
      submitData.append("viewingOrder", 0);

      if (formData.type === "text") {
        submitData.append("content", formData.text);
      } else if (formData.image) {
        submitData.append("content", formData.image);
      }

      const response = await createBannerList(
        submitData,
        "multipart/form-data"
      );

      if (response.status === 201) {
        await queryClient.invalidateQueries({ queryKey: ["banner"] });
        handleSnackbarOpen("Banner created successfully", "success");
        navigate(-1);
      } else {
        handleSnackbarOpen("Failed to create banner", "error");
      }
    } catch (error) {
      handleSnackbarOpen("Error creating banner", "error");
    }
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Banner", "readAndWrite")
  );

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Banner"));

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
    <div>
      <TopAddNewBar
        label={
          <>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 1,
              }}
            >
              <ArrowLeft />
            </IconButton>
            <span>{isEditing ? "Edit Banner" : "Add New Banner"}</span>
          </>
        }
        hasAccess={hasAccess}
        disableAddNewButton={!hasAccess}
        onAddButtonClick={handleSubmit}
      />

      <Box>
        <FormControl component="fieldset" fullWidth>
          <Box display={"flex"} alignItems={"center"} gap={4}>
            <Typography
              component="label"
              sx={{
                mb: 1,
                display: "block",
                minWidth: { xs: "auto", md: 200 },
              }}
            >
              Type
            </Typography>
            <RadioGroup
              name="banner-type"
              value={formData.type}
              onChange={handleTypeChange}
              disabled={isEditing}
            >
              <FormControlLabel
                value="text"
                control={<Radio />}
                label="Text Only"
              />
              <FormControlLabel
                value="image"
                control={<Radio />}
                label="Image Only"
              />
            </RadioGroup>
          </Box>

          {formData.type === "text" && (
            <Box sx={{ my: 1, display: "flex", alignItems: "center" }} gap={4}>
              <Typography
                component="label"
                sx={{
                  mb: 1,
                  display: "block",
                  minWidth: { xs: "auto", md: 200 },
                }}
              >
                Text
              </Typography>
              <TextField
                fullWidth
                label="Text"
                value={formData.text}
                onChange={handleTextChange}
                margin="normal"
                multiline
                size="small"
              />
            </Box>
          )}

          {formData.type === "image" && (
            <Box sx={{ my: 2, display: "flex", alignItems: "center" }} gap={4}>
              <Typography
                component="label"
                sx={{
                  mb: 1,
                  display: "block",
                  minWidth: { xs: "auto", md: 200 },
                }}
              >
                Banner
              </Typography>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="banner-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="banner-image-upload">
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Upload
                </Button>
              </label>
            </Box>
          )}

          {imagePreview && (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Banner preview"
              style={{
                maxWidth: "200px",
                height: "auto",
                display: "block",
                marginInline: "auto",
                marginBottom: "30px",
                marginTop: "20px",
              }}
            />
          )}

          <Box sx={{ my: 1, display: "flex", alignItems: "center" }} gap={4}>
            <Typography
              component="label"
              sx={{
                mb: 1,
                display: "block",
                minWidth: { xs: "auto", md: 200 },
              }}
            >
              Link
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Link"
              value={formData.link}
              onChange={handleLinkChange}
            />
          </Box>

          {/* <Box sx={{ my: 1, display: "flex", alignItems: "center" }} gap={4}>
            <Typography
              component="label"
              sx={{
                mb: 1,
                display: "block",
                minWidth: { xs: "auto", md: 200 },
              }}
            >
              Status
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusChange}
                  />
                }
                label={formData.status ? "Active" : "Inactive"}
              />
            </FormGroup>
          </Box> */}
        </FormControl>
      </Box>
    </div>
  );
};

export default AddNewBanner;
