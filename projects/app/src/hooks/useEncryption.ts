import cryptojs from "crypto-js"

import { EncryptionKeyContext } from "../contexts/EncryptionKeyContext"
import { useSessionStorageManager } from "./useSessionStorageManager"

export const useEncryption = () => {
  const { key } = useSessionStorageManager(
    EncryptionKeyContext,
    "EncryptionKey"
  )

  const encrypt = (text: string) => {
    return cryptojs.AES.encrypt(text, key).toString()
  }

  const decrypt = (text: string) => {
    return cryptojs.AES.decrypt(text, key).toString(cryptojs.enc.Utf8)
  }

  return { encrypt, decrypt }
}
