import { Box, Button, IconButton } from "@mui/material";
import { ArrowLeft, Plus, Trash } from "@phosphor-icons/react";
import React from "react";
import theme from "../../theme";

const CreateNewTopBar = ({
  label,
  onBackButtonClick,
  onAddButtonClick,
  onDeleteButtonClick,
  buttonStyles,
  disableDeleteButton,
  disableAddButton,
}) => {
  return (
    <>
      <Box
        sx={{
          paddingBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton onClick={onBackButtonClick}>
            <ArrowLeft size={28} color="black" />
          </IconButton>
          <span style={{ fontWeight: 700, fontSize: "18px" }}>{label}</span>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            ml: "auto",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteButtonClick}
            disabled={disableDeleteButton}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              ...buttonStyles,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
            onClick={onAddButtonClick}
            disabled={disableAddButton}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateNewTopBar;
