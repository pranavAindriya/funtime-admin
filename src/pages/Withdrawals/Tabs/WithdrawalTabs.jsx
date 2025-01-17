import React from "react";
import DataTable from "../../../components/DataTable";
import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { changeWithdrawalStatus } from "../../../service/allApi";
import { Slide, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../redux/slices/authSlice";

const WithdrawalTabs = ({ type, rows, data, setRows }) => {
  const theme = useTheme();

  const handleStatusChange = async (id, newStatus) => {
    const originalRows = [...data];

    const updatedRows = data.filter((row) => row._id !== id);
    setRows(updatedRows);

    try {
      const response = await changeWithdrawalStatus(id, newStatus);
      if (response.status === 200) {
        toast.success("Status updated successfully!", {
          autoClose: 1000,
          transition: Slide,
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      setRows(originalRows);
      toast.error("Failed to update status. Please try again.", {
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Withdrawal", "readAndWrite")
  );

  const columns = [
    { field: "slno", headerName: "SlNo" },
    { field: "userId", headerName: "User ID" },
    { field: "username", headerName: "Username" },
    { field: "time", headerName: "Time" },
    { field: "amount", headerName: "Amount" },
    hasAccess && {
      field: "status",
      headerName: "Status",
      renderCell: (row) => (
        <FormControl>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            disableUnderline
            slotProps={{
              input: {
                sx: {
                  backgroundColor: () => {
                    switch (row.status) {
                      case "rejected":
                        return theme.palette.error.main;
                      case "pending":
                        return theme.palette.warning.main;
                      case "approved":
                        return theme.palette.success.main;
                      default:
                        return "inherit";
                    }
                  },
                  color: () => {
                    switch (row.status) {
                      case "rejected":
                      case "approved":
                        return theme.palette.common.white;
                      default:
                        return "inherit";
                    }
                  },
                },
                size: "small",
              },
            }}
          >
            <MenuItem value="rejected">Reject</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem
              value="pending"
              sx={{
                display: "none",
              }}
            >
              Pending
            </MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={rows} />
      {rows.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
    </>
  );
};

export default WithdrawalTabs;
