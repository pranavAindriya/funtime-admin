import { Box, Button, IconButton, InputAdornment, Switch } from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import coinImage from "../../assets/Coin.svg";
import {
  getCoinList,
  getFreeCoinDetails,
  updateFreeCoinDetails,
} from "../../service/allApi";
import theme from "../../../theme";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import InputField from "../../components/InputField";
import { Slide, ToastContainer, toast } from "react-toastify";
import TopAddNewBar from "../../components/TopAddNewBar";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "slno", headerName: "Sl No" },
  { field: "coin", headerName: "Coin" },
  { field: "rateInInr", headerName: "Rate in INR" },
  {
    field: "image",
    headerName: "Image",
    renderCell: () => (
      <img src={coinImage} alt="Coin" style={{ width: 40, height: 40 }} />
    ),
  },
  { field: "text", headerName: "Text" },
  {
    field: "status",
    headerName: "Status",
    renderCell: (value) => <TableToggleSwitch value={value} />,
  },
  {
    field: "edit",
    headerName: "Edit",
    renderCell: () => (
      <>
        <IconButton>
          <Pencil size={20} color={theme.palette.info.main} />
        </IconButton>
        <IconButton>
          <Trash size={20} color={theme.palette.error.main} />
        </IconButton>
      </>
    ),
  },
];

const Coins = () => {
  const [coinList, setCoinList] = useState();
  const [freeCoinDetails, setFreeCoinDetails] = useState({
    freeCoinForNewUsers: "",
    expiry: "",
    status: true,
    id: "",
  });
  const [validationErrors, setValidationErrors] = useState();

  const navigate = useNavigate();

  const fetchCoinList = async () => {
    const response = await getCoinList();
    setCoinList(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "expiry" && value.length > 2) {
      return;
    }
    setFreeCoinDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFreeCoinDetailsUpdate = async () => {
    const id = freeCoinDetails.id;
    const body = {
      freeCoinforNewUser: freeCoinDetails.freeCoinForNewUsers,
      expireAfter: freeCoinDetails.expiry,
      status: freeCoinDetails.status,
    };
    const response = await updateFreeCoinDetails(id, body);
    console.log(response);
    if (response.status === 200) {
      toast.success("Free Coins updated Successfully", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const fetchFreeCoinData = async () => {
    const response = await getFreeCoinDetails();
    setFreeCoinDetails({
      freeCoinForNewUsers: response.data[0].freeCoinforNewUser,
      expiry: response.data[0].expireAfter,
      status: response.data[0].status,
      id: response.data[0]._id,
    });
  };

  useEffect(() => {
    fetchCoinList();
    fetchFreeCoinData();
  }, []);

  const formatedCoinsForDataTable = () => {
    return coinList?.map((item, ind) => ({
      slno: ind + 1,
      coin: item.coin,
      rateInInr: item.rateInInr,
      text: item.text,
      status: item.status,
    }));
  };

  const formattedCoinRows = formatedCoinsForDataTable();

  console.log(freeCoinDetails);

  return (
    <>
      <Box
        sx={{
          padding: "25px",
          backgroundColor: theme.palette.secondary.light,
          borderRadius: "10px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-evenly",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>
            Free Coins for new users
          </span>
          <InputField
            value={freeCoinDetails.freeCoinForNewUsers}
            error={validationErrors}
            setError={setValidationErrors}
            name={"freeCoinForNewUsers"}
            onChange={handleInputChange}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>
            Expires after
          </span>
          <InputField
            value={freeCoinDetails.expiry}
            error={validationErrors}
            setError={setValidationErrors}
            name={"expiry"}
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment
                sx={{
                  position: "absolute",
                  right: "65%",
                }}
              >
                days
              </InputAdornment>
            }
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>Status</span>
          <TableToggleSwitch
            value={freeCoinDetails.status}
            name={"status"}
            onChange={(e) =>
              setFreeCoinDetails((prev) => ({
                ...prev,
                ["status"]: e.target.checked,
              }))
            }
          />
        </Box>

        <Button
          sx={{ paddingInline: "30px" }}
          onClick={handleFreeCoinDetailsUpdate}
        >
          Update
        </Button>
      </Box>
      <TopAddNewBar
        label={"Coin Purchase Packages"}
        onAddButtonClick={() => navigate("/coins/add")}
      />
      <ToastContainer position="top-center" transition={"Slide"} />
      <DataTable columns={columns} rows={formattedCoinRows} />
    </>
  );
};

export default Coins;
