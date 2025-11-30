/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate commitment hash matching Move contract
 * hash(bcs(user_addr) || bcs(market_id) || bcs(side) || bcs(amount) || salt)
 */
export async function generateCommitHash(
  side: number,
  amount: number,
  salt: string,
  userAddress: string,
  marketId: number
): Promise<string> {
  // Simple BCS-like encoding for compatibility
  const encoder = new TextEncoder();
  
  // Convert address to bytes (remove 0x prefix)
  const addressBytes = hexToBytes(userAddress.startsWith('0x') ? userAddress.slice(2) : userAddress);
  
  // Convert numbers to 8-byte little-endian
  const marketIdBytes = numberToBytes(marketId, 8);
  const sideBytes = numberToBytes(side, 1);
  const amountBytes = numberToBytes(amount, 8);
  const saltBytes = hexToBytes(salt);
  
  // Concatenate all bytes
  const totalLength = addressBytes.length + marketIdBytes.length + sideBytes.length + amountBytes.length + saltBytes.length;
  const data = new Uint8Array(totalLength);
  let offset = 0;
  
  data.set(addressBytes, offset); offset += addressBytes.length;
  data.set(marketIdBytes, offset); offset += marketIdBytes.length;
  data.set(sideBytes, offset); offset += sideBytes.length;
  data.set(amountBytes, offset); offset += amountBytes.length;
  data.set(saltBytes, offset);
  
  // Use SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return bytesToHex(hashArray);
}

/**
 * Convert number to little-endian bytes
 */
function numberToBytes(num: number, byteLength: number): Uint8Array {
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    bytes[i] = (num >> (i * 8)) & 0xff;
  }
  return bytes;
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return "0x" + Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a commitment hash
 */
export async function verifyCommitHash(
  commitHash: string,
  side: number,
  amount: number,
  salt: string,
  userAddress: string,
  marketId: number,
): Promise<boolean> {
  const computed = await generateCommitHash(side, amount, salt, userAddress, marketId);
  return computed.toLowerCase() === commitHash.toLowerCase();
}