import { Box, InputBase } from "@mui/material";
import React, { useState } from "react";
import theme from "../../theme";

const InputField = ({
  onChange,
  type,
  value,
  placeholder,
  multiline,
  rows,
  styles,
  error,
  setError,
  name,
  endAdornment,
  startAdornment,
  fullWidth,
  disabled,
}) => {
  const handleInputChange = (event) => {
    let inputValue = event.target.value;

    if (type === "phone" || type === "id") {
      inputValue = inputValue.replace(/\D/g, "");
      event.target.value = inputValue;
    }
    if (type === "email" && !isValidEmail(inputValue)) {
      setError("Invalid email");
    } else if (type === "password" && !isValidPassword(inputValue)) {
      setError("Password must be at least 8 characters long");
    } else if (type === "phone" && !isValidPhoneNumber(inputValue)) {
      setError("Phone number must be 10 digits long");
    } else if (type === "text" && inputValue.length < 2) {
      setError("Text input must have at least 1 character");
    } else if (type === "id" && !isValidId(inputValue)) {
      setError("Invalid ID. It must be a number with at least 1 character");
    } else {
      setError(null);
    }
    onChange(event);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const isValidId = (id) => {
    const idRegex = /^[0-9]+$/;
    return idRegex.test(id);
  };

  const borderColour = error ? theme.palette.error.main : "#7f7f7f";

  return (
    <InputBase
      disabled={disabled}
      name={name}
      type={type}
      value={value}
      multiline={multiline}
      onChange={handleInputChange}
      rows={rows}
      placeholder={placeholder}
      fullWidth={fullWidth}
      sx={{
        ...styles,
        border: `${borderColour} 1.5px solid`,
        borderRadius: "5px",
        color: "black",
        paddingInline: "10px",
        paddingBlock: "2px",
        backgroundColor: "transparent",
      }}
      endAdornment={endAdornment}
      startAdornment={startAdornment}
    />
  );
};

export default InputField;
