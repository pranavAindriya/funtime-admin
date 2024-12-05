import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { Trash, X } from "@phosphor-icons/react";
import {
  getAllReportReasons,
  createNewReportReason,
  deleteReportReason,
} from "../../service/allApi";
import DataTable from "../../components/DataTable";
import TopAddNewBar from "../../components/TopAddNewBar";
import TableToggleSwitch from "../../components/TableToggleSwitch";

const ReportAndBlock = () => {
  const [reportReasons, setAllReportReasons] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newReason, setNewReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAllReportReasons = async () => {
    try {
      const response = await getAllReportReasons();
      if (response?.status === 200) {
        setAllReportReasons(response?.data?.data);
      }
    } catch (err) {
      showSnackbar("Failed to fetch report reasons", "error");
    }
  };

  useEffect(() => {
    fetchAllReportReasons();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCreateReason = async () => {
    try {
      if (!newReason.trim()) {
        showSnackbar("Please enter a valid reason", "error");
        return;
      }

      const response = await createNewReportReason({ reason: newReason });
      if (response?.status === 201) {
        showSnackbar("Report reason created successfully");
        setNewReason("");
        setOpenAddModal(false);
        fetchAllReportReasons();
      }
    } catch (err) {
      showSnackbar("Failed to create report reason", "error");
    }
  };

  const handleDeleteReason = async () => {
    try {
      const response = await deleteReportReason(selectedReport);
      if (response?.status === 200) {
        showSnackbar("Report reason deleted successfully");
        setOpenDeleteModal(false);
        fetchAllReportReasons();
      }
    } catch (err) {
      showSnackbar("Failed to delete report reason", "error");
    }
  };

  const columns = [
    {
      field: "slno",
      headerName: "slNo",
    },
    {
      field: "item",
      headerName: "Item",
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value) => <TableToggleSwitch value={value} />,
    },
    {
      field: "edit",
      headerName: "Actions",
      renderCell: (id) => (
        <IconButton
          onClick={() => {
            setSelectedReport(id);
            setOpenDeleteModal(true);
          }}
          color="error"
        >
          <Trash />
        </IconButton>
      ),
    },
  ];

  const formatReportingREasons = () => {
    return reportReasons?.map((reason, ind) => ({
      id: reason._id,
      slno: ind + 1,
      item: reason.reason,
      status: reason.isActive,
      edit: reason._id,
    }));
  };

  return (
    <div>
      <TopAddNewBar
        label="Reporting Reason"
        onAddButtonClick={() => setOpenAddModal(true)}
      />

      <DataTable columns={columns} rows={formatReportingREasons()} />

      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          New Reason
          <IconButton onClick={() => setOpenAddModal(false)} size="small">
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: "20px" }}>
            <TextField
              fullWidth
              label="Reason"
              size="small"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpenAddModal(false)}
                sx={{ color: "grey.700", borderColor: "grey.300" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateReason}
                color="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Delete
          <IconButton onClick={() => setOpenDeleteModal(false)} size="small">
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
              Are you sure you want to delete this report reason?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpenDeleteModal(false)}
                sx={{ color: "grey.700", borderColor: "grey.300" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteReason}
                color="error"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportAndBlock;
