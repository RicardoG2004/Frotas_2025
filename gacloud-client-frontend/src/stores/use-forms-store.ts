import { useEffect, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCurrentWindowId } from '@/utils/window-utils'

export interface FormState {
  // Form data - limit size to prevent memory bloat
  formData: Record<string, any>
  // Form validation state
  isValid: boolean
  // Form submission state
  isSubmitting: boolean
  // Form dirty state
  isDirty: boolean
  // Form instance identifier
  formId: string
  // Window ID to track which window this form belongs to
  windowId: string
  // Last active timestamp
  lastActive: number
  // Flag to indicate if the form has been initialized
  isInitialized: boolean
  // Flag to indicate if the form has been visited
  hasBeenVisited: boolean
  // Flag to indicate if the form has been modified
  hasBeenModified: boolean
  // Data size tracking for cleanup
  dataSize: number
}

interface FormsState {
  forms: Record<string, FormState>
  setFormState: (formId: string, newState: Partial<FormState>) => void
  resetFormState: (formId: string) => void
  removeFormState: (formId: string) => void
  getFormState: (formId: string) => FormState | null
  updateFormState: (
    formId: string,
    updater: (state: FormState) => Partial<FormState>
  ) => void
  // Helper methods
  cleanupOrphanedFormStates: () => void
  // New method to ensure form isolation
  ensureFormIsolation: (formId: string) => void
  // New method to initialize a form with clean state
  initializeForm: (formId: string) => void
  // New method to mark a form as visited
  markFormAsVisited: (formId: string) => void
  // New method to check if form has data
  hasFormData: (formId: string) => boolean
  // New method to clean up all form instances for a specific entity type
  cleanupEntityFormStates: (entityType: string) => void
  // New method to clear all form data
  clearAllFormData: () => void
  // New method to get memory usage
  getMemoryUsage: () => { totalForms: number; totalSize: number }
  // New method to cleanup old forms
  cleanupOldForms: (maxAge: number) => void
}

const defaultFormState: FormState = {
  formData: {},
  isValid: false,
  isSubmitting: false,
  isDirty: false,
  formId: '',
  windowId: '',
  lastActive: Date.now(),
  isInitialized: false,
  hasBeenVisited: false,
  hasBeenModified: false,
  dataSize: 0,
}

// Helper function to calculate data size
const calculateDataSize = (data: any): number => {
  try {
    return new Blob([JSON.stringify(data)]).size
  } catch {
    return 0
  }
}

// Helper function to check if data has actually changed
const hasDataChanged = (oldData: any, newData: any): boolean => {
  if (oldData === newData) return false
  if (!oldData && !newData) return false
  if (!oldData || !newData) return true

  try {
    return JSON.stringify(oldData) !== JSON.stringify(newData)
  } catch {
    return true
  }
}

// Create a selector factory for memoized state access
const createFormStateSelector = (formId: string) => (state: FormsState) =>
  state.forms[formId] || null

