import { Alert, Box } from "@mui/material"
import * as cryptojs from "crypto-js"
import React from "react"
import { useNavigate } from "react-router-dom"
import srp from "secure-remote-password/client"

import { AlertSection } from "../components/Alert/AlertSection"
import { CurvedButton } from "../components/Button/CurvedButton"
import { CurvedInput } from "../components/TextInput/CurvedInput"
import { EncryptionKeyContext } from "../contexts/EncryptionKeyContext"
import { useIsAuthorized } from "../hooks/useIsAuthorized"
import { useSessionStorageManager } from "../hooks/useSessionStorageManager"
import { useSrpAuthorization } from "../hooks/useSrpAuthorization"
import { AuthContainer } from "./AuthContainer"

export const LoginPage: React.FC = ({ ...props }) => {
  const { isAuthorized, isLoading } = useIsAuthorized()
  const { startMutate, completeMutate } = useSrpAuthorization()
  const { setKey: setEncryptionKey } = useSessionStorageManager(
    EncryptionKeyContext,
    "EncryptionKey"
  )

  const [key, setKey] = React.useState("")
  const [errorText, setErrorText] = React.useState("")

  const navigate = useNavigate()

  const handleSubmit = async () => {
    const username = ""
    const clientEphemeral = srp.generateEphemeral()

    const { serverEphemeralPublic, salt } = await startMutate(
      clientEphemeral.public
    )

    const password = key
    const privateKey = srp.derivePrivateKey(salt, username, password)

    const clientSession = srp.deriveSession(
      clientEphemeral.secret,
      serverEphemeralPublic,
      salt,
      username,
      privateKey
    )

    const proof = await completeMutate(clientSession.proof)

    if (proof.status !== 200) {
      setErrorText("Invalid key.")
      return
    }

    setErrorText("")
    const { result } = await proof.json()

    try {
      srp.verifySession(clientEphemeral.public, clientSession, result)
    } catch (error) {
      console.log(error)
      setErrorText("Invalid key.")
      return
    }

    const derivedKey = cryptojs.PBKDF2(password, salt).toString()

    setEncryptionKey(derivedKey)

    navigate("/")
  }

  if (isLoading) {
    return <></>
  }

  if (isAuthorized) {
    navigate("/")
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
