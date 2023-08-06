import { Button, ButtonProps, styled } from "@mui/material"
import React from "react"

interface CurvedButtonProps extends ButtonProps {}

const StyledCurvedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(5),
  padding: theme.spacing(1, 4),
}))

export const CurvedButton: React.FC<CurvedButtonProps> = ({ ...props }) => {
  return <StyledCurvedButton {...props} />
}
