import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, FieldValues, DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
} from '@/utils/window-utils'

interface UseFormManagerProps<T extends FieldValues> {
  formId?: string
  schema: z.ZodType<T>
  defaultValues: DefaultValues<T>
  titleField?: keyof T
  shouldCloseWindow?: boolean
  onSuccess?: (data: any) => void
  modalClose?: () => void
}

export const useFormManager = <T extends FieldValues>({
  formId: propFormId,
  schema,
  defaultValues,
  titleField,
  shouldCloseWindow = true,
  modalClose,
}: UseFormManagerProps<T>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = propFormId || instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, resetFormState, hasFormData } = useFormsStore()
  const { removeWindow, updateWindowState } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        setFormState(formId, {
          formData: {},
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, windowId])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as T)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!value) return

      const hasNonEmptyValues = Object.values(value).some(
        (fieldValue) => fieldValue !== undefined && fieldValue !== ''
      )

      setFormState(formId, {
        formData: value as T,
        isDirty: hasNonEmptyValues,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasNonEmptyValues,
      })

      if (windowId) {
        updateCreateFormData(windowId, value, setWindowHasFormData)
        if (titleField && value) {
          const titleValue = (value as T)[titleField]
          if (typeof titleValue === 'string') {
            updateCreateWindowTitle(windowId, titleValue, updateWindowState)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, formId, titleField])

  const handleClose = () => {
    cleanupWindowForms(windowId)

    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else if (modalClose) {
      modalClose()
    }
  }

  return {
    form,
    formId,
    windowId,
    handleClose,
    formState: {
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
      isSubmitting: form.formState.isSubmitting,
    },
  }
}
