export const ValidateKeys = (
  key: string,
  confirmationKey: string
): {
  error?: string
  success?: boolean
} | null => {
  if (key !== confirmationKey && key.length > 0 && confirmationKey.length > 0) {
    return {
      error: "Keys do not match",
    }
  }

  if (
    key.length < 12 &&
    confirmationKey.length == key.length &&
    key.length > 0
  ) {
    return {
      error: "Key must be at least 12 characters",
    }
  }

  if (key.length > 0 && confirmationKey.length > 0) {
    return {
      success: true,
    }
  }

  return null
}
