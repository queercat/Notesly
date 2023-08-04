import { styled } from "@mui/material"
import React from "react"

interface StaticFieldProps extends React.PropsWithChildren {}

const StyledH1 = styled("h1")(({ theme }) => ({
  color: theme.palette.text.primary,
}))

export const _StaticField: React.FC<StaticFieldProps> = ({
  children,
  ...props
}) => {
  return <StyledH1 {...props}>{children}</StyledH1>
}
