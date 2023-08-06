import React from "react"

import { AuthEndpoints } from "../data/Routes"

export const useIsSetup = () => {
  const [isSetup, setIsSetup] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch(
          AuthEndpoints.prefix + AuthEndpoints.endpoints.VerifySetup.url
        )
        const data = await response.json()
        setIsSetup(data === true)
      } catch (error) {
        setIsSetup(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkSetup()
  }, [])

  return { isSetup, isLoading }
}
