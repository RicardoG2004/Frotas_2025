import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateDistrito } from '@/pages/base/distritos/queries/distritos-mutations'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { Tag, Globe } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Flag from 'react-world-flags'
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
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const distritoFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  paisId: z.string().min(1, { message: 'O país é obrigatório' }),
})

type DistritoFormValues = z.infer<typeof distritoFormSchema>

interface DistritoCreateFormProps {
  modalClose: () => void
  preSelectedPaisId?: string
  initialNome?: string
  onSuccess?: (newDistrito: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const DistritoCreateForm = ({
  modalClose,
  preSelectedPaisId,
  initialNome,
  onSuccess,
  shouldCloseWindow = true,
}: DistritoCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `distrito-${instanceId}`

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

  const { data: paisesData, isLoading, refetch } = useGetPaisesSelect()
  const createDistritoMutation = useCreateDistrito()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      nome: '',
      paisId: '',
    }),
    []
  )

  const distritoResolver: Resolver<DistritoFormValues> = async (values) => {
    const result = distritoFormSchema.safeParse(values)
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

  const form = useForm<DistritoFormValues>({
    resolver: distritoResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const [selectedPaisId, setSelectedPaisId] = useState<string>('')

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `distrito-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<DistritoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      paisId: 'dados',
    },
  })

  // Use the combined auto-selection hook for paises (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: paisesData || [],
    setValue: (value: string) => {
      setSelectedPaisId(value)
      form.setValue('paisId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch,
    itemName: 'País',
    successMessage: 'País selecionado automaticamente',
    manualSelectionMessage:
      'País criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['paises-select'],
    returnDataKey: `return-data-${effectiveWindowId}-pais`, // Not used in create forms, but required by hook
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
      form.reset(formData as DistritoFormValues)
    } else if (preSelectedPaisId || initialNome) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: initialNome || '',
        paisId: preSelectedPaisId || '',
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedPaisId,
    initialNome,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as DistritoFormValues,
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

  const onSubmit = async (values: DistritoFormValues) => {
    console.log('Distrito Form Submit Values:', values)
    try {
      // Ensure we use the selectedPaisId if it's set
      const finalValues = {
        ...values,
        paisId: selectedPaisId || values.paisId,
      }
      console.log('Final Submit Values:', finalValues)

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createDistritoMutation.mutateAsync(finalValues)

      console.log('Distrito Create Response:', response)

      const result = handleApiResponse(
        response,
        'Distrito criado com sucesso',
        'Erro ao criar distrito',
        'Distrito criado com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.nome },
            'distrito',
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
      toast.error(handleApiError(error, 'Erro ao criar distrito'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedPaises =
    paisesData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='distritoCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`distrito-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Distrito</TabsTrigger>
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
                        Informações do Distrito
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas do distrito
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
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
                              placeholder='Introduza o nome'
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
                      name='paisId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            País
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                setSelectedPaisId(value)
                                field.onChange(value)
                              }}
                              value={selectedPaisId || field.value}
                              disabled={isLoading}
                            >
                              <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                <SelectValue
                                  placeholder={
                                    isLoading
                                      ? 'A carregar...'
                                      : 'Selecione um país'
                                  }
                                >
                                  {field.value &&
                                    paisesData?.find(
                                      (p) => p.id === field.value
                                    ) && (
                                      <div className='flex items-center gap-2'>
                                        <Flag
                                          code={
                                            paisesData?.find(
                                              (p) => p.id === field.value
                                            )?.codigo
                                          }
                                          height={16}
                                          width={24}
                                          fallback={<span>🏳️</span>}
                                        />
                                        {
                                          paisesData?.find(
                                            (p) => p.id === field.value
                                          )?.nome
                                        }
                                      </div>
                                    )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {sortedPaises.map((pais) => (
                                  <SelectItem
                                    key={pais.id || ''}
                                    value={pais.id || ''}
                                  >
                                    <div className='flex items-center gap-2'>
                                      <Flag
                                        code={pais.codigo}
                                        height={16}
                                        width={24}
                                        fallback={<span>🏳️</span>}
                                      />
                                      {pais.nome}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
              disabled={createDistritoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createDistritoMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { DistritoCreateForm }
