import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import ConfirmationPopover from "../../Components/ConfirmationPopover";
import { Pencil, Trash } from "@phosphor-icons/react";
import TopAddNewBar from "../../components/TopAddNewBar";
import { useNavigate } from "react-router-dom";
import { getPrivacyPolicies } from "../../service/allApi";

const CMSPage = () => {
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const theme = useTheme();

  const navigate = useNavigate();

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const deleteRow = () => {
    setRows(rows.filter((row) => row.slno !== selectedRow.slno));
    handleClose();
  };

  const fetchAllPrivacyPolicies = async () => {
    const response = await getPrivacyPolicies();
    if (response.status === 200) {
      setRows(
        response?.data?.map((data, index) => ({
          ...data,
          number: index + 1,
          order: index + 1,
          status: "active",
        }))
      );
    }
  };

  useEffect(() => {
    fetchAllPrivacyPolicies();
  }, []);

  const columns = [
    { field: "number", headerName: "Sl. No" },
    { field: "title", headerName: "Policy Name" },
    { field: "order", headerName: "Order" },
    { field: "status", headerName: "Status" },
    {
      field: "_id",
      headerName: "Edit",
      renderCell: (value, row) => (
        <Box>
          <IconButton onClick={() => navigate(`/cms/edit/${value}`)}>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton
            aria-describedby="delete-pop"
            onClick={(e) => handleClick(e, row)}
          >
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <TopAddNewBar
        label={"Policies"}
        onAddButtonClick={() => navigate("/cms/addnew")}
      />
      <DataTable columns={columns} rows={rows} />
      <ConfirmationPopover
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleConfirm={deleteRow}
      />
    </Box>
  );
};

export default CMSPage;
