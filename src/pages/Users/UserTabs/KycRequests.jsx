import React, { useEffect, useState } from "react";
import { Box, Button, Alert, Avatar } from "@mui/material";
import { getAllKyc, changeKycStatus } from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import formatDate from "../../../utils/formatdate";

const KycRequests = () => {
  const [kycData, setKycData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllKycRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllKyc();
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
            id: item._id,
          },
        }));
        setKycData(transformedData);
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
    {
      field: "verified",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          {!params.verified ? (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleStatusChange(params.id, true)}
            >
              Verify
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleStatusChange(params.id, false)}
            >
              Unverify
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <DataTable columns={columns} rows={kycData} />
    </Box>
  );
};

export default KycRequests;
