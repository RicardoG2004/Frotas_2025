import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateTaxaIva } from '@/pages/base/taxasIva/queries/taxasIva-mutations'
import { Percent, Tag, ChevronUp, ChevronDown } from 'lucide-react'
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

const taxaIvaFormSchema = z.object({
  descricao: z
    .string()
    .min(1, { message: 'A descrição é obrigatória' }),
  valor: z
    .number({ message: 'O valor é obrigatório' })
    .min(0, { message: 'O valor deve ser maior ou igual a 0' })
    .max(100, { message: 'O valor deve ser menor ou igual a 100' }),
  ativo: z.boolean().default(true),
})

type TaxaIvaFormValues = z.infer<typeof taxaIvaFormSchema>

interface TaxaIvaCreateFormProps {
  modalClose: () => void
  onSuccess?: (newTaxaIva: { id: string; descricao: string }) => void
  shouldCloseWindow?: boolean
}

const TaxaIvaCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: TaxaIvaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `taxaIva-${instanceId}`

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState, setWindowReturnData } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createTaxaIvaMutation = useCreateTaxaIva()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      descricao: '',
      valor: 0,
      ativo: true,
    }),
    []
  )

  const taxaIvaResolver: Resolver<TaxaIvaFormValues> = async (values) => {
    const result = taxaIvaFormSchema.safeParse(values)
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

  const form = useForm<TaxaIvaFormValues>({
    resolver: taxaIvaResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `taxaIva-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<TaxaIvaFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      descricao: 'dados',
      valor: 'dados',
    },
  })

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as TaxaIvaFormValues)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as TaxaIvaFormValues,
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
        // Update window title based on descricao field
        updateCreateWindowTitle(
          effectiveWindowId,
          value.descricao,
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, defaultValues])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: TaxaIvaFormValues) => {
    console.log('Taxa IVA Form Submit Values:', values)
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createTaxaIvaMutation.mutateAsync({
        Descricao: values.descricao,
        Valor: values.valor,
        Ativo: values.ativo,
      })
      console.log('Taxa IVA Create Response:', response)

      const result = handleApiResponse(
        response,
        'Taxa de IVA criada com sucesso',
        'Erro ao criar taxa de IVA',
        'Taxa de IVA criada com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, descricao: values.descricao },
            'taxaIva',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            descricao: values.descricao,
          })
          onSuccess({
            id: response.info.data,
            descricao: values.descricao,
          })
        }
        // Only close the window if shouldCloseWindow is true
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar taxa de IVA'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='taxaIvaCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`taxaIva-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados Taxa de Iva</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Percent className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Taxa de IVA
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas da taxa de IVA
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='descricao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            Descrição
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a descrição'
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
                      name='valor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Percent className='h-4 w-4' />
                            Valor (%)
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type='number'
                                placeholder='0'
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(
                                    value === '' ? '' : parseFloat(value)
                                  )
                                }}
                                value={field.value === 0 ? '' : field.value}
                                step='0.01'
                                min='0'
                                max='100'
                                className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                  onClick={() => {
                                    const currentValue = typeof field.value === 'number' ? field.value : 0
                                    const newValue = Math.min(100, currentValue + 1)
                                    field.onChange(newValue)
                                  }}
                                >
                                  <ChevronUp className='h-3 w-3' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                  onClick={() => {
                                    const currentValue = typeof field.value === 'number' ? field.value : 0
                                    const newValue = Math.max(0, currentValue - 1)
                                    field.onChange(newValue)
                                  }}
                                >
                                  <ChevronDown className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </PersistentTabs>

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
              disabled={createTaxaIvaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createTaxaIvaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default TaxaIvaCreateForm

