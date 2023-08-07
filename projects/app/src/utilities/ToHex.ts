/**
 * Encodes a buffer into a hexadecimal string.
 *
 * @param {Uint8Array} buffer buffer to encode
 * @return {string} hex-encoded form of buffer
 */
export function toHex(buffer: Uint8Array): string {
  return [...buffer].map((x) => x.toString(16).padStart(2, "0")).join("")
}
