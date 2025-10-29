export const debugStorage = {
  set: (key: string, value: any) => {
    try {
      const debugKey = `debug_${key}`
      const debugValue = {
        timestamp: new Date().toISOString(),
        data: value,
      }
      localStorage.setItem(debugKey, JSON.stringify(debugValue, null, 2))
      return true
    } catch (error) {
      console.error('Error setting debug storage:', error)
      return false
    }
  },

  get: (key: string) => {
    try {
      const debugKey = `debug_${key}`
      const value = localStorage.getItem(debugKey)
      if (!value) return null
      const parsed = JSON.parse(value)
      return parsed.data
    } catch (error) {
      console.error('Error getting debug storage:', error)
      return null
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(`debug_${key}`)
  },
}
