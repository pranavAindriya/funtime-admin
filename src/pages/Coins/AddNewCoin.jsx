import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import coin from "../../assets/CoinImage.png";
import {
  createCoinPackage,
  deleteCoinPackage,
  getCoinById,
  updateCoinPackage,
} from "../../service/allApi";
import { Slide, toast } from "react-toastify";
import LabeldInputField from "../../components/LabeldInputField";
import CreateNewTopBar from "../../components/CreateNewTopBar";
import { hasPermission } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";

const AddNewCoin = () => {
  const [coinData, setCoinData] = useState({
    id: "",
    numberOfCoins: "",
    rateInINR: "",
    text: "",
    status: false,
    icon: null,
  });
  const [validationErrors, setValidationErrors] = useState();
  const [iconPreview, setIconPreview] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [coinToDelete, setCoinToDelete] = useState(null);

  const { type, id } = useParams();

  const navigate = useNavigate();

  const fetchCoinById = async () => {
    const response = await getCoinById(id);
    if (response.status === 200) {
      setCoinData({
        id: response.data._id,
        numberOfCoins: response.data.coin,
        rateInINR: response.data.rateInInr,
        status: response.data.status,
        text: response.data.text,
      });
    }
    console.log(response);
  };

  useEffect(() => {
    if (type === "edit" || type === "view") {
      fetchCoinById();
    }
  }, [type, id]);

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
        if (type === "edit") {
          const response = await updateCoinPackage(id, payload);
          if (response.status === 200) {
            toast.success("Coin Package Updated", {
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
        } else {
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
        }
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

  const handleDeleteCoin = async () => {
    if (coinToDelete) {
      try {
        const response = await deleteCoinPackage(coinToDelete);
        if (response.status === 204) {
          toast.success("Coin Package Deleted Successfully", {
            autoClose: 1000,
            transition: Slide,
          });
          navigate("/coins");
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

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Coin", "readAndWrite")
  );

  if (!hasAccess) {
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
    <div>
      <CreateNewTopBar
        label={type === "edit" ? "Edit Package" : "Add New Coin Package"}
        buttonStyles={{ width: "120px" }}
        onAddButtonClick={handleSubmit}
        onBackButtonClick={() => navigate("/coins")}
        onDeleteButtonClick={() => openDeleteConfirmation(coinData.id)}
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
        {/* <LabeldInputField
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
        /> */}
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
          label={"Actual Price"}
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
                value={coinData.status}
                onChange={handleStatusChange}
                error={validationErrors}
                setError={setValidationErrors}
              />
            </Box>
          }
        />
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
      </Box>
    </div>
  );
};

export default AddNewCoin;
