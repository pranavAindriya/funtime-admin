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
  min,
  max,
}) => {
  const handleInputChange = (event) => {
    let inputValue = event.target.value;

    if (type === "phone" || type === "id") {
      inputValue = inputValue.replace(/\D/g, "");
      event.target.value = inputValue;
    }

    switch (type) {
      case "email":
        if (!isValidEmail(inputValue)) {
          setError("Invalid email");
        } else {
          setError(null);
        }
        break;

      case "password":
        if (!isValidPassword(inputValue)) {
          setError("Password must be at least 8 characters long");
        } else {
          setError(null);
        }
        break;

      case "phone":
        if (!isValidPhoneNumber(inputValue)) {
          setError("Phone number must be 10 digits long");
        } else {
          setError(null);
        }
        break;

      case "text":
        if (inputValue.length < 2) {
          setError("Text input must have at least 1 character");
        } else {
          setError(null);
        }
        break;

      case "id":
        if (!isValidId(inputValue)) {
          setError("Invalid ID. It must be a number with at least 1 character");
        } else {
          setError(null);
        }
        break;

      case "number":
        if (!isValidNumber(inputValue, min, max)) {
          setError(
            `Number must be between ${min || 0} and ${max || "unlimited"}`
          );
        } else {
          setError(null);
        }
        break;

      case "date":
        if (!isValidDate(inputValue)) {
          setError("Invalid date format. Please use YYYY-MM-DD");
        } else {
          setError(null);
        }
        break;
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

  const isValidNumber = (number, min, max) => {
    // Convert to number, handling empty string
    const numValue = number === "" ? NaN : Number(number);

    // Check if it's a valid number
    if (isNaN(numValue)) return false;

    // Check minimum value if provided
    if (min !== undefined && numValue < min) return false;

    // Check maximum value if provided
    if (max !== undefined && numValue > max) return false;

    return true;
  };

  const isValidDate = (dateString) => {
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    // Additional validation to ensure it's a valid date
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
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
