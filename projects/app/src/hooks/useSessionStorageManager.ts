/* eslint-disable react-hooks/exhaustive-deps */
import { Context, useContext, useEffect } from "react"

export const useSessionStorageManager = (
  context: Context<any>,
  keyName: string
) => {
  const { key, setKey } = useContext(context)

  useEffect(() => {
    const key = sessionStorage.getItem(keyName)
    if (key) {
      setKey(key)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(keyName, key ?? "")
  }, [key, keyName])

  return { key, setKey }
}
