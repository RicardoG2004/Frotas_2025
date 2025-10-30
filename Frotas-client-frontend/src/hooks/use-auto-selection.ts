import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWindowsStore } from '@/stores/use-windows-store'
import { toast } from '@/utils/toast-utils'
import {
  checkForChildWindowReturnData,
  getAndClearWindowReturnData,
} from '@/utils/window-utils'

interface UseAutoSelectionOptions {
  windowId: string
  instanceId: string
  data: any[]
  setValue: (value: string) => void
  refetch: () => Promise<any>
  itemName: string
  successMessage?: string
  manualSelectionMessage?: string
  queryKey?: string[]
}

/**
 * Hook for automatically selecting newly created items from child windows.
 * Provides multiple fallback mechanisms to ensure reliable auto-selection.
 *
 * Toast Suppression: When a parent window already shows a success toast for creation,
 * the auto-selection toast can be suppressed to prevent stuttering effects.
 * This is controlled by the `suppress-auto-selection-toast-${windowId}` sessionStorage flag.
 */
export function useAutoSelection({
  windowId,
  instanceId,
  data,
  setValue,
  refetch,
  itemName,
  successMessage,
  manualSelectionMessage,
  queryKey,
}: UseAutoSelectionOptions) {
  const latestDataRef = useRef<any[]>([])
  const processedRef = useRef(false) // Track if we've already processed return data
  const isProcessingRef = useRef(false) // Track if we're currently processing
  const lastProcessedReturnDataRef = useRef<any>(null) // Track the last processed return data
  const effectRunCountRef = useRef(0) // Track how many times the effect has run
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Debounce timeout
  const hasExecutedRef = useRef(false) // Track if we've already executed for this window
  const queryClient = useQueryClient()
  const {
    findChildWindows,
    getWindowReturnData,
    clearWindowReturnData,
    windows,
  } = useWindowsStore()

  // Update the ref whenever data changes
  useEffect(() => {
    latestDataRef.current = data
  }, [data])

  // Find the specific windows we care about
  const parentWindow = windows.find((w) => w.id === windowId)
  const childWindows = findChildWindows(windowId)
  const hasChildWithReturnData = childWindows.some((w) => w.returnData)

  useEffect(() => {
    effectRunCountRef.current += 1

    if (!windowId) {
      return
    }

    // Prevent too many runs - if we've run more than 5 times, something is wrong
    if (effectRunCountRef.current > 5) {
      return
    }

    // Debounce mechanism - clear any existing timeout and set a new one
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set a debounce timeout to prevent rapid executions
    debounceTimeoutRef.current = setTimeout(() => {
      // Prevent multiple executions for the same window
      if (hasExecutedRef.current) {
        return
      }

      hasExecutedRef.current = true
      processAutoSelection()
    }, 100) // 100ms debounce

    return // Exit early, let the timeout handle the processing

    // Function to handle the actual auto-selection processing
    function processAutoSelection() {
      // Prevent multiple simultaneous executions
      if (isProcessingRef.current) {
        return
      }

      // Check if we've already processed auto-selection for this window
      const processedKey = `auto-selection-processed-${windowId}`
      const alreadyProcessed = sessionStorage.getItem(processedKey)
      if (alreadyProcessed === 'true') {
        return
      }

      // If we've already successfully processed return data, don't process again
      if (processedRef.current) {
        return
      }

      // Mark as processing to prevent concurrent executions
      isProcessingRef.current = true

      // Get parent window ID from sessionStorage as fallback
      const parentWindowIdFromStorage = sessionStorage.getItem(
        `parent-window-${instanceId}`
      )

      // Early return if no return data to process
      if (!hasChildWithReturnData && !parentWindow?.returnData) {
        isProcessingRef.current = false
        return
      }

      // Check if we have return data but it's already been processed
      if (parentWindow?.returnData && processedRef.current) {
        isProcessingRef.current = false
        return
      }

      // Check if we have return data that hasn't been processed yet
      if (parentWindow?.returnData && !processedRef.current) {
      } else if (!parentWindow?.returnData && !hasChildWithReturnData) {
        isProcessingRef.current = false
        return
      } else if (parentWindow?.returnData && processedRef.current) {
        isProcessingRef.current = false
        return
      }

      // Early return if no data available yet
      if (!latestDataRef.current || latestDataRef.current.length === 0) {
        isProcessingRef.current = false
        return
      }

      // Final check: if we have no return data to process, exit
      if (!hasChildWithReturnData && !parentWindow?.returnData) {
        isProcessingRef.current = false
        return
      }

      // Additional check: if we have return data but it's already been processed, exit
      if (parentWindow?.returnData && processedRef.current) {
        isProcessingRef.current = false
        return
      }

      // Check if we've already processed this specific return data
      if (parentWindow?.returnData && lastProcessedReturnDataRef.current) {
        const currentReturnData = parentWindow.returnData
        const lastProcessedData = lastProcessedReturnDataRef.current
        if (
          currentReturnData.id === lastProcessedData.id &&
          currentReturnData.nome === lastProcessedData.nome
        ) {
          isProcessingRef.current = false
          return
        }
      }

      // Function to attempt auto-selection
      const attemptAutoSelection = (
        itemId: string,
        itemName: string,
        cleanupCallback?: () => void
      ) => {
        const currentData = latestDataRef.current
        const itemExists = currentData.some((item: any) => item.id === itemId)
        if (itemExists) {
          setValue(itemId)

          // Check if we should suppress the auto-selection toast to prevent stuttering
          // This happens when the parent window already shows a success toast for creation
          const shouldSuppressToast = sessionStorage.getItem(
            `suppress-auto-selection-toast-${windowId}`
          )

          if (!shouldSuppressToast) {
            toast.success(
              successMessage || `${itemName} selecionado automaticamente`
            )
          } else {
            // Clear the suppression flag after using it
            sessionStorage.removeItem(
              `suppress-auto-selection-toast-${windowId}`
            )
          }

          // Mark as processed to prevent duplicate processing
          processedRef.current = true
          // Track the processed return data
          lastProcessedReturnDataRef.current = { id: itemId, nome: itemName }
          // Mark this window as processed to prevent re-processing
          const processedKey = `auto-selection-processed-${windowId}`
          sessionStorage.setItem(processedKey, 'true')
          // Only cleanup after successful selection
          if (cleanupCallback) {
            cleanupCallback()
          }
          return true
        }
        return false
      }

      // Function to handle auto-selection with retries
      const handleAutoSelection = (
        itemId: string,
        itemName: string,
        cleanupCallback?: () => void
      ) => {
        if (!attemptAutoSelection(itemId, itemName, cleanupCallback)) {
          // Force cache invalidation and refetch
          if (queryKey) {
            queryClient.invalidateQueries({ queryKey })
          }

          refetch().then(() => {
            setTimeout(() => {
              if (!attemptAutoSelection(itemId, itemName, cleanupCallback)) {
                setTimeout(() => {
                  if (
                    !attemptAutoSelection(itemId, itemName, cleanupCallback)
                  ) {
                    toast.success(
                      manualSelectionMessage ||
                        `${itemName} criado com sucesso. Por favor, selecione-o manualmente.`
                    )
                    // Cleanup even if selection failed after all retries
                    if (cleanupCallback) {
                      cleanupCallback()
                    }
                  }
                }, 500)
              }
            }, 100)
          })
        }
      }

      // Check primary mechanism: child windows
      const childWindowData = checkForChildWindowReturnData(
        windowId,
        findChildWindows,
        getWindowReturnData
      )

      if (childWindowData?.returnData) {
        const { id, nome } = childWindowData.returnData
        handleAutoSelection(id, nome, () => {
          getAndClearWindowReturnData(
            childWindowData.childWindowId,
            getWindowReturnData,
            clearWindowReturnData
          )
        })
        return
      }

      // Check first fallback: instanceId-based return data
      const fallbackReturnData = getWindowReturnData(instanceId)

      if (fallbackReturnData) {
        const { id, nome } = fallbackReturnData
        handleAutoSelection(id, nome, () => {
          clearWindowReturnData(instanceId)
        })
        return
      }

      // Check second fallback: parent window ID from storage
      if (parentWindowIdFromStorage) {
        const secondFallbackReturnData = getWindowReturnData(
          parentWindowIdFromStorage
        )

        if (secondFallbackReturnData) {
          const { id, nome } = secondFallbackReturnData
          handleAutoSelection(id, nome, () => {
            clearWindowReturnData(parentWindowIdFromStorage)
          })
          return
        }
      }

      // Check third fallback: sessionStorage backup
      const normalizedItemName = String(itemName)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
      const sessionStorageKey = `return-data-${windowId}-${normalizedItemName}`
      const sessionStorageReturnData = sessionStorage.getItem(sessionStorageKey)

      if (sessionStorageReturnData) {
        try {
          const parsedData = JSON.parse(sessionStorageReturnData)
          const { id, nome } = parsedData
          // Pass cleanup callback to remove sessionStorage only after successful selection
          handleAutoSelection(id, nome, () => {
            sessionStorage.removeItem(sessionStorageKey)
          })
          return
        } catch (error) {
          console.error('Error parsing sessionStorage return data:', error)
        }
      }

      // Check fourth fallback: scan all sessionStorage keys for this entity type
      const allSessionStorageKeys = Object.keys(sessionStorage).filter(
        (key) =>
          key.includes(`return-data-`) && key.includes(`-${normalizedItemName}`)
      )

      for (const key of allSessionStorageKeys) {
        const data = sessionStorage.getItem(key)
        if (data) {
          try {
            const parsedData = JSON.parse(data)
            const { id, nome } = parsedData
            handleAutoSelection(id, nome, () => {
              sessionStorage.removeItem(key)
            })
            return
          } catch (error) {
            console.error(
              'Error parsing alternative sessionStorage data:',
              error
            )
          }
        }
      }

      // Check fifth fallback: scan all windows for return data
      for (const window of windows) {
        if (window.returnData) {
          // Check if this window is related to our current window
          // Also check if the return data is for the correct entity type
          const isRelatedWindow =
            window.parentWindowId === windowId || window.id === windowId
          const isCorrectEntityType =
            window.returnData &&
            (window.returnData.nome || window.returnData.name) &&
            window.returnData.id

          if (isRelatedWindow && isCorrectEntityType) {
            const { id, nome } = window.returnData
            handleAutoSelection(id, nome, () => {
              // Clear the return data
              clearWindowReturnData(window.id)
            })
            return
          }
        }
      }

      // Check sixth fallback: look for any window with return data for any entity type
      // This is a more aggressive approach that doesn't rely on parent-child relationships
      for (const window of windows) {
        if (
          window.returnData &&
          window.returnData.id &&
          window.returnData.nome
        ) {
          // Check if this window path contains the entity type or if it's a general return data
          const normalizedPath = window.path.toLowerCase()
          const normalizedEntityName = itemName.toLowerCase()
          const isEntityData =
            normalizedPath.includes(normalizedEntityName) ||
            (window.returnData.nome &&
              typeof window.returnData.nome === 'string')

          if (isEntityData) {
            const { id, nome } = window.returnData
            handleAutoSelection(id, nome, () => {
              // Clear the return data
              clearWindowReturnData(window.id)
            })
            return
          }
        }
      }

      // Reset processing flag
      isProcessingRef.current = false
    } // End of processAutoSelection function
  }, [
    windowId,
    instanceId,
    // Remove all other dependencies to prevent unnecessary re-runs
    // The effect should only run when the window changes or when there's actual return data
  ])

  // Cleanup processed flag when window changes
  useEffect(() => {
    return () => {
      const processedKey = `auto-selection-processed-${windowId}`
      // Don't remove the suppression flag here - it needs to persist across window changes
      // const suppressKey = `suppress-auto-selection-toast-${windowId}`
      sessionStorage.removeItem(processedKey)
      // sessionStorage.removeItem(suppressKey)
      // Reset processing flag and last processed data
      isProcessingRef.current = false
      lastProcessedReturnDataRef.current = null
      effectRunCountRef.current = 0
      hasExecutedRef.current = false
      // Clear debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }
    }
  }, [windowId])
}
