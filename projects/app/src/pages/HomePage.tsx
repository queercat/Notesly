import React, { useContext, useEffect } from "react"

import { EncryptionKeyContext } from "../App"

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = ({ ...props }) => {
  const { encryptionKey, setEncryptionKey } = useContext(EncryptionKeyContext)

  useEffect(() => {
    setTimeout(() => {
      setEncryptionKey("test")
    }, 1000)
  }, [setEncryptionKey])

  return <div {...props}>key: {encryptionKey}</div>
}
