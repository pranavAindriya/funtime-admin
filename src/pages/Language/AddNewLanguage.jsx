import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import InputField from "../../components/InputField";
import LabeldInputField from "../../components/LabeldInputField";
import {
  createNewLanguage,
  getLanguageById,
  updateLanguage,
} from "../../service/allApi";
import { useNavigate, useParams } from "react-router-dom";

const AddNewLanguage = () => {
  const [languageData, setLanguageData] = useState({
    name: "",
    users: 0,
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { type, id } = useParams();

  const fetchLanguageById = async () => {
    const response = await getLanguageById(id);
    console.log(response);
    if (response.status === 200) {
      setLanguageData({
        name: response.data.language.language,
        users: response.data.language.user,
      });
    }
  };

  useEffect(() => {
    if (type) {
      fetchLanguageById();
    }
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanguageData({
      ...languageData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "edit") {
        const response = await updateLanguage(id, {
          language: languageData.name,
          status: true,
        });
        if (response.status === 200) {
          navigate("/language");
        }
      } else {
        const response = await createNewLanguage({
          language: languageData.name,
          user: languageData.users,
        });
        if (response.status === 201) {
          navigate("/language");
        }
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
            label={"Users"}
            input={
              <InputField
                name="users"
                value={languageData.users}
                onChange={handleChange}
                error={error}
                setError={setError}
              />
            }
          />
        </Box>
      </form>
    </div>
  );
};

export default AddNewLanguage;
