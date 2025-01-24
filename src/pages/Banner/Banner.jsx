import React from "react";
import DataTable from "../../components/DataTable";
import TopAddNewBar from "../../components/TopAddNewBar";
import { IconButton } from "@mui/material";
import { ArrowLeft, Pencil, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";

const Banner = () => {
  const navigate = useNavigate();

  const columns = [
    { field: "slNo", headerName: "SlNo" },
    { field: "content", headerName: "Content" },
    { field: "link", headerName: "Link" },
    { field: "status", headerName: "Status" },
    {
      field: "Actions",
      headerName: "actions",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`edit/${params}`)}>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton onClick={() => openDeleteConfirmation(params)}>
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
    <div>
      <TopAddNewBar
        label={
          // <>
          //   <IconButton
          //     onClick={() => navigate(-1)}
          //     sx={{
          //       mr: 1,
          //     }}
          //   >
          //     <ArrowLeft />
          //   </IconButton>
          //   <span>Add New Banner</span>
          // </>
          "Banner"
        }
        hasAccess={hasAccess}
        onAddButtonClick={() => navigate("addnewbanner")}
        disableAddNewButton={!hasAccess}
      />
      <DataTable columns={columns} />
    </div>
  );
};

export default Banner;
