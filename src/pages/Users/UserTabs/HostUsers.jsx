import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllHostUsers,
  getAllLanguages,
  updateHostHeartBalance,
} from "../../../service/allApi";
import DataTable from "../../../components/DataTable";
import {
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  useTheme,
  Pagination,
} from "@mui/material";
import { Pencil, Check, X, Plus, Minus, Circle } from "@phosphor-icons/react";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const HostUsers = () => {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedHeartBalance, setEditedHeartBalance] = useState("");
  const [balanceOperation, setBalanceOperation] = useState("add");
  const [selectedLanguage, setSelectedLanguage] = useState("Malayalam");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const theme = useTheme();

  const { data: languagesData } = useQuery({
    queryKey: ["languages"],
    queryFn: getAllLanguages,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hostUsers", selectedLanguage, page],
    queryFn: () =>
      getAllHostUsers(
        `${selectedLanguage}&page=${page}&limit=${ITEMS_PER_PAGE}`
      ),
    refetchInterval: 60000,
  });

  const updateHeartBalanceMutation = useMutation({
    mutationFn: ({ userId, heart }) =>
      updateHostHeartBalance(userId, { heart }),
    onSuccess: () => {
      queryClient.invalidateQueries(["hostUsers"]);
      setEditingUserId(null);
      setEditedHeartBalance("");
      setBalanceOperation("add");
    },
  });

  const handleHeartBalanceChange = (userId) => {
    if (editedHeartBalance !== "") {
      const finalValue =
        balanceOperation === "add"
          ? parseFloat(editedHeartBalance)
          : -parseFloat(editedHeartBalance);

      updateHeartBalanceMutation.mutate({
        userId,
        heart: finalValue,
      });
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setPage(1); // Reset to first page when language changes
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const rows = data?.data?.data?.map((data, index) => ({
    id: data._id,
    slno: (page - 1) * ITEMS_PER_PAGE + index + 1,
    username: data?.username,
    phone: data?.mobileNumber,
    language: data?.profile?.language,
    heartBalance: { id: data?._id, value: data?.profile?.fullheartBalance },
    status: data?.status,
    connectStatus: data?.connectStatus,
    action: data?._id,
  }));

  const columns = [
    { field: "slno", headerName: "SlNo" },
    { field: "id", headerName: "User Id" },
    { field: "username", headerName: "Username" },
    { field: "phone", headerName: "Phone" },
    { field: "language", headerName: "Language" },
    {
      field: "heartBalance",
      headerName: "Heart Balance",
      renderCell: (params) => {
        const isEditing = params.id === editingUserId;
        return isEditing ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={editedHeartBalance}
              onChange={(e) => setEditedHeartBalance(e.target.value)}
              variant="standard"
              placeholder="Enter amount"
              type="number"
              size="small"
              slotProps={{
                htmlInput: {
                  style: {
                    width: "auto",
                    minWidth: "40px",
                    maxWidth: "120px",
                  },
                },
                input: {
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        mb: 0.6,
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          setBalanceOperation(
                            balanceOperation === "add" ? "subtract" : "add"
                          )
                        }
                        size="small"
                      >
                        {balanceOperation === "add" ? <Plus /> : <Minus />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleHeartBalanceChange(params.id)}
                        color="primary"
                        size="small"
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditingUserId(null);
                          setEditedHeartBalance("");
                          setBalanceOperation("add");
                        }}
                        color="primary"
                        size="small"
                      >
                        <X />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        ) : (
          params.value
        );
      },
    },
    { field: "status", headerName: "Status" },
    {
      field: "connectStatus",
      headerName: "Connect Status",
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case "online":
              return theme.palette.success.main;
            case "incall":
              return theme.palette.error.main;
            case "offline":
              return "#111827";
            default:
              return "#9ca3af";
          }
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Circle size={12} weight="fill" color={getStatusColor(params)} />
            <Typography>{params}</Typography>
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setEditingUserId(params);
            setEditedHeartBalance("");
            setBalanceOperation("add");
          }}
        >
          <Pencil />
        </IconButton>
      ),
    },
  ];

  return (
    <LoadingBackdrop open={isLoading}>
      <FormControl
        variant="outlined"
        sx={{
          marginBottom: 3,
        }}
      >
        <InputLabel>Language</InputLabel>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          label="Language"
          size={"small"}
        >
          {languagesData?.data?.languages?.map((language) => (
            <MenuItem key={language.language} value={language.language}>
              {language.language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        count={data?.data?.pagination?.totalPages || 1}
        page={page}
        color="primary"
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
        onChange={handlePageChange}
      />

      <DataTable columns={columns} rows={rows || []} />
      {(!rows || rows.length <= 0) && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}

      <Pagination
        count={data?.data?.pagination?.totalPages || 1}
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
        onChange={handlePageChange}
      />
    </LoadingBackdrop>
  );
};

export default HostUsers;
