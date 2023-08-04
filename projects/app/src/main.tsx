import "./index.css"

import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import React from "react"
import ReactDOM from "react-dom/client"

import { App } from "./App.tsx"
import { theme } from "./themes/theme.ts"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CssBaseline>
  </ThemeProvider>
)
