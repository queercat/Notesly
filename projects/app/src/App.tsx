import { Box, styled } from "@mui/material"
import React from "react"

const StyledBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
}))

export const App: React.FC = () => {
  return <StyledBackground />
}
