import React from "react"

import { AuthEndpoints } from "../data/Routes"

export const useSetup = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState({})

  const mutate = async (salt: string, verifier: any) => {
    try {
      const result = await fetch(
        AuthEndpoints.prefix + AuthEndpoints.endpoints.Setup.url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ salt: salt, verifier: verifier }),
        }
      )

      setResult(result)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, result }
}
