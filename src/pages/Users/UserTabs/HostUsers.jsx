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
} from "@mui/material";
import {
  Pencil,
  Check,
  X,
  PlusCircle,
  MinusCircle,
  Plus,
  Minus,
} from "@phosphor-icons/react";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const HostUsers = () => {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedHeartBalance, setEditedHeartBalance] = useState("");
  const [balanceOperation, setBalanceOperation] = useState("add");
  const [selectedLanguage, setSelectedLanguage] = useState("Malayalam");

  const { data: languagesData } = useQuery({
    queryKey: ["languages"],
    queryFn: getAllLanguages,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hostUsers", selectedLanguage],
    queryFn: () => getAllHostUsers(selectedLanguage),
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
  };

  const rows = data?.data?.data.map((data) => ({
    id: data._id,
    username: data?.username,
    phone: data?.mobileNumber,
    language: data?.profile?.language,
    heartBalance: { id: data?._id, value: data?.profile?.fullheartBalance },
    status: data?.status,
    connectStatus: data?.connectStatus,
    action: data?._id,
  }));

  const columns = [
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
    { field: "connectStatus", headerName: "Connect Status" },
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
        >
          {languagesData?.data?.languages?.map((language) => (
            <MenuItem key={language.language} value={language.language}>
              {language.language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DataTable columns={columns} rows={rows} />
      {rows?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
    </LoadingBackdrop>
  );
};

export default HostUsers;
