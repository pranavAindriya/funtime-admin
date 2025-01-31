import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Switch,
  Typography,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import coinImage from "../../assets/Coin.svg";
import {
  deleteCoinPackage,
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
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop";

const Coins = () => {
  const [coinList, setCoinList] = useState();
  const [freeCoinDetails, setFreeCoinDetails] = useState({
    freeCoinForNewUsers: "",
    expiry: "",
    status: true,
    id: "",
  });
  const [validationErrors, setValidationErrors] = useState();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [coinToDelete, setCoinToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCoinList = async () => {
    setLoading(true);
    const response = await getCoinList();
    if (response.status === 200) {
      setCoinList(response.data);
    }
    setLoading(false);
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

  const handleDeleteCoin = async () => {
    if (coinToDelete) {
      try {
        const response = await deleteCoinPackage(coinToDelete);
        if (response.status === 204) {
          toast.success("Coin Package Deleted Successfully", {
            autoClose: 1000,
            transition: Slide,
          });
          fetchCoinList();
        }
      } catch (error) {
        toast.error("Failed to delete Coin Package", {
          autoClose: 1000,
          transition: Slide,
        });
      }

      setDeleteConfirmationOpen(false);
      setCoinToDelete(null);
    }
  };

  const openDeleteConfirmation = (id) => {
    setCoinToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setCoinToDelete(null);
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

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Coin", "readAndWrite")
  );

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
    hasAccess && {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/coins/edit/${params}`)}>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton onClick={() => openDeleteConfirmation(params)}>
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
        </>
      ),
    },
  ];

  const formatedCoinsForDataTable = () => {
    return coinList?.map((item, ind) => ({
      slno: ind + 1,
      coin: item.coin,
      rateInInr: item.rateInInr,
      text: item.text,
      status: item.status,
      edit: item._id,
    }));
  };

  const formattedCoinRows = formatedCoinsForDataTable();

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Coin"));

  if (isBlocked) {
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
    <LoadingBackdrop>
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

        {hasAccess && (
          <Button
            sx={{ paddingInline: "30px" }}
            onClick={handleFreeCoinDetailsUpdate}
            variant="contained"
          >
            Update
          </Button>
        )}
      </Box>
      <TopAddNewBar
        label={"Coin Purchase Packages"}
        onAddButtonClick={() => navigate("/coins/add")}
        hasAccess={hasAccess}
      />
      <ToastContainer position="top-center" transition={"Slide"} />
      <DataTable columns={columns} rows={formattedCoinRows} />
      {formattedCoinRows?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle
          id="delete-confirmation-title"
          fontSize={22}
          fontWeight={500}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this coin package?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteConfirmation}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCoin}
            color="error"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </LoadingBackdrop>
  );
};

export default Coins;
