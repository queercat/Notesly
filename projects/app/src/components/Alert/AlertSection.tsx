import { Box, BoxProps, styled } from "@mui/material"
import React from "react"

interface AlertSectionProps extends React.PropsWithChildren, BoxProps {}

const AlertContainer = styled(Box)(({ theme }) => ({
  width: "100%",

  position: "absolute",
  display: "flex",

  padding: theme.spacing(4, 0),

  bottom: 0,
}))

export const AlertSection: React.FC<AlertSectionProps> = ({
  children,
  ...props
}) => {
  return <AlertContainer {...props}>{children}</AlertContainer>
}
