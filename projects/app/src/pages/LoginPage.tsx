import { Alert, Box } from "@mui/material"
import React from "react"
import srp from "secure-remote-password/client"

import { AlertSection } from "../components/Alert/AlertSection"
import { CurvedButton } from "../components/Button/CurvedButton"
import { CurvedInput } from "../components/TextInput/CurvedInput"
import { useSrpAuthorization } from "../hooks/useSrpAuthorization"
import { AuthContainer } from "./AuthContainer"

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = ({ ...props }) => {
  const [key, setKey] = React.useState("")
  const [errorText, setErrorText] = React.useState("")
  const { startMutate, completeMutate, validate, result } =
    useSrpAuthorization()

  const handleSubmit = async () => {
    const clientEphemeral = srp.generateEphemeral()

    let result = await startMutate(clientEphemeral.public)

    const { serverEphemeralPublic, salt } = result

    if (!serverEphemeralPublic || !salt) {
      setErrorText("Something went wrong.")
      return
    }

    const clientSession = srp.deriveSession(
      clientEphemeral.secret,
      serverEphemeralPublic,
      salt,
      "",
      key
    )

    result = await completeMutate(clientSession.proof)
  }

  return (
    <>
      <AuthContainer {...props}>
        <h1>
          Note<span className="caption">sly</span>
        </h1>
        <CurvedInput
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <CurvedButton variant="contained" onClick={handleSubmit}>
          Unlock
        </CurvedButton>
      </AuthContainer>

      <AlertSection visibility={errorText ? "visible" : "hidden"}>
        <Box
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Alert severity="error">{errorText}</Alert>
        </Box>
      </AlertSection>
    </>
  )
}
