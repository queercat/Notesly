import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#141212",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: "#FFD1D1",
          color: "#000000",
          fontWeight: 700,
        },
      },
    },
  },
})
