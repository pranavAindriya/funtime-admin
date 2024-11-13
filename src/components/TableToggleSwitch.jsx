import { Switch } from "@mui/material";
import React from "react";

const TableToggleSwitch = ({ value, onChange, name }) => {
  return (
    <div>
      <Switch
        name={name}
        color="success"
        checked={value}
        disableRipple
        onChange={onChange}
      />
    </div>
  );
};

export default TableToggleSwitch;
