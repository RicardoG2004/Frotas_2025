import CryptoJS from 'crypto-js'
import { jwtDecode } from 'jwt-decode'

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-key'

export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      const valueStr = JSON.stringify(value)
      const checksum = CryptoJS.SHA256(valueStr + ENCRYPTION_KEY).toString()
      const dataWithChecksum = {
        data: valueStr,
        checksum,
      }
      const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify(dataWithChecksum),
        ENCRYPTION_KEY
      ).toString()
      localStorage.setItem(key, encryptedValue)
      return true
    } catch (error) {
      console.error('Error setting secure storage:', error)
      return false
    }
  },

  get: (key: string) => {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return null

      const decrypted = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY)
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)

      if (!decryptedStr) return null

      const { data, checksum } = JSON.parse(decryptedStr)
      const verifyChecksum = CryptoJS.SHA256(data + ENCRYPTION_KEY).toString()

      if (checksum !== verifyChecksum) {
        localStorage.removeItem(key)
        return null
      }

      return JSON.parse(data)
    } catch (error) {
      localStorage.removeItem(key)
      return null
    }
  },

  verify: (token: string | null): boolean => {
    if (!token) return false
    try {
      const decoded = jwtDecode(token)
      if ('exp' in decoded) {
        const expiryTime = decoded.exp! * 1000
        const currentTime = Date.now()
        // Don't add buffer time here, just check if token is expired
        const isValid = expiryTime > currentTime
        // console.log('Token verification:', {
        //   expiryTime: new Date(expiryTime),
        //   currentTime: new Date(currentTime),
        //   isValid,
        //   timeLeft: Math.floor((expiryTime - currentTime) / 1000) + ' seconds',
        // })
        return isValid
      }
      return true
    } catch (error) {
      console.error('Token verification error:', error)
      return false
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from secure storage:', error)
      return false
    }
  },
}
