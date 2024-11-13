import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import { Box, Button } from "@mui/material";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import coin from "../../assets/CoinImage.png";
import { createCoinPackage } from "../../service/allApi";
import { Slide, toast } from "react-toastify";
import LabeldInputField from "../../Components/LabeldInputField";
import CreateNewTopBar from "../../Components/CreateNewTopBar";

const AddNewCoin = () => {
  const [coinData, setCoinData] = useState({
    numberOfCoins: "",
    rateInINR: "",
    text: "",
    status: false,
    icon: null,
  });
  const [validationErrors, setValidationErrors] = useState();
  const [iconPreview, setIconPreview] = useState("");

  const { type, id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (type === "edit" || type === "view") {
      // Fetch data based on ID or any other identifier from URL params
      // For example:
      // fetchDataById(id).then((data) => {
      //   setCoinData({
      //     numberOfCoins: data.numberOfCoins,
      //     rateInINR: data.rateInINR,
      //     text: data.text,
      //     status: data.status,
      //     icon: data.icon, // Assuming the fetched data contains the icon URL
      //   });
      // });
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoinData({
      ...coinData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    setCoinData({
      ...coinData,
      status: isChecked,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoinData({
        ...coinData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!coinData.numberOfCoins)
      errors.numberOfCoins = "Number of coins is required";
    if (!coinData.rateInINR) errors.rateInINR = "Rate is required";
    if (!coinData.text) errors.text = "Text is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          coin: parseInt(coinData.numberOfCoins),
          rateInInr: parseFloat(coinData.rateInINR),
          text: coinData.text,
          status: coinData.status,
        };

        const response = await createCoinPackage(payload);
        if (response.status === 201) {
          toast.success("Coin Package Created", {
            autoClose: 1000,
            transition: Slide,
          });
          navigate("/coins");
          setCoinData({
            numberOfCoins: "",
            rateInINR: "",
            text: "",
            status: false,
            icon: null,
          });
        }
      } catch (error) {
        console.error("Error creating coin package", error);
      }
    }
  };

  return (
    <div>
      <CreateNewTopBar
        label={type === "edit" ? "Edit Package" : "Add New Coin Package"}
        buttonStyles={{ width: "120px" }}
        onAddButtonClick={handleSubmit}
      />

      <Box
        sx={{
          display: "grid",
          gap: "30px",
        }}
      >
        <LabeldInputField
          label={"Number of Coins"}
          input={
            <InputField
              name="numberOfCoins"
              value={coinData.numberOfCoins}
              onChange={handleChange}
              error={validationErrors}
              setError={setValidationErrors}
            />
          }
        />
        <LabeldInputField
          label={"Icon"}
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
                src={iconPreview || coinData.icon || coin}
                alt="Icon Preview"
                style={{
                  width: "80px",
                  height: "80px",
                  border: "rgba(0, 0, 0, 0.5) 1px solid",
                  borderRadius: "10px",
                }}
              />
              <input
                type="file"
                id="icon"
                onChange={handleIconChange}
                style={{ display: "none" }}
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
          }
        />
        <LabeldInputField
          label={"Rate in INR"}
          input={
            <InputField
              name="rateInINR"
              value={coinData.rateInINR}
              onChange={handleChange}
              error={validationErrors}
              setError={setValidationErrors}
            />
          }
        />
        <LabeldInputField
          label={"Text"}
          input={
            <InputField
              name="text"
              value={coinData.text}
              onChange={handleChange}
              error={validationErrors}
              setError={setValidationErrors}
            />
          }
        />
        <LabeldInputField
          label={"Status"}
          input={
            <Box sx={{ width: "130px" }}>
              <TableToggleSwitch
                checked={coinData.status}
                onChange={handleStatusChange}
                error={validationErrors}
                setError={setValidationErrors}
              />
            </Box>
          }
        />
      </Box>
    </div>
  );
};

export default AddNewCoin;
