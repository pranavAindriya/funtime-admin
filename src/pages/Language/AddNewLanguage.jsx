import React, { useState } from "react";
import { Box } from "@mui/material";
import CreateNewTopBar from "../../Components/CreateNewTopBar";
import InputField from "../../components/InputField";
import LabeldInputField from "../../Components/LabeldInputField";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import languagePlaceholder from "../../assets/LanguagePlaceholder.png";
import { createNewLanguage } from "../../service/allApi";
import { useNavigate } from "react-router-dom";

const AddNewLanguage = () => {
  const [languageData, setLanguageData] = useState({
    name: "",
    image: null,
    code: "",
    status: false,
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanguageData({
      ...languageData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    setLanguageData({
      ...languageData,
      status: isChecked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLanguageData({
        ...languageData,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("language", languageData.name);
    formData.append("status", languageData.status);
    formData.append("code", languageData.code);
    formData.append("image", languageData.image);

    try {
      const response = await createNewLanguage(formData);

      if (response.status === 201) {
        navigate("/language");
      }
    } catch (error) {
      console.error("Error creating language:", error);
    }
  };

  return (
    <div>
      <CreateNewTopBar
        label={"Add New Language"}
        buttonStyles={{ width: "120px" }}
        onAddButtonClick={handleSubmit}
      />

      <form onSubmit={handleSubmit}>
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
                value={languageData.name}
                onChange={handleChange}
                error={error}
                setError={setError}
              />
            }
          />
          <LabeldInputField
            label={"Image"}
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
                  src={
                    imagePreview || languageData.image || languagePlaceholder
                  }
                  alt="Language Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "rgba(0, 0, 0, 0.5) 1px solid",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <input
                  type="file"
                  id="languageImage"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <label
                  htmlFor="languageImage"
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
                  Upload PNG/JPEG with size below 1MB
                </span>
              </Box>
            }
          />
          <LabeldInputField
            label={"Language Code"}
            input={
              <InputField
                name="code"
                value={languageData.code}
                onChange={handleChange}
                error={error}
                setError={setError}
              />
            }
          />
          <LabeldInputField
            label={"Status"}
            input={
              <Box sx={{ width: "130px" }}>
                <TableToggleSwitch
                  checked={languageData.status}
                  onChange={handleStatusChange}
                  error={error}
                  setError={setError}
                />
              </Box>
            }
          />
        </Box>
      </form>
    </div>
  );
};

export default AddNewLanguage;
