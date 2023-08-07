import React, { createContext } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

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

export const EncryptionKeyContext = createContext({
  encryptionKey: "",
  // eslint-disable-next-line no-unused-vars
  setEncryptionKey: (_key: string) => {},
})

export const App: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = React.useState("")

  const value = { encryptionKey, setEncryptionKey }

  return (
    <EncryptionKeyContext.Provider value={value}>
      <RouterProvider router={router} />
    </EncryptionKeyContext.Provider>
  )
}
