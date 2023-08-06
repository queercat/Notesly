import React from "react"
import { Navigate } from "react-router-dom"

import { useIsAuthorized } from "../hooks/useIsAuthorized.tsx"

interface ProtectedRouteProps extends React.PropsWithChildren {}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthorized, isLoading } = useIsAuthorized()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthorized) {
    return <Navigate to={"/login"} />
  }

  return <>{children}</>
}
