import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DataTable from "../../../Components/DataTable";

const initialRows = [
  {
    userid: "1",
    username: "John Doe",
    phone: "1234567890",
    kycStatus: "Pending",
  },
  {
    userid: "2",
    username: "Jane Smith",
    phone: "0987654321",
    kycStatus: "Approved",
  },
  {
    userid: "3",
    username: "Sam Brown",
    phone: "1122334455",
    kycStatus: "Declined",
  },
];

const KycRequests = () => {
  const [rows, setRows] = useState(initialRows);

  const handleApprove = (userid) => {
    setRows(
      rows.map((row) =>
        row.userid === userid ? { ...row, kycStatus: "Approved" } : row
      )
    );
  };

  const handleDecline = (userid) => {
    setRows(
      rows.map((row) =>
        row.userid === userid ? { ...row, kycStatus: "Declined" } : row
      )
    );
  };

  const columns = [
    { field: "userid", headerName: "Userid" },
    { field: "username", headerName: "Username" },
    { field: "phone", headerName: "Phone" },
    { field: "kycStatus", headerName: "Kyc Status" },
    {
      field: "action",
      headerName: "Action",
      renderCell: (value, row) => (
        <Box display={"flex"} marginLeft={"auto"}>
          <Button size="small" variant="contained" color="info" sx={{ mr: 1 }}>
            View
          </Button>
          {row.kycStatus === "Pending" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                sx={{ mr: 1 }}
                onClick={() => handleApprove(row.userid)}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleDecline(row.userid)}
              >
                Decline
              </Button>
            </>
          )}
          {row.kycStatus === "Approved" && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDecline(row.userid)}
            >
              Decline
            </Button>
          )}
          {row.kycStatus === "Declined" && (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleApprove(row.userid)}
            >
              Approve
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default KycRequests;
