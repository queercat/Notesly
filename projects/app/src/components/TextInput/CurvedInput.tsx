import { styled, TextField, TextFieldProps } from "@mui/material"
import React from "react"

type CurvedInputProps = {
  hasError?: boolean
} & TextFieldProps

const StyledCurvedInput = styled(TextField)(({ theme }) => ({
  borderRadius: theme.spacing(1),

  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(5),
    display: "flex",
    padding: theme.spacing(0, 2),
  },

  "& .MuiOutlinedInput-input": {
    textAlign: "center",
  },
}))

export const CurvedInput: React.FC<CurvedInputProps> = ({
  hasError,
  ...props
}) => {
  if (hasError) {
    return <StyledCurvedInput error {...props} />
  }

  return <StyledCurvedInput {...props} />
}
