import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateCodigoPostal } from '@/pages/base/codigospostais/queries/codigospostais-mutations'
import { MapPin, Tag, Building2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  PersistentTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/persistent-tabs'

const codigoPostalFormSchema = z.object({
  codigo: z.string().min(1, { message: 'O código é obrigatório' }),
  localidade: z.string().min(1, { message: 'A localidade é obrigatória' }),
})

type CodigoPostalFormValues = z.infer<typeof codigoPostalFormSchema>

interface CodigoPostalFormBaseProps {
  // Common props
  modalClose?: () => void
  onSuccess?: (newCodigoPostal: { id: string; codigo: string }) => void
  initialCodigo?: string
  shouldCloseWindow?: boolean

  // Form configuration
  formId: string
  useTabs?: boolean
  usePersistence?: boolean
  useErrorHandling?: boolean
  singleColumn?: boolean
}

const CodigoPostalFormBase = ({
  modalClose,
  onSuccess,
  initialCodigo,
  shouldCloseWindow = true,
  formId,
  useTabs = true,
  usePersistence = true,
  useErrorHandling = true,
  singleColumn = false,
}: CodigoPostalFormBaseProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Conditional form state management
  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState, setWindowReturnData } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createCodigoPostalMutation = useCreateCodigoPostal()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      codigo: '',
      localidade: '',
    }),
    []
  )

  const codigoPostalResolver: Resolver<CodigoPostalFormValues> = async (
    values
  ) => {
    const result = codigoPostalFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const errors: Record<string, any> = {}
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] || '')
      if (!field) continue
      if (!errors[field]) {
        errors[field] = {
          type: issue.code || 'validation',
          message: issue.message,
        }
      }
    }
    return { values: {}, errors }
  }

  const form = useForm<CodigoPostalFormValues>({
    resolver: codigoPostalResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  // Conditional tab management
  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `${formId}-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<CodigoPostalFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      codigo: 'dados',
      localidade: 'dados',
    },
  })

  // Initialize form state on first render (only if persistence is enabled)
  useEffect(() => {
    if (usePersistence && isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId
        setFormState(formId, {
          formData: {},
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, usePersistence])

  // Load saved form data if available and the form has been initialized (only if persistence is enabled)
  useEffect(() => {
    if (usePersistence && isInitialized && hasFormData(formId)) {
      form.reset(formData as CodigoPostalFormValues)
    } else if (initialCodigo) {
      // If no saved data, use the initial value
      form.reset({
        codigo: initialCodigo,
        localidade: '',
      })
    } else if (!usePersistence) {
      // For non-persistent forms, always start fresh
      form.reset(defaultValues)
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    initialCodigo,
    usePersistence,
    defaultValues,
  ])

  // Save form data when it changes (only if persistence is enabled)
  useEffect(() => {
    if (!usePersistence) return

    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as CodigoPostalFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      // Update window hasFormData flag using the utility function
      if (effectiveWindowId) {
        updateCreateFormData(
          effectiveWindowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        // Update window title based on codigo field
        updateCreateWindowTitle(
          effectiveWindowId,
          value.codigo,
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, defaultValues, usePersistence])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose?.()
    }
  }

  const onSubmit = async (values: CodigoPostalFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createCodigoPostalMutation.mutateAsync(values)

      const result = handleApiResponse(
        response,
        'Código Postal criado com sucesso',
        'Erro ao criar código postal',
        'Código Postal criado com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.codigo },
            'codigo postal',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            codigo: values.codigo,
          })
          onSuccess({
            id: response.info.data,
            codigo: values.codigo,
          })
        }
        // Only close the window if shouldCloseWindow is true
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        // Always call modalClose to close the modal
        modalClose?.()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar código postal'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const formContent = (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(
            onSubmit,
            useErrorHandling ? handleError : undefined
          )}
          className='space-y-4'
          autoComplete='off'
        >
          {useTabs ? (
            <PersistentTabs
              defaultValue='dados'
              className='w-full'
              tabKey={`${formId}-${instanceId}`}
            >
              <TabsList>
                <TabsTrigger value='dados'>Dados do Código Postal</TabsTrigger>
              </TabsList>
              <TabsContent value='dados'>{renderFormFields()}</TabsContent>
            </PersistentTabs>
          ) : (
            renderFormFields()
          )}

          <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='w-full md:w-auto'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={createCodigoPostalMutation.isPending}
              className='w-full md:w-auto'
            >
              {createCodigoPostalMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )

  function renderFormFields() {
    return (
      <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
              <MapPin className='h-4 w-4' />
            </div>
            <div>
              <CardTitle className='text-base flex items-center gap-2'>
                Informações do Código Postal
                <Badge variant='secondary' className='text-xs'>
                  Obrigatório
                </Badge>
              </CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Defina o código postal e a localidade correspondente
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div
            className={`grid grid-cols-1 ${singleColumn ? '' : 'md:grid-cols-2'} gap-4`}
          >
            <FormField
              control={form.control}
              name='codigo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Tag className='h-4 w-4' />
                    Código Postal
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza o código postal'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='localidade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4' />
                    Localidade
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza a localidade'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return formContent
}

export { CodigoPostalFormBase }
