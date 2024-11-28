import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Switch,
  Typography,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import {
  createNewLanguage,
  deleteSingleLaguage,
  getAllLanguages,
} from "../../service/allApi";
import theme from "../../../theme";
import TopAddNewBar from "../../components/TopAddNewBar";
import TableToggleSwitch from "../../components/TableToggleSwitch";
import ConfirmationPopover from "../../components/ConfirmationPopover";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
};

const LanguageList = () => {
  const [languages, setLanguages] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [validationError, setValidationError] = useState();
  const [newLanguageData, setNewLanguageData] = useState({
    language: "",
    languageCode: "",
    status: true,
  });

  const navigate = useNavigate();

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const fetchAllLanguages = async () => {
    const response = await getAllLanguages();
    console.log(response.data);

    setLanguages(response.data);
  };

  const deleteLanguage = async () => {
    const response = await deleteSingleLaguage(selectedId);
    fetchAllLanguages();
    handleClose();
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    { field: "slno", headerName: "#" },
    { field: "language", headerName: "Language" },
    {
      field: "image",
      headerName: "Image",
      renderCell: (value) => (
        <img src={value} alt="img unavilable" style={{ width: "50px" }} />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value) => <TableToggleSwitch value={value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (value) => (
        <>
          <IconButton>
            <Pencil size={20} color={theme.palette.info.main} />
          </IconButton>
          <IconButton
            aria-describedby="delete-pop"
            onClick={(e) => handleClick(e, value)}
          >
            <Trash size={20} color={theme.palette.error.main} />
          </IconButton>
        </>
      ),
    },
  ];

  const formatLanguagesForDataTable = () => {
    return languages?.map((language, ind) => ({
      id: language._id,
      slno: ind + 1,
      language: language.language,
      image: language.avatar,
      status: language.status,
      actions: language._id,
    }));
  };

  const formattedLanguageData = formatLanguagesForDataTable();

  const onInputFieldChange = (e) => {
    const { name, value } = e.target;
    setNewLanguageData((data) => ({ ...data, [name]: value }));
  };

  const handleAddNewLanguage = async () => {
    const response = await createNewLanguage();
  };

  useEffect(() => {
    fetchAllLanguages();
  }, []);

  return (
    <div>
      <TopAddNewBar
        label={"Language List"}
        onAddButtonClick={() => navigate("/language/add")}
      />
      <DataTable columns={columns} rows={formattedLanguageData} />
      <ConfirmationPopover
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleConfirm={deleteLanguage}
      />
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            padding: "30px",
            width: "420px",
            display: "grid",
            gap: "20px",
          }}
        >
          <Typography
            variant="h6"
            textAlign={"center"}
            sx={{ marginBottom: "10px" }}
          >
            Add New Language
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">Language</Typography>
            <InputField
              placeholder={"Enter Language"}
              name={"language"}
              onChange={onInputFieldChange}
              error={validationError}
              setError={setValidationError}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">Language Code</Typography>
            <InputField
              onChange={onInputFieldChange}
              placeholder={"eg: en for English"}
              name={"languageCode"}
              error={validationError}
              setError={setValidationError}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">Status</Typography>
            <Box
              sx={{
                width: "130px",
              }}
            >
              <Switch
                name="status"
                onChange={(e) => {
                  setNewLanguageData((data) => ({
                    ...data,
                    status: e.target.checked,
                  }));
                }}
              />
            </Box>
          </Box>

          <Button>Save</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default LanguageList;