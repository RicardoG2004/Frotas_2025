import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useMemoryManager } from '@/utils/memory-manager'

export const useMemoryOptimization = () => {
  const { performCleanup, getMemoryStats, updateConfig } = useMemoryManager()
  const { isAuthenticated } = useAuthStore()

  // Perform cleanup when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      performCleanup()
    }
  }, [isAuthenticated, performCleanup])

  // Perform cleanup on page visibility change (when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched to another tab, perform cleanup
        performCleanup()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [performCleanup])

  // Perform cleanup on window focus (when user returns to the app)
  useEffect(() => {
    const handleFocus = () => {
      // User returned to the app, check memory usage
      const stats = getMemoryStats()
      const totalUsage =
        stats.localStorageSize +
        stats.formStates * 1024 + // Estimate form memory
        stats.pageStates * 512 // Estimate page memory

      // If memory usage is high, perform cleanup
      if (totalUsage > 10000) {
        // 10MB threshold (increased from 500KB)
        performCleanup()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [performCleanup, getMemoryStats])

  // Perform cleanup on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      performCleanup()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [performCleanup])

  // Manual cleanup function
  const manualCleanup = useCallback(() => {
    performCleanup()
  }, [performCleanup])

  // Get current memory stats
  const getCurrentStats = useCallback(() => {
    return getMemoryStats()
  }, [getMemoryStats])

  // Update memory configuration
  const updateMemoryConfig = useCallback(
    (config: any) => {
      updateConfig(config)
    },
    [updateConfig]
  )

  return {
    manualCleanup,
    getCurrentStats,
    updateMemoryConfig,
  }
}
