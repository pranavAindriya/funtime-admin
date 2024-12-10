import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Modal,
  styled,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { changeKycStatus, getKycById } from "../../../service/allApi";
import { ArrowLeft } from "@phosphor-icons/react";

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00a650",
  color: "white",
  "&:hover": {
    backgroundColor: "#008f44",
  },
  textTransform: "none",
  minWidth: "80px",
  height: "32px",
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: "20px",
  alignItems: "flex-start",
}));

const Label = styled(Typography)(({ theme }) => ({
  width: "180px",
  color: "#000",
  fontWeight: 500,
}));

const Value = styled(Typography)(({ theme }) => ({
  flex: 1,
  color: "#000",
  fontWeight: 550,
}));

const DocumentImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: "300px",
  border: "1px solid #ddd",
  borderRadius: "4px",
}));

const ModalImage = styled("img")(({ theme }) => ({
  maxWidth: "90vw",
  maxHeight: "90vh",
  objectFit: "contain",
}));

export default function KycDetails() {
  const [userDetails, setUserDetails] = useState({});
  const [panDetails, setPanDetails] = useState({});
  const [aadhaarDetails, setAadhaarDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [kycStatus, setKycStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [kycId, setKycId] = useState("");
  const [error, setError] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const handleFetchKycDetails = async () => {
    try {
      const response = await getKycById(id);
      if (response.status === 200) {
        const { data } = response.data;

        setUserDetails(data.userDetails);
        setPanDetails(data.panDetails);
        setAadhaarDetails(data.aadhaarDetails);
        setBankDetails(data.bankaccount);
        setKycStatus(data.kycStatus);
        setKycId(data._id);
      }
    } catch (error) {
      console.error("Error fetching KYC details:", error);
    }
  };

  useEffect(() => {
    handleFetchKycDetails();
  }, [id]);

  const handleView = (documentType) => {
    let imageSrc = "";
    switch (documentType) {
      case "PAN":
        imageSrc = panDetails.panImage;
        break;
      case "AadharFront":
        imageSrc = aadhaarDetails.frontImage;
        break;
      case "AadharBack":
        imageSrc = aadhaarDetails.backImage;
        break;
      default:
        imageSrc = "";
    }
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setKycStatus(newStatus === true ? "approved" : "rejected");

      const response = await changeKycStatus(
        kycId,
        newStatus === true ? "approved" : "rejected"
      );

      if (!response.status === 200) {
        setKycStatus(newStatus === true ? "rejected" : "approved");

        setError("Failed to update KYC status");
      }
    } catch (err) {
      setKycStatus(newStatus === true ? "rejected" : "approved");
      setError("Failed to update KYC status");
      console.error(err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ mr: 1 }} onClick={() => navigate("/users")}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            {userDetails.username}
          </Typography>
        </Box>
        <Box>
          {kycStatus === "approved" ? (
            <Button
              variant="outlined"
              color="error"
              sx={{ mr: 2 }}
              onClick={() => handleStatusChange(false)}
            >
              Reject
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#00a650",
                "&:hover": { bgcolor: "#008f44" },
              }}
              onClick={() => handleStatusChange(true)}
            >
              Approve
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <DetailRow>
          <Label>User Name</Label>
          <Value>{userDetails.username}</Value>
        </DetailRow>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, my: 5 }}>
          PAN Card Details
        </Typography>
        <DetailRow>
          <Label>PAN Number</Label>
          <Value>{panDetails.panNumber}</Value>
          <Label>Name as per PAN</Label>
          <Value>{panDetails.nameOnPan}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Date of Birth</Label>
          <Value>{panDetails.dob}</Value>
        </DetailRow>
        <Box sx={{ mt: 2 }}>
          <DocumentImage src={panDetails.panImage} alt="PAN Card" />
          <ViewButton onClick={() => handleView("PAN")} sx={{ mt: 1 }}>
            View
          </ViewButton>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, my: 5 }}>
          Aadhar Card Details
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mb: 1 }}>Front Side</Typography>
            <DocumentImage src={aadhaarDetails.frontImage} alt="Aadhar Front" />
            <ViewButton
              onClick={() => handleView("AadharFront")}
              sx={{ mt: 1 }}
            >
              View
            </ViewButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mb: 1 }}>Back Side</Typography>
            <DocumentImage src={aadhaarDetails.backImage} alt="Aadhar Back" />
            <ViewButton onClick={() => handleView("AadharBack")} sx={{ mt: 1 }}>
              View
            </ViewButton>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, my: 5 }}>
          Bank Details
        </Typography>
        <DetailRow>
          <Label>Account Holder Name</Label>
          <Value>{bankDetails.accountHolderName}</Value>
          <Label>Bank Name</Label>
          <Value>{bankDetails.bankName}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Account Number</Label>
          <Value>{bankDetails.accountNumber}</Value>
          <Label>IFSC Code</Label>
          <Value>{bankDetails.ifcCode}</Value>
        </DetailRow>
      </Box>

      {/* Modal for viewing images */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="image-modal"
        aria-describedby="view-full-size-image"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <ModalImage src={modalImage} alt="Full size document" />
        </Box>
      </Modal>
    </Box>
  );
}
