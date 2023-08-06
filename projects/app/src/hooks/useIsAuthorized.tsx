import { useEffect, useState } from "react"

import { AuthEndpoints } from "../data/Routes"

export const useIsAuthorized = () => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateAuthorization = async () => {
      try {
        const result = await fetch(
          AuthEndpoints.prefix + AuthEndpoints.endpoints.Verify.url
        )

        result.status === 200 ? setIsAuthorized(true) : setIsAuthorized(false)

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setIsAuthorized(false)
      }
    }

    validateAuthorization()
  }, [])

  return { isAuthorized, isLoading }
}
