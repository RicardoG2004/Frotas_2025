import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_API_KEY || 'your-fallback-secret-key'

export const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

export const decryptData = <T>(encryptedData: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Failed to decrypt data:', error)
    return null
  }
}
