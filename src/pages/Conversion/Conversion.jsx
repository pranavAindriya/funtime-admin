import { Box, useTheme } from "@mui/material";
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
    coinToDiamond: {
      coins: 0,
      diamond: 0,
    },
    diamondToRupee: {
      diamond: 0,
      rupee: 0,
    },
  });
  const [validationError, setValidationError] = useState();

  const theme = useTheme();

  const fetchConversionDetails = async () => {
    const response = await getConversionFactors();
    console.log(response);
    const { conversion } = response.data;
    setConversionData({
      coinToDiamond: {
        coins: conversion?.coinToDiamond?.coins || 0,
        diamond: conversion?.coinToDiamond?.diamond || 0,
      },
      diamondToRupee: {
        diamond: conversion?.diamondToRupee.diamond || 0,
        rupee: conversion?.diamondToRupee.rupee || 0,
      },
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setConversionData((prevData) => {
      const [category, field] = name.split(".");
      return {
        ...prevData,
        [category]: {
          ...prevData[category],
          [field]: Number(value),
        },
      };
    });
  };

  const handleConversionChangesSave = async () => {
    const response = await conversionsEdit(conversionData);
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
        label={"Coins & Diamonds"}
        buttonLabel={isEditable ? "Save Changes" : "Edit Values"}
        buttonStyles={{
          minWidth: "150px",
        }}
        onAddButtonClick={handleTopBarButtonClick}
      />
      <Box>
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
            <img src={SmallCoin} />
            <span>Coin - Diamond conversion factor-</span>
            <InputField
              value={conversionData?.coinToDiamond.coins}
              name="coinToDiamond.coins"
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
            <span>Coins =</span>
            <InputField
              value={conversionData?.coinToDiamond.diamond}
              name="coinToDiamond.diamond"
              onChange={handleFieldChange}
              disabled={isEditable ? false : true}
              styles={{
                maxWidth: "100px",
              }}
              error={validationError}
              setError={setValidationError}
            />
            Diamonds
          </Box>
        </Box>

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
              value={conversionData?.diamondToRupee.diamond}
              name="diamondToRupee.diamond"
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
              value={conversionData?.diamondToRupee.rupee}
              name="diamondToRupee.rupee"
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
    </Box>
  );
};

export default Conversion;
