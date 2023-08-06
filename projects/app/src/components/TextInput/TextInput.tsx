import { styled, TextField, TextFieldProps } from "@mui/material"
import React from "react"

export type TextInputProps = {} & TextFieldProps

const StyledInput = styled(TextField)(() => ({}))

export const TextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return <StyledInput {...props} />
}
