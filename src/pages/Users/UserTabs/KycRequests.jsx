import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Alert,
  Avatar,
  Pagination,
  TextField,
  IconButton,
} from "@mui/material";
import { getAllKyc, changeKycStatus } from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import formatDate from "../../../utils/formatdate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../redux/slices/authSlice";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { X, MagnifyingGlass } from "@phosphor-icons/react";

const KycRequests = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Users", "readAndWrite")
  );

  // Query keys
  const kycQueryKeys = {
    all: ["kyc"],
    list: (page, searchTerm) => [...kycQueryKeys.all, { page, searchTerm }],
  };

  // Fetch KYC requests query
  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: kycQueryKeys.list(page, activeSearchTerm),
    queryFn: async () => {
      let url;
      if (isSearching) {
        url = `userName=${activeSearchTerm}`;
      } else {
        url = `page=${page}&limit=50`;
      }
      return getAllKyc(url);
    },
  });

  // Transform response data
  const kycData =
    response?.data?.data?.map((item, ind) => ({
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
    })) || [];

  const paginationDetails = response?.data?.pagination || {};

  // KYC status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => changeKycStatus(id, status),
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries(
        kycQueryKeys.list(page, activeSearchTerm)
      );

      const previousData = queryClient.getQueryData(
        kycQueryKeys.list(page, activeSearchTerm)
      );

      queryClient.setQueryData(
        kycQueryKeys.list(page, activeSearchTerm),
        (old) => ({
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item) =>
              item._id === id
                ? {
                    ...item,
                    kycStatus: newStatus ? "approved" : "rejected",
                  }
                : item
            ),
          },
        })
      );

      return { previousData };
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        kycQueryKeys.list(page, activeSearchTerm),
        context.previousData
      );
      setError("Failed to update KYC status");
    },
    onSuccess: () => {
      setError(null);
    },
  });

  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({
      id,
      status: newStatus ? "approved" : "rejected",
      newStatus, // for onMutate
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setPage(1);
      setActiveSearchTerm(searchTerm.trim());
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsSearching(false);
    setPage(1);
  };

  const columns = [
    { field: "slno", headerName: "SlNo" },
    {
      field: "username",
      headerName: "Username",
      renderCell: (params) => (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Avatar src={params.image} slotProps={{ img: { loading: "lazy" } }} />
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
                sx={{ color: "white" }}
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
    <LoadingBackdrop open={isLoading || isFetching}>
      <Box
        sx={{
          display: "flex",
          mb: isSearching ? 2 : 3,
          mt: 2,
          gap: 2,
        }}
      >
        <TextField
          label="Search by username"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={handleClearSearch}>
                <X size={16} />
              </IconButton>
            ),
          }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          disabled={!searchTerm.trim()}
        >
          <MagnifyingGlass size={20} />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isSearching && (
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
          }}
          onChange={(e, newPage) => setPage(newPage)}
        />
      )}

      <DataTable columns={columns} rows={kycData} />

      {!isSearching && (
        <Pagination
          count={paginationDetails?.totalPages}
          page={page}
          color="primary"
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            mt: 4,
          }}
          onChange={(e, newPage) => setPage(newPage)}
        />
      )}
    </LoadingBackdrop>
  );
};

export default KycRequests;
