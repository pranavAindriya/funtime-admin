import { Box, useTheme, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TopAddNewBar from "../../components/TopAddNewBar";
import InputField from "../../components/InputField";
import SmallCoin from "../../assets/SmallCoin.svg";
import SmallDiamond from "../../assets/SmallHeart.svg";
import { conversionsEdit, getConversionFactors } from "../../service/allApi";
import { Slide, ToastContainer, toast } from "react-toastify";

const Conversion = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [conversionData, setConversionData] = useState({
    coinsDeductedPerMinute: 0,
    diamondsReceivedPerMinute: 0,
    diamondConversionFactor: {
      diamond: 0,
      rupee: 0,
    },
  });
  const [validationError, setValidationError] = useState();

  const theme = useTheme();

  const fetchConversionDetails = async () => {
    const response = await getConversionFactors("67596e13799e9266923583b8");
    console.log(response);
    const { conversion } = response.data;
    setConversionData({
      coinsDeductedPerMinute: conversion?.coinsDeductedPerMinute || 0,
      diamondsReceivedPerMinute: conversion?.diamondsReceivedPerMinute || 0,
      diamondConversionFactor: {
        diamond: conversion?.diamondConversionFactor.diamond || 0,
        rupee: conversion?.diamondConversionFactor.rupee || 0,
      },
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setConversionData((prevData) => {
      if (name.includes(".")) {
        const [category, field] = name.split(".");
        return {
          ...prevData,
          [category]: {
            ...prevData[category],
            [field]: Number(value),
          },
        };
      } else {
        return {
          ...prevData,
          [name]: Number(value),
        };
      }
    });
  };

  const handleConversionChangesSave = async () => {
    const response = await conversionsEdit(
      conversionData,
      "67596e13799e9266923583b8"
    );
    if (response.status === 200) {
      toast.success("Conversion data Updated", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  useEffect(() => {
    fetchConversionDetails();
  }, []);

  const handleTopBarButtonClick = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleConversionChangesSave();
    }
  };

  console.log(conversionData);

  return (
    <Box>
      <ToastContainer position="top-center" transition={"Slide"} />
      <TopAddNewBar
        buttonLabel={isEditable ? "Save Changes" : "Edit Values"}
        buttonStyles={{
          minWidth: "150px",
        }}
        onAddButtonClick={handleTopBarButtonClick}
      />
      <Box display={"flex"} alignItems={"center"} gap={2} mb={3}>
        <Typography fontWeight={600} fontSize={18}>
          Coins deducted from user per one minute =
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            fontWeight: 700,
          }}
        >
          <InputField
            value={conversionData?.coinsDeductedPerMinute}
            name="coinsDeductedPerMinute"
            onChange={handleFieldChange}
            disabled={isEditable ? false : true}
            styles={{
              maxWidth: "100px",
            }}
            error={validationError}
            setError={setValidationError}
          />
          <img src={SmallCoin} />
          <span>Coins</span>
        </Box>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={2} mb={6}>
        <Typography fontWeight={600} fontSize={18}>
          Diamonds received by host per one minute =
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            fontWeight: 700,
          }}
        >
          <InputField
            value={conversionData?.diamondsReceivedPerMinute}
            name="diamondsReceivedPerMinute"
            onChange={handleFieldChange}
            disabled={isEditable ? false : true}
            styles={{
              maxWidth: "100px",
            }}
            error={validationError}
            setError={setValidationError}
          />
          <img src={SmallDiamond} />
          <span>Diamonds</span>
        </Box>
      </Box>
      <Typography fontWeight={600} fontSize={20} my={3}>
        Coins & Diamonds
      </Typography>

      <Box
        sx={{
          padding: "25px",
          backgroundColor: theme.palette.secondary.light,
          borderRadius: "10px",
          marginBottom: "25px",
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            fontWeight: 700,
          }}
        >
          <img src={SmallDiamond} />
          <span>Diamond conversion factor-</span>
          <InputField
            value={conversionData?.diamondConversionFactor.diamond}
            name="diamondConversionFactor.diamond"
            onChange={handleFieldChange}
            disabled={isEditable ? false : true}
            styles={{
              maxWidth: "100px",
            }}
            error={validationError}
            setError={setValidationError}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            fontWeight: 700,
          }}
        >
          <span>Diamonds =</span>
          <InputField
            value={conversionData?.diamondConversionFactor.rupee}
            name="diamondConversionFactor.rupee"
            onChange={handleFieldChange}
            disabled={isEditable ? false : true}
            styles={{
              maxWidth: "100px",
            }}
            error={validationError}
            setError={setValidationError}
          />
          Indian Rupees
        </Box>
      </Box>
    </Box>
  );
};

export default Conversion;
