import { Alert, Box } from "@mui/material"
import React from "react"
import srp from "secure-remote-password/client"

import { AlertSection } from "../components/Alert/AlertSection"
import { CurvedButton } from "../components/Button/CurvedButton"
import { CurvedInput } from "../components/TextInput/CurvedInput"
import { useSetup } from "../hooks/useSetup"
import { ValidateKeys } from "../utilities/ValidateKeys"
import { AuthContainer } from "./AuthContainer"

interface SetupPageProps {}

export const SetupPage: React.FC<SetupPageProps> = () => {
  const [key, setKey] = React.useState("")
  const [confirmationKey, setConfirmationKey] = React.useState("")
  const [errorText, setErrorText] = React.useState("")

  const [isSuccess, setIsSuccess] = React.useState(false)

  const { mutate, result } = useSetup()

  const handleSubmit = async () => {
    const username = ""
    const password = key

    const salt = srp.generateSalt()
    const privateKey = srp.derivePrivateKey(salt, username, password)

    const verifier = srp.deriveVerifier(privateKey)

    await mutate(salt, verifier)

    console.log(result)
  }

  React.useEffect(() => {
    // This could be cleaned up super easily, but I'm too lazy to do it right now.
    const result = ValidateKeys(key, confirmationKey)

    if (result === null) {
      setErrorText("")
      setIsSuccess(false)
    } else if (result.error) {
      setErrorText(result.error)
    } else if (result.success) {
      setIsSuccess(true)
      setErrorText("")
    }
  }, [key, confirmationKey])

  return (
    <>
      <AuthContainer>
        <h1>
          Note<span className="caption">sly</span>
        </h1>
        <CurvedInput
          type="password"
          placeholder="Enter a new key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          error={!!errorText}
        />
        <CurvedInput
          type="password"
          placeholder="Confirm your key"
          value={confirmationKey}
          onChange={(e) => setConfirmationKey(e.target.value)}
          error={!!errorText}
        />
        <CurvedButton
          disabled={!isSuccess}
          variant="contained"
          onClick={handleSubmit}
        >
          Set Master Key
        </CurvedButton>
        <Alert severity="info">
          <strong>Important:</strong> This key is used to encrypt your notes.
          Please remember it, as it <strong>cannot</strong> be recovered.
        </Alert>
        <Alert severity="warning">
          Currently it is <strong>impossible</strong> to change your key.
        </Alert>
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
