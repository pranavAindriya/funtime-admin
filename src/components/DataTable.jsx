import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const DataTable = ({ columns, rows }) => {
  return (
    <Paper sx={{ borderRadius: "10px" }}>
      <TableContainer sx={{ borderRadius: "10px" }}>
        <Table size="small" aria-label="simple table">
          <TableHead sx={{ backgroundColor: "black" }}>
            <TableRow>
              {columns?.map((column) => (
                <TableCell key={column.field} sx={{ color: "white" }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <TableRow key={index}>
                {columns?.map((column) => (
                  <TableCell size="medium" key={column.field}>
                    {column.renderCell
                      ? column.renderCell(row[column.field], row)
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;
