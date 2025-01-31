import React, { useState } from "react";
import DataTable from "../../components/DataTable";
import TopAddNewBar from "../../components/TopAddNewBar";
import {
  IconButton,
  Switch,
  useTheme,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { ArrowLeft, Pencil, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBanner,
  updateBannerStatus,
  deleteBannerList,
} from "../../service/allApi";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { Slide, toast } from "react-toastify";

const Banner = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [loadingStatusIds, setLoadingStatusIds] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["banner"],
    queryFn: getAllBanner,
  });

  const updateBannerStatusMutation = useMutation({
    mutationFn: updateBannerStatus,
    onMutate: (variables) => {
      // Add the current banner ID to loading state before mutation
      setLoadingStatusIds((prev) => [...prev, variables.id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Banner status updated successfully", {
        autoClose: 1000,
        transition: Slide,
      });
    },
    onError: (error) => {
      toast.error("Failed to update banner status", {
        autoClose: 1000,
        transition: Slide,
      });
      console.error(error);
    },
    onSettled: (_, __, variables) => {
      // Remove the current banner ID from loading state after mutation completes
      setLoadingStatusIds((prev) => prev.filter((id) => id !== variables.id));
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: deleteBannerList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
      toast.success("Banner deleted successfully", {
        autoClose: 1000,
        transition: Slide,
      });
      setDeleteConfirmationOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to delete banner"),
        {
          autoClose: 1000,
          transition: Slide,
        };
      console.error(error);
    },
  });

  const handleStatusChange = (id, newStatus) => {
    updateBannerStatusMutation.mutate({
      id,
      status: newStatus,
    });
  };

  const handleDeleteClick = (id) => {
    setBannerToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bannerToDelete) {
      deleteBannerMutation.mutate(bannerToDelete);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setBannerToDelete(null);
  };

  const rows = data?.data?.map((data, ind) => ({
    slNo: ind + 1,
    content: { type: data?.type, content: data?.content },
    link: data?.link,
    status: { id: data?._id, status: data?.status },
    type: data?.type,
    actions: data?._id,
  }));

  const columns = [
    { field: "slNo", headerName: "SlNo" },
    {
      field: "content",
      headerName: "Content",
      renderCell: (params) => (
        <>
          {params.type === "image" ? (
            <img
              src={params.content}
              style={{ width: 50, height: 50 }}
              alt="Banner"
            />
          ) : (
            <p>{params.content}</p>
          )}
        </>
      ),
    },
    { field: "link", headerName: "Link" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <Switch
          checked={params?.status}
          disabled={loadingStatusIds.includes(params.id)}
          onChange={(e) => handleStatusChange(params.id, e.target.checked)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`edit/${params}`)}>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params)}>
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
        </>
      ),
    },
  ];

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Banner", "readAndWrite")
  );

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Banner"));

  if (isBlocked) {
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
    <LoadingBackdrop open={isLoading}>
      <TopAddNewBar
        label="Banner"
        hasAccess={hasAccess}
        onAddButtonClick={() => navigate("addnewbanner")}
        disableAddNewButton={!hasAccess}
      />

      <DataTable columns={columns} rows={rows} />
      {rows?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle id="delete-confirmation-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </LoadingBackdrop>
  );
};

export default Banner;
