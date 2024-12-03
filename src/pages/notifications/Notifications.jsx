import { Box, Button, IconButton, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import TopAddNewBar from "../../components/TopAddNewBar";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllNotifications } from "../../service/allApi";
import { Pencil, Trash } from "@phosphor-icons/react";

const Notifications = () => {
  const [notifications, setAllNotifications] = useState([]);
  const [validationErrors, setValidationErrors] = useState();

  const theme = useTheme();
  const navigte = useNavigate();

  const fetchAllNotifications = async () => {
    const response = await getAllNotifications();
    console.log(response);
    if (response.status === 200) {
      setAllNotifications(response?.data?.data);
    }
  };

  const columns = [
    { field: "slno", headerName: "#" },
    { field: "title", headerName: "Title" },
    { field: "description", headerName: "Description" },
    {
      field: "image",
      headerName: "Image",
      renderCell: (value) => (
        <img src={value} alt="img unavilable" style={{ width: "50px" }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (value) => (
        <>
          <IconButton>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton aria-describedby="delete-pop">
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
          <Button variant="contained" size="small" sx={{ ml: 1 }}>
            Send
          </Button>
        </>
      ),
    },
  ];

  const formatedNotifications = () => {
    return notifications?.map((notification, ind) => ({
      id: notification?._id,
      slno: ind + 1,
      title: notification?.title,
      description: notification?.description,
      image: notification?.image,
    }));
  };

  const formattedRows = formatedNotifications();

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <>
      <Box
        sx={{
          padding: "25px",
          backgroundColor: theme.palette.secondary.light,
          borderRadius: "10px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "16px" }}>
          Notification API
        </span>
        <InputField
          styles={{
            flexGrow: { xs: 1, sm: 0.3 },
          }}
          value={""}
          error={validationErrors}
          setError={setValidationErrors}
          name={""}
        />
        <Button variant="contained">Update</Button>
      </Box>
      <TopAddNewBar
        label={"Push Notification List"}
        onAddButtonClick={() => navigte("/notifications/addnew")}
      />
      <DataTable columns={columns} rows={formattedRows} />
    </>
  );
};

export default Notifications;
