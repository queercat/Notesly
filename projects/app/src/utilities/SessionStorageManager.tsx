import React, { useEffect } from "react"

interface SessionStorageManagerProps extends React.PropsWithChildren {
  context: React.Context<any>
  keyName: string
}

export const SessionStorageManager: React.FC<SessionStorageManagerProps> = ({
  children,
  context,
  keyName,
}) => {
  const { key, setKey } = React.useContext(context)

  useEffect(() => {
    const storedKey = sessionStorage.getItem(keyName)

    if (storedKey) {
      setKey(storedKey)
    }
  }, [keyName, setKey])

  useEffect(() => {
    sessionStorage.setItem(keyName, key)
  }, [key, keyName])

  return <>{children}</>
}
