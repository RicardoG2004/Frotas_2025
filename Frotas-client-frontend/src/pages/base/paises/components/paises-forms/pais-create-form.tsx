import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { countries } from '@/data/countries'
import { useCreatePais } from '@/pages/base/paises/queries/paises-mutations'
import { Globe, Tag, Hash } from 'lucide-react'
import ReactFlagsSelect from 'react-flags-select'
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

const paisFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  codigo: z.string().min(1, { message: 'O código é obrigatório' }),
  prefixo: z.string().min(1, { message: 'O prefixo é obrigatório' }),
})

type PaisFormValues = z.infer<typeof paisFormSchema>

interface PaisCreateFormProps {
  modalClose: () => void
  onSuccess?: (newPais: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const PaisCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: PaisCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `pais-${instanceId}`

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

  const createPaisMutation = useCreatePais()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      nome: '',
      codigo: '',
      prefixo: '',
    }),
    []
  )

  const paisResolver: Resolver<PaisFormValues> = async (values) => {
    const result = paisFormSchema.safeParse(values)
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

  const form = useForm<PaisFormValues>({
    resolver: paisResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const [selectedCodigo, setSelectedCodigo] = useState<string>('')

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `pais-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<PaisFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      codigo: 'dados',
      prefixo: 'dados',
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
      form.reset(formData as PaisFormValues)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as PaisFormValues,
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
        // Update window title based on nome field
        updateCreateWindowTitle(
          effectiveWindowId,
          value.nome,
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

  const handleCountrySelect = (code: string) => {
    setSelectedCodigo(code)
    form.setValue('codigo', code)

    // Get country name from the countries data
    const countryName = countries[code]
    if (countryName) {
      form.setValue('nome', countryName)
    }
  }

  const onSubmit = async (values: PaisFormValues) => {
    console.log('Pais Form Submit Values:', values)
    try {
      // Ensure we use the selectedCodigo if it's set
      const finalValues = {
        ...values,
        codigo: selectedCodigo || values.codigo,
        prefixo: values.prefixo || '', // Ensure prefixo is always a string
      }
      console.log('Final Submit Values:', finalValues)

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createPaisMutation.mutateAsync(finalValues)
      console.log('Pais Create Response:', response)

      const result = handleApiResponse(
        response,
        'País criado com sucesso',
        'Erro ao criar país',
        'País criado com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.nome },
            'pais',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            nome: values.nome,
          })
          onSuccess({
            id: response.info.data,
            nome: values.nome,
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
      toast.error(handleApiError(error, 'Erro ao criar país'))
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
          id='paisCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`pais-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do País</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Globe className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações do País
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas do país
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name='codigo'
                      render={({ field }) => (
                        <FormItem className='relative z-50'>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            País
                          </FormLabel>
                          <FormControl>
                            <ReactFlagsSelect
                              selected={selectedCodigo || field.value}
                              onSelect={(code) => {
                                handleCountrySelect(code)
                              }}
                              searchable
                              searchPlaceholder='Procurar país...'
                              placeholder='Selecione um país'
                              customLabels={countries}
                              className='flag-select'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='nome'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            Nome
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nome do país'
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
                      name='codigo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Código
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Código do país'
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
                      name='prefixo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Prefixo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Prefixo'
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
              disabled={createPaisMutation.isPending}
              className='w-full md:w-auto'
            >
              {createPaisMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PaisCreateForm
