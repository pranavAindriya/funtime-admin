import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import ProfileImagePlaceholder from "../../assets/ProfileImagePlaceholder.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createUser, requestOtp, verifyOtp } from "../../service/allApi";

const AddNewUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    userId: "",
    phoneNumber: "",
    dob: "",
    location: "",
    gender: "",
    icon: null,
    coins: "",
    kyc: "",
    email: "",
  });
  const [iconPreview, setIconPreview] = useState("");
  const [validationError, setValidationError] = useState();
  const [loading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({
        ...userData,
        icon: file,
      });
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRequestOTP = async () => {
    try {
      const response = await requestOtp({ mobileNumber: userData.phoneNumber });
      if (response.status === 200) {
        setOtpSent(true);
        setMessage({ text: "OTP sent successfully!", severity: "success" });
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to send OTP",
        severity: "error",
      });
      setOpenSnackbar(true);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyOtp({
        mobileNumber: userData.phoneNumber,
        otp: otp,
      });
      console.log(response);
      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          userId: response.data.user._id,
        }));
        setMessage({ text: "OTP Verified Successfully!", severity: "success" });
        setOpenSnackbar(true);
        setOtpSent(false);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "OTP Verification Failed",
        severity: "error",
      });
      setOpenSnackbar(true);
    }
  };

  const handleCreateUser = async () => {
    if (!userData.userId) {
      setMessage({
        text: "User Creation Failed, No user id found",
        severity: "error",
      });
      setOpenSnackbar(true);
    }
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("username", userData.username);
      formData.append("dateOfBirth", userData.dob);
      formData.append("language", "English");
      formData.append("place", userData.location);
      formData.append("userDescription", "");
      formData.append("gender", userData.gender);
      formData.append("email", userData.email);
      if (userData.icon) {
        formData.append("avatar", userData.icon);
      }

      const response = await createUser(formData, userData.userId);

      if (response.status === 200) {
        setMessage({ text: "User Created Successfully!", severity: "success" });
        setOpenSnackbar(true);
        navigate("/users");
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "User Creation Failed",
        severity: "error",
      });
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(userData.userId);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <CreateNewTopBar
        label={"Add New User"}
        onBackButtonClick={() => navigate("/users")}
        onAddButtonClick={handleCreateUser}
      />

      <Box
        sx={{
          display: "grid",
          gap: "45px",
          width: "95%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "650px",
            }}
          >
            <span>User name</span>
            <Box sx={{ width: "500px" }}>
              <InputField
                name="username"
                value={userData.username}
                onChange={handleChange}
                placeholder={"Enter Username"}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "450px",
            }}
          >
            <span>Phone Number</span>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <InputField
                name="phoneNumber"
                fullWidth
                value={userData.phoneNumber}
                onChange={handleChange}
                placeholder={"Enter 10 digit Phone Number"}
                error={validationError}
                setError={setValidationError}
                sx={{ width: "300px" }}
              />
              {!otpSent ? (
                <Button onClick={handleRequestOTP} variant="outlined">
                  OTP
                </Button>
              ) : (
                <InputField
                  name="otp"
                  error={validationError}
                  setError={setValidationError}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  sx={{ width: "150px" }}
                />
              )}
              {otpSent && (
                <Button onClick={handleVerifyOTP} variant="contained">
                  Verify
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "30px",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>DOB</span>
            <Box sx={{ width: "200px" }}>
              <InputField
                name="dob"
                value={userData.dob}
                onChange={handleChange}
                type={"date"}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>Location</span>
            <Box sx={{ width: "200px" }}>
              <InputField
                name="location"
                value={userData.location}
                onChange={handleChange}
                placeholder={"Enter location"}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>Gender</span>
            <Box sx={{ width: "200px" }}>
              <SelectField
                options={[
                  {
                    value: "Male",
                    name: "Male",
                  },
                  {
                    value: "Female",
                    name: "Female",
                  },
                  { value: "Other", name: "Other" },
                ]}
                name="gender"
                value={userData.gender}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>Icon</span>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "200px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img
                src={iconPreview || ProfileImagePlaceholder}
                alt="Icon Preview"
                style={{
                  width: "190px",
                  height: "190px",
                  border: "rgba(0, 0, 0, 0.5) 1px solid",
                  borderRadius: "50%",
                }}
              />
              <input
                type="file"
                id="icon"
                style={{ display: "none" }}
                onChange={handleIconChange}
              />
              <label
                htmlFor="icon"
                style={{
                  backgroundColor: "#E5E5E5",
                  padding: "6px 20px",
                  width: "max-content",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Change
              </label>
              <span
                style={{
                  fontSize: "12px",
                }}
              >
                Upload PNG of resolution 100x100 and size below 1mb
              </span>
            </Box>
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>Coins</span>
            <Box sx={{ width: "200px" }}>
              <InputField
                name="coins"
                value={userData.coins}
                onChange={handleChange}
                fullWidth
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>
        </Box>

        {/* <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "350px",
            }}
          >
            <span>KYC</span>
            <Box sx={{ width: "200px" }}>
              <SelectField
                options={[
                  {
                    value: "approved",
                    name: "Approved",
                  },
                  {
                    value: "rejected",
                    name: "Rejected",
                  },
                ]}
                name="kyc"
                value={userData.kyc}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box> */}
      </Box>
    </div>
  );
};

export default AddNewUser;
