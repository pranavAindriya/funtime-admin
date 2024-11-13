import { Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import TopAddNewBar from "../../components/TopAddNewBar";
import InputField from "../../components/InputField";
import SmallCoin from "../../assets/SmallCoin.svg";
import SmallHeart from "../../assets/SmallHeart.svg";
import { conversionsEdit, getConversionFactors } from "../../service/allApi";
import { Slide, ToastContainer, toast } from "react-toastify";

const Conversion = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [conversionData, setConversionData] = useState({
    coinHeartConversionFactor: {
      coins: 0,
      hearts: 0,
    },
    heartConversionFactor: {
      hearts: 0,
      indianRupees: 0,
    },
    referrals: {
      coinPerReferreals: 0,
    },
  });
  const [validationError, setValidationError] = useState();

  const theme = useTheme();

  const fetchConversionDetails = async () => {
    const response = await getConversionFactors();
    console.log(response);
    const { coinConversionData } = response.data;
    setConversionData({
      coinHeartConversionFactor: {
        coins: coinConversionData?.coinHeartConversionFactor?.coins || 0,
        hearts: coinConversionData?.coinHeartConversionFactor?.hearts || 0,
      },
      heartConversionFactor: {
        hearts: coinConversionData?.heartConversionFactor.hearts || 0,
        indianRupees:
          coinConversionData?.heartConversionFactor.indianRupees || 0,
      },
      referrals: {
        coinPerReferreals: coinConversionData?.referrals.coinPerReferreals || 0,
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
      toast.success("Coin conversion data Updated", {
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
            <span>Coin - Diamonds conversion factor-</span>
            <InputField
              value={conversionData?.coinHeartConversionFactor.coins}
              name="coinHeartConversionFactor.coins"
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
              value={conversionData?.coinHeartConversionFactor.hearts}
              name="coinHeartConversionFactor.hearts"
              onChange={handleFieldChange}
              disabled={isEditable ? false : true}
              styles={{
                maxWidth: "100px",
              }}
              error={validationError}
              setError={setValidationError}
            />
            Hearts
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
            <img src={SmallHeart} />
            <span>Diamonds conversion factor-</span>
            <InputField
              value={conversionData?.heartConversionFactor.hearts}
              name="heartConversionFactor.hearts"
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
            <span>Hearts =</span>
            <InputField
              value={conversionData?.heartConversionFactor.indianRupees}
              name="heartConversionFactor.indianRupees"
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

        <Box
          sx={{
            display: "grid",
            gap: "25px",
            marginTop: "30px",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Referrals
          </span>

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
              <span>Coins received per referreal</span>
              <InputField
                value={conversionData?.referrals.coinPerReferreals}
                name="referrals.coinPerReferreals"
                onChange={handleFieldChange}
                disabled={isEditable ? false : true}
                styles={{
                  maxWidth: "100px",
                }}
                error={validationError}
                setError={setValidationError}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Conversion;
