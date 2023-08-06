import { Box, styled } from "@mui/material"

export const AuthContainer = styled(Box)(({ theme }) => ({
  height: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: theme.spacing(2),

  "& .caption": {
    color: theme.palette.primary.main,
  },

  "& h1": {
    fontSize: "3rem",
    fontWeight: 700,
  },

  "& button": {
    textTransform: "none",
    fontWeight: 700,
  },
}))
