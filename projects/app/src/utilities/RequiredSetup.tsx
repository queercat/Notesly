import React from "react"
import { Navigate } from "react-router-dom"

import { useIsSetup } from "../hooks/useIsSetup"

interface RequiredSetupProps extends React.PropsWithChildren {
  redirectUrl?: string
  redirectSetupState?: boolean
}

export const RequiredSetup: React.FC<RequiredSetupProps> = ({
  children,
  redirectUrl,
  redirectSetupState,
}) => {
  const { isSetup, isLoading } = useIsSetup()

  if (isLoading) {
    return <></>
  }

  if (!redirectSetupState ? !isSetup : redirectSetupState == isSetup) {
    return <Navigate to={redirectUrl ?? "/setup"} />
  }

  return <>{children}</>
}
