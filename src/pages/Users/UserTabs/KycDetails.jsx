import React, { useState, useEffect, useRef } from "react";
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
import { usePDF } from "react-to-pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../redux/slices/authSlice";

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
  const [isPdfGeneration, setIsPdfGeneration] = useState(false);

  const { id } = useParams();

  const { toPDF, targetRef } = usePDF();

  const pdfRef = useRef();

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

  // const handleExportPDF = () => {
  //   setIsPdfGeneration(true);

  //   setTimeout(() => {
  //     toPDF({
  //       filename: `KYC_${userDetails.username}_${
  //         new Date().toISOString().split("T")[0]
  //       }.pdf`,
  //       page: {
  //         margin: 20,
  //       },
  //     });

  //     setIsPdfGeneration(false);
  //   }, 100);
  // };

  const handleExportPDF = async () => {
    setIsPdfGeneration(true);
    try {
      const input = pdfRef.current;

      const images = input.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          });
        })
      );

      const canvas = await html2canvas(input, {
        useCORS: true,
        scale: 2,
        logging: false,
        allowTaint: true,
        removeContainer: true,
      });

      // Create PDF with margins
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // Get image properties
      const imgProps = pdf.getImageProperties(imgData);

      // Calculate page dimensions with margins
      const margin = 20; // 20mm margin
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add image to PDF with margins
      pdf.addImage(
        imgData,
        "PNG",
        margin, // X coordinate (left margin)
        margin, // Y coordinate (top margin)
        pdfWidth,
        pdfHeight
      );

      // Save PDF
      pdf.save(
        `KYC_${userDetails.username || "Details"}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("PDF Generation Error:", error);

      // Fallback method
      window.print();
    } finally {
      setIsPdfGeneration(false);
    }
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

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
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
            <Box display={"flex"} gap={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleStatusChange(false)}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Box>
          ) : (
            <Box display={"flex"} gap={2}>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Box ref={pdfRef} pb={4}>
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
            {!isPdfGeneration && (
              <ViewButton onClick={() => handleView("PAN")} sx={{ mt: 1 }}>
                View
              </ViewButton>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, my: 5 }}>
            Aadhar Card Details
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 1 }}>Front Side</Typography>
              <DocumentImage
                src={aadhaarDetails.frontImage}
                alt="Aadhar Front"
              />
              {!isPdfGeneration && (
                <ViewButton
                  onClick={() => handleView("AadharFront")}
                  sx={{ mt: 1 }}
                >
                  View
                </ViewButton>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 1 }}>Back Side</Typography>
              <DocumentImage src={aadhaarDetails.backImage} alt="Aadhar Back" />
              {!isPdfGeneration && (
                <ViewButton
                  onClick={() => handleView("AadharBack")}
                  sx={{ mt: 1 }}
                >
                  View
                </ViewButton>
              )}
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
      </Box>

      {/* Modal for viewing images */}
      {!isPdfGeneration && (
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
      )}
    </Box>
  );
}
