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
import { useSelector } from "react-redux";
import { hasPermission, isModuleBlocked } from "../../redux/slices/authSlice";
import LoadingBackdrop from "../../components/LoadingBackdrop";

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const fetchAllLanguages = async () => {
    setIsLoading(true);
    const response = await getAllLanguages();
    if (response.status === 200) {
      setLanguages(response.data.languages);
    }
    setIsLoading(false);
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

  const hasAccess = useSelector((state) =>
    hasPermission(state, "Language", "readAndWrite")
  );

  const columns = [
    { field: "slno", headerName: "#" },
    { field: "language", headerName: "Language" },
    { field: "users", headerName: "Users" },
    hasAccess && {
      field: "actions",
      headerName: "Actions",
      renderCell: (value) => (
        <>
          <IconButton onClick={() => navigate(`/language/edit/${value}`)}>
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
      id: language?._id,
      slno: ind + 1,
      language: language?.language,
      users: language?.count,
      actions: language?._id,
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

  const isBlocked = useSelector((state) => isModuleBlocked(state, "Language"));

  if (isBlocked) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h4">
          You do not have access to this page
        </Typography>
      </Box>
    );
  }

  return (
    <LoadingBackdrop open={isLoading}>
      <TopAddNewBar
        label={"Language List"}
        onAddButtonClick={() => navigate("/language/add")}
        hasAccess={hasAccess}
      />
      <DataTable columns={columns} rows={formattedLanguageData} />
      {formattedLanguageData?.length <= 0 && (
        <Typography textAlign={"center"} my={5}>
          No data found
        </Typography>
      )}
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
    </LoadingBackdrop>
  );
};

export default LanguageList;
