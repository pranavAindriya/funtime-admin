import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import ProfileImagePlaceholder from "../../assets/ProfileImagePlaceholder.png";
import {
  createUser,
  editUser,
  getUserById,
  requestOtp,
  verifyOtp,
} from "../../service/allApi";
import { useSelector } from "react-redux";
import { hasPermission } from "../../redux/slices/authSlice";

const AddNewUser = () => {
  const [iconPreview, setIconPreview] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userId, setUserId] = useState(null);

  const { type, id } = useParams();
  const navigate = useNavigate();

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    phoneNumber:
      type === "edit"
        ? Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        : Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    dob: Yup.date()
      .required("Date of birth is required")
      .nullable()
      .max(new Date(), "Date of birth cannot be in the future"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["Man", "Woman", "Other"], "Invalid gender"),
    email: Yup.string()
      .required("Email address is required")
      .email("Invalid email address"),
    coins: Yup.number().optional().integer("Coins must be an integer").min(0),
  });

  const fetchUserDetails = async () => {
    try {
      const response = await getUserById(id);

      if (response.status === 200) {
        const userDetails = response?.data;

        formik.setValues({
          username: userDetails.username || "",
          phoneNumber: userDetails.mobileNumber || "",
          dob: userDetails.profile?.dateOfBirth
            ? new Date(userDetails.profile.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          gender: userDetails.profile?.gender || "",
          coins: userDetails.profile?.coin?.toString() || "",
          email: userDetails.profile?.email || "",
        });

        if (userDetails.profile?.image) {
          setIconPreview(userDetails.profile?.image);
        }
      }
    } catch (error) {
      handleError("Failed to fetch user details");
    }
  };

  useEffect(() => {
    if (type === "edit" || type === "view") {
      fetchUserDetails();
    }
  }, [type]);

  const handleRequestOTP = async () => {
    try {
      const response = await requestOtp({
        mobileNumber: formik.values.phoneNumber,
      });
      if (response.status === 200) {
        setOtpSent(true);
        handleSuccess("OTP sent successfully!");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyOtp({
        mobileNumber: formik.values.phoneNumber,
        otp: otp,
      });

      if (response.status === 200) {
        setUserId(response.data.user._id);
        handleSuccess("OTP Verified Successfully!");
        setOtpSent(false);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "OTP Verification Failed");
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("icon", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("username", values.username);
      formData.append("dateOfBirth", values.dob);
      if (type !== "edit") {
        formData.append("language", "English");
      }
      formData.append("userDescription", "");
      formData.append("gender", values.gender);
      formData.append("email", values.email);
      formData.append("coin", values.coins);

      if (values.icon) {
        formData.append("image", values.icon);
      }

      let response;
      if (type === "edit") {
        response = await editUser(id, formData);
      } else {
        response = await createUser(formData, userId);
      }

      if (response.status === 200) {
        handleSuccess("User Created Successfully!");
        navigate("/users");
      }
    } catch (error) {
      handleError(error.response?.data?.message || "User Creation Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (text) => {
    setMessage({ text, severity: "success" });
    setOpenSnackbar(true);
  };

  const handleError = (text) => {
    setMessage({ text, severity: "error" });
    setOpenSnackbar(true);
  };

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      username: "",
      phoneNumber: "",
      dob: "",
      gender: "",
      email: "",
      coins: "",
      icon: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateUser,
  });

  console.log(formik.errors);

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
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {type === "edit" ? "Edit User" : "Add New User"}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate("/users")}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {type === "edit" ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 3 }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          gap={4}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <TextField
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={type === "view"}
            sx={{ flexGrow: 1 }}
          />

          <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              disabled={type === "view" || type === "edit" || otpSent}
              slotProps={{
                input: {
                  endAdornment: (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 10,
                      }}
                    >
                      {!type && !otpSent && !userId && (
                        <Button
                          variant="text"
                          onClick={handleRequestOTP}
                          disabled={!formik.values.phoneNumber}
                          size="small"
                        >
                          Request OTP
                        </Button>
                      )}
                      {otpSent && (
                        <TextField
                          label="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          sx={{ width: "150px" }}
                          size="small"
                        />
                      )}
                      {otpSent && (
                        <Button variant="text" onClick={handleVerifyOTP}>
                          Verify OTP
                        </Button>
                      )}
                    </Box>
                  ),
                },
              }}
            />
          </Box>
        </Box>

        <Box
          display={"flex"}
          gap={4}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <TextField
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.dob}
            onChange={formik.handleChange}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
            disabled={type === "view"}
          />

          <TextField
            fullWidth
            name="coins"
            label="Coins"
            type="number"
            value={formik.values.coins}
            onChange={formik.handleChange}
            error={formik.touched.coins && Boolean(formik.errors.coins)}
            helperText={formik.touched.coins && formik.errors.coins}
            disabled={type === "view"}
          />
        </Box>

        <Box
          display={"flex"}
          gap={4}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <TextField
            fullWidth
            select
            name="gender"
            label="Gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
            disabled={type === "view"}
          >
            {["Man", "Woman", "Other"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={type === "view" || type === "edit"}
          />
        </Box>

        <Box
          display={"flex"}
          gap={7}
          alignItems={"flex-start"}
          justifyContent={"space-evenly"}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexGrow: { xs: 1, md: 0.5 },
            }}
          >
            <Avatar
              src={iconPreview || ProfileImagePlaceholder}
              sx={{ width: 200, height: 200 }}
            />
            {type !== "view" && (
              <>
                <input
                  accept="image/*"
                  type="file"
                  id="icon-upload"
                  style={{ display: "none" }}
                  onChange={handleIconChange}
                />
                <label htmlFor="icon-upload">
                  <Button variant="outlined" component="span">
                    Change Icon
                  </Button>
                </label>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddNewUser;
