import React from "react"
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

interface AppProps {}

export const App: React.FC<AppProps> = () => {
  return <RouterProvider router={router} />
}