export const useFormsStore = create<FormsState>()(
  persist(
    (set, get) => ({
      forms: {},

      setFormState: (formId, newState) => {
        set((state) => {
          const currentState = state.forms[formId] || defaultFormState

          // Only update changed fields to reduce unnecessary re-renders
          const updatedState = Object.entries(newState).reduce(
            (acc, [key, value]) => {
              const currentValue = currentState[key as keyof FormState]

              // Use optimized change detection
              if (hasDataChanged(currentValue, value)) {
                // Type-safe assignment based on the key
                switch (key) {
                  case 'formData':
                    acc.formData = value as Record<string, any>
                    acc.hasBeenModified = true
                    acc.dataSize = calculateDataSize(value)
                    break
                  case 'isValid':
                    acc.isValid = value as boolean
                    break
                  case 'isSubmitting':
                    acc.isSubmitting = value as boolean
                    break
                  case 'isDirty':
                    acc.isDirty = value as boolean
                    break
                  case 'formId':
                    acc.formId = value as string
                    break
                  case 'windowId':
                    acc.windowId = value as string
                    break
                  case 'lastActive':
                    acc.lastActive = value as number
                    break
                  case 'isInitialized':
                    acc.isInitialized = value as boolean
                    break
                  case 'hasBeenVisited':
                    acc.hasBeenVisited = value as boolean
                    break
                  case 'hasBeenModified':
                    acc.hasBeenModified = value as boolean
                    break
                  case 'dataSize':
                    acc.dataSize = value as number
                    break
                  default:
                    // Skip unknown keys
                    break
                }
              }
              return acc
            },
            {} as Partial<FormState>
          )

          if (Object.keys(updatedState).length === 0) return state

          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...currentState,
                ...updatedState,
                formId, // Always ensure formId is set
                lastActive: Date.now(), // Update last active timestamp
              },
            },
          }
        })
      },

      resetFormState: (formId) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [formId]: {
              ...defaultFormState,
              formId, // Always ensure formId is set
              lastActive: Date.now(),
            },
          },
        }))
      },

      removeFormState: (formId) => {
        set((state) => {
          const { [formId]: removed, ...remainingForms } = state.forms
          return {
            forms: remainingForms,
          }
        })
      },

      getFormState: (formId) => {
        const state = get().forms[formId]
        if (!state) return null
        return state
      },

      updateFormState: (formId, updater) => {
        set((state) => {
          const currentState = state.forms[formId] || defaultFormState
          const updates = updater(currentState)

          // Only update if there are actual changes
          const hasChanges = Object.entries(updates).some(([key, value]) =>
            hasDataChanged(currentState[key as keyof FormState], value)
          )

          if (!hasChanges) return state

          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...currentState,
                ...updates,
                lastActive: Date.now(), // Update last active timestamp
              },
            },
          }
        })
      },

      cleanupOrphanedFormStates: () => {
        set((state) => {
          // Get all form IDs from the current state
          const formIds = Object.keys(state.forms)

          // Create a new state with only the active form instances
          const cleanedForms = formIds.reduce(
            (acc, formId) => {
              const form = state.forms[formId]

              // Keep the form if it has been visited and has data
              if (form.hasBeenVisited && form.hasBeenModified) {
                acc[formId] = form
              }

              return acc
            },
            {} as Record<string, FormState>
          )

          // Also clean up the old format instances if they exist
          const cleanedState = { forms: cleanedForms }
          if ('instances' in state) {
            // Remove the old instances property
            delete (cleanedState as any).instances
          }

          return cleanedState
        })
      },

      ensureFormIsolation: (formId) => {
        set((state) => {
          // If the form doesn't exist, initialize it with default state
          if (!state.forms[formId]) {
            return {
              forms: {
                ...state.forms,
                [formId]: {
                  ...defaultFormState,
                  formId,
                  lastActive: Date.now(),
                },
              },
            }
          }
          return state
        })
      },

      initializeForm: (formId) => {
        set((state) => {
          const currentState = state.forms[formId]

          // If the form doesn't exist or hasn't been initialized yet
          if (!currentState || !currentState.isInitialized) {
            return {
              forms: {
                ...state.forms,
                [formId]: {
                  ...defaultFormState,
                  formId,
                  lastActive: Date.now(),
                  isInitialized: true,
                },
              },
            }
          }

          return state
        })
      },

      markFormAsVisited: (formId) => {
        set((state) => {
          const currentState = state.forms[formId]

          if (!currentState) {
            return {
              forms: {
                ...state.forms,
                [formId]: {
                  ...defaultFormState,
                  formId,
                  lastActive: Date.now(),
                  isInitialized: true,
                  hasBeenVisited: true,
                },
              },
            }
          }

          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...currentState,
                hasBeenVisited: true,
                lastActive: Date.now(),
              },
            },
          }
        })
      },

      hasFormData: (formId) => {
        const state = get().forms[formId]
        return !!(
          state &&
          state.formData &&
          Object.keys(state.formData).length > 0 &&
          state.hasBeenVisited &&
          state.hasBeenModified
        )
      },

      cleanupEntityFormStates: (entityType) => {
        set((state) => {
          // Create a new state with only the form instances that don't match the entity type
          const cleanedForms = Object.entries(state.forms).reduce(
            (acc, [formId, form]) => {
              // Keep forms that don't match the entity type
              if (!formId.startsWith(`${entityType}-`)) {
                acc[formId] = form
              }
              return acc
            },
            {} as Record<string, FormState>
          )

          return { forms: cleanedForms }
        })
      },

      clearAllFormData: () => {
        set(() => ({
          forms: {},
        }))
      },

      getMemoryUsage: () => {
        const state = get()
        const forms = Object.values(state.forms)
        const totalForms = forms.length
        const totalSize = forms.reduce((sum, form) => sum + form.dataSize, 0)

        return { totalForms, totalSize }
      },

      cleanupOldForms: (maxAge) => {
        set((state) => {
          const now = Date.now()
          const cleanedForms = Object.entries(state.forms).reduce(
            (acc, [formId, form]) => {
              // Keep forms that are recent or have been modified
              if (now - form.lastActive < maxAge || form.hasBeenModified) {
                acc[formId] = form
              }
              return acc
            },
            {} as Record<string, FormState>
          )

          return { forms: cleanedForms }
        })
      },
    }),
    {
      name: 'form-instances-storage',
      // Add migration to handle old data format
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // If we have old format data, convert it to new format
          if (persistedState && persistedState.instances) {
            const newState = {
              forms: Object.entries(persistedState.instances).reduce(
                (acc, [key, value]) => {
                  const formData = value as Record<string, any>
                  acc[key] = {
                    ...defaultFormState,
                    formId: key,
                    formData,
                    lastActive: Date.now(),
                    isInitialized: true,
                    hasBeenVisited: true,
                    hasBeenModified: true,
                    dataSize: calculateDataSize(formData),
                  }
                  return acc
                },
                {} as Record<string, FormState>
              ),
            }
            return newState
          }
        }
        return persistedState
      },
      // Only persist essential data to reduce storage size
      partialize: (state) => ({
        forms: Object.entries(state.forms).reduce(
          (acc, [formId, form]) => {
            // Only persist forms that have been visited and modified
            if (form.hasBeenVisited && form.hasBeenModified) {
              acc[formId] = {
                formData: form.formData,
                formId: form.formId,
                windowId: form.windowId,
                lastActive: form.lastActive,
                hasBeenVisited: form.hasBeenVisited,
                hasBeenModified: form.hasBeenModified,
                dataSize: form.dataSize,
              }
            }
            return acc
          },
          {} as Record<string, Partial<FormState>>
        ),
      }),
    }
  )
)

// Hook for accessing form state with memoization
export const useFormState = (formId: string) => {
  const selector = useMemo(() => createFormStateSelector(formId), [formId])
  const formState = useFormsStore(selector)
  const { ensureFormIsolation, initializeForm, markFormAsVisited } =
    useFormsStore()
  const windowId = useCurrentWindowId()

  // Ensure form isolation and initialization when the hook is first used
  useEffect(() => {
    // Only proceed if we have a valid windowId
    if (windowId) {
      ensureFormIsolation(formId)
      initializeForm(formId)
      markFormAsVisited(formId)
      // Set the windowId in the form state
      useFormsStore.getState().setFormState(formId, { windowId })
    }
  }, [formId, windowId])

  // Return default state if no windowId is available
  if (!windowId) {
    return defaultFormState
  }

  return formState || defaultFormState
}
