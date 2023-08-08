import React from "react"

import { useEncryption } from "../hooks/useEncryption"

export const HomePage: React.FC = () => {
  const { encrypt, decrypt } = useEncryption()

  const encryptedText = encrypt("Hello World")

  return (
    <>
      <div>Encrypted Text:{encryptedText}</div>
      <div>
        Decrypted Text:
        {decrypt(encryptedText)}
      </div>
    </>
  )
}
