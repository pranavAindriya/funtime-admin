import React, { useEffect, useState } from "react";
import { Box, Button, Alert, Avatar, Pagination } from "@mui/material";
import { getAllKyc, changeKycStatus } from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import formatDate from "../../../utils/formatdate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../redux/slices/authSlice";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const KycRequests = () => {
  const [kycData, setKycData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchAllKycRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllKyc(page, 100);
      console.log(response);

      if (response.data.data) {
        const transformedData = response?.data?.data.map((item, ind) => ({
          slno: ind + 1,
          id: item._id,
          username: {
            username: item.userDetails.username,
            image: item.userDetails.profileImage,
          },
          panNumber: item.panDetails?.panNumber,
          aadhaarNumber: item.aadhaarDetails?.aadhaarNumber,
          status: item.kycStatus,
          createdAt: formatDate(item.createdAt),
          verified: {
            verified: item.kycStatus === "approved" ? true : false,
            pending: item.kycStatus === "pending" ? true : false,
            userId: item.userId,
            id: item._id,
          },
        }));
        setKycData(transformedData);
        setPaginationDetails(response?.data?.pagination);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch KYC requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllKycRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setKycData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                verified: { verified: newStatus, id },
                status: newStatus ? "approved" : "rejected",
              }
            : item
        )
      );

      const response = await changeKycStatus(
        id,
        newStatus === true ? "approved" : "rejected"
      );

      if (!response.status === 200) {
        setKycData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  verified: { verified: !newStatus, id },
                  status: !newStatus ? "approved" : "rejected",
                }
              : item
          )
        );
        setError("Failed to update KYC status");
      }
    } catch (err) {
      setKycData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                verified: { verified: !newStatus, id },
                status: !newStatus ? "approved" : "rejected",
              }
            : item
        )
      );
      setError("Failed to update KYC status");
      console.error(err);
    }
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  const columns = [
    { field: "slno", headerName: "SlNo" },
    {
      field: "username",
      headerName: "Username",
      renderCell: (params) => (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Avatar src={params.image} />
          <span>{params.username}</span>
        </Box>
      ),
    },
    { field: "panNumber", headerName: "PAN Number" },
    { field: "aadhaarNumber", headerName: "Aadhaar Number" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            color: params === "approved" ? "success.main" : "error.main",
            fontWeight: "medium",
          }}
        >
          {params}
        </Box>
      ),
    },
    { field: "createdAt", headerName: "Created Date" },
    hasAccess && {
      field: "verified",
      headerName: "Actions",
      renderCell: (params) => (
        <Box display={"flex"} flexWrap={"wrap"} gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`kyc-details/${params.userId}`)}
          >
            View
          </Button>
          {!params.verified ? (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleStatusChange(params.id, true)}
                sx={{
                  color: "white",
                }}
              >
                Approve
              </Button>
              {params.pending && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusChange(params.id, false)}
                >
                  Reject
                </Button>
              )}
            </>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleStatusChange(params.id, false)}
            >
              Reject
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <LoadingBackdrop open={loading}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Pagination
        count={paginationDetails?.totalPages}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          mt: 2,
        }}
        onChange={(e, page) => setPage(page)}
      />
      <DataTable columns={columns} rows={kycData} />
      <Pagination
        count={paginationDetails?.totalPages}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          mt: 4,
        }}
        onChange={(e, page) => setPage(page)}
      />
    </LoadingBackdrop>
  );
};

export default KycRequests;
