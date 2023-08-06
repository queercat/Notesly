import { AuthEndpoints } from "../data/Routes"

export const useSrpAuthorization = () => {
  // This could probably be better represented as a state machine lol.
  const startMutate = async (publicClientEphemeral: string) => {
    const res = await fetch(
      AuthEndpoints.prefix + AuthEndpoints.endpoints.SrpStart.url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEphemeralPublic: publicClientEphemeral,
        }),
      }
    )

    return await res.json()
  }
  const completeMutate = async (proof: string) => {
    const res = await fetch(
      AuthEndpoints.prefix + AuthEndpoints.endpoints.SrpComplete.url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          clientProof: proof,
        }),
      }
    )

    return await res.json()
  }
  const validate = () => {}

  return { startMutate, completeMutate, validate }
}
