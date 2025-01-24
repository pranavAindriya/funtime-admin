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
} from "@mui/material";
import { Pencil, Check, X } from "@phosphor-icons/react";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const HostUsers = () => {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedHeartBalance, setEditedHeartBalance] = useState(null);
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
      setEditedHeartBalance(null);
    },
  });

  const handleHeartBalanceChange = (userId) => {
    if (editedHeartBalance !== null) {
      updateHeartBalanceMutation.mutate({
        userId,
        heart: parseFloat(editedHeartBalance),
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
          <>
            <TextField
              value={editedHeartBalance ?? params.value}
              onChange={(e) => setEditedHeartBalance(e.target.value)}
              variant="standard"
              size="small"
              slotProps={{
                input: {
                  style: {
                    width: "auto",
                    minWidth: "40px",
                    maxWidth: "120px",
                    textAlign: "center",
                  },
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
                          setEditedHeartBalance(null);
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
          </>
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
            setEditedHeartBalance(null);
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
    </LoadingBackdrop>
  );
};

export default HostUsers;
