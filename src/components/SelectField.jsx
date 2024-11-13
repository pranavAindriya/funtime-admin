import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

const SelectField = ({ name, onChange, value, options }) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          size="small"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          name={name}
          onChange={onChange}
          inputProps={{
            "aria-label": "Without label",
            style: {
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "transparent",
              color: "black",
            },
          }}
          sx={{
            borderRadius: "5px",
            backgroundColor: "transparent",
            ".MuiSelect-icon": {
              color: "black",
            },
          }}
        >
          {options?.map((item) => (
            <MenuItem value={item.value ? item.value : item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectField;
