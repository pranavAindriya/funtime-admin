import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif", // Updated to match the design's font
  },
  palette: {
    primary: {
      main: "#0E1B54", // Dark blue from sidebar
      light: "#2F80ED", // Blue used in buttons/actions
    },
    secondary: {
      main: "#FFFFFF", // Light pink background for cards
      light: "#F5F5F5", // White background
    },
    error: {
      main: "#FF4B4B", // Red for delete actions
    },
    success: {
      main: "#4CAF50", // Green for approved status
    },
    info: {
      main: "#2F80ED", // Blue for actions/links
      light: "#E8F0FE", // Light blue background
    },
    warning: {
      main: "#F2994A", // Orange for warnings
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
      secondary: "#F8FAFC",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#64748B",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#2F80ED",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        },
        containedSecondary: {
          backgroundColor: "#FFE7F9",
          color: "#0E1B54",
          "&:hover": {
            backgroundColor: "#FFD6FB",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0E1B54",
          color: "#FFFFFF",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
