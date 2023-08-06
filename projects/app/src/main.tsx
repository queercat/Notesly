import "./index.css"

import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { HomePage } from "./pages/HomePage.tsx"
import { LoginPage } from "./pages/LoginPage.tsx"
import { SetupPage } from "./pages/SetupPage.tsx"
import { theme } from "./themes/theme.ts"
import { ProtectedRoute } from "./utilities/ProtectedRoute.tsx"
import { RequiredSetup } from "./utilities/RequiredSetup.tsx"

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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ThemeProvider>
)
