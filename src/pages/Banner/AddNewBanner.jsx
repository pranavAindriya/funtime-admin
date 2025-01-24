import React, { useState } from "react";
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
  Paper,
  Container,
} from "@mui/material";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import TopAddNewBar from "../../components/TopAddNewBar";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";

const AddNewBanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "text",
    text: "",
    link: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

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
            <span>Add New Banner</span>
          </>
        }
        hasAccess={hasAccess}
        disableAddNewButton={!hasAccess}
      />

      <Box>
        <FormControl component="fieldset" fullWidth>
          <Box display={"flex"} alignItems={"center"}>
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
            <Box sx={{ my: 1, display: "flex", alignItems: "center" }}>
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
            <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
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

          <Box sx={{ my: 1, display: "flex", alignItems: "center" }}>
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
        </FormControl>
      </Box>
    </div>
  );
};

export default AddNewBanner;
