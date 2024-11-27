import React, { useState } from "react";
import { Box } from "@mui/material";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import LabeldInputField from "../../components/LabeldInputField";
import ProfileImagePlaceholder from "../../assets/ProfileImagePlaceholder.png";
import { useNavigate } from "react-router-dom";

const AddNewUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    phoneNumber: "",
    dob: "",
    location: "",
    gender: "",
    icon: null,
    coins: "",
    kyc: "",
  });
  const [iconPreview, setIconPreview] = useState("");

  const [validationError, setValidationError] = useState();

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

  return (
    <div>
      <CreateNewTopBar
        label={"Add New User"}
        onBackButtonClick={() => navigate("/users")}
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
                fullWidth
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
            <Box sx={{ width: "300px" }}>
              <InputField
                name="phoneNumber"
                fullWidth
                value={userData.phoneNumber}
                onChange={handleChange}
                placeholder={"Enter 10 digit Phone Number"}
                error={validationError}
                setError={setValidationError}
              />
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
              <SelectField
                name="location"
                value={userData.location}
                onChange={handleChange}
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
                    value: "male",
                    name: "Male",
                  },
                  {
                    value: "female",
                    name: "Female",
                  },
                  { value: "other", name: "Other" },
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

        <Box>
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
        </Box>
      </Box>
    </div>
  );
};

export default AddNewUser;
