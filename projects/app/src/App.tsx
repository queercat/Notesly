import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { EncryptionKeyContext } from "./contexts/EncryptionKeyContext"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { SetupPage } from "./pages/SetupPage"
import { ProtectedRoute } from "./utilities/ProtectedRoute"
import { RequiredSetup } from "./utilities/RequiredSetup"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <RequiredSetup>
        <LoginPage />
      </RequiredSetup>
    ),
  },
  {
    path: "/setup",
    element: (
      <RequiredSetup redirectSetupState={true} redirectUrl="/login">
        <SetupPage />
      </RequiredSetup>
    ),
  },
])

export const App: React.FC = () => {
  const [key, setKey] = React.useState("")
  const value = React.useMemo(() => ({ key, setKey }), [key, setKey])

  return (
    <EncryptionKeyContext.Provider value={value}>
      <RouterProvider router={router} />
    </EncryptionKeyContext.Provider>
  )
}
