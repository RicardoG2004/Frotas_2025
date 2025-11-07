import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateTaxaIva } from '@/pages/base/taxasIva/queries/taxasIva-mutations'
import { useGetTaxaIva } from '@/pages/base/taxasIva/queries/taxasIva-queries'
import { Percent, Tag, Settings, ChevronUp, ChevronDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  detectUpdateFormChanges,
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
import { Switch } from '@/components/ui/switch'
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

interface TaxaIvaUpdateFormProps {
  modalClose: () => void
  taxaIvaId: string
  initialData: {
    descricao: string
    valor: number
    ativo: boolean
  }
}

const TaxaIvaUpdateForm = ({
  modalClose,
  taxaIvaId,
  initialData,
}: TaxaIvaUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const updateTaxaIvaMutation = useUpdateTaxaIva()
  const { data: taxaIvaData } = useGetTaxaIva(taxaIvaId)

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
    defaultValues: {
      descricao: '',
      valor: 0,
      ativo: true,
    },
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
      ativo: 'dados',
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
          formData: initialData,
          isDirty: false,
          isValid: true,
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
      form.reset(formData as TaxaIvaFormValues)
      // Update window title with initial form data
      if (formData?.descricao && windowId) {
        updateUpdateWindowTitle(windowId, formData.descricao, updateWindowState)
      }
    } else if (taxaIvaData) {
      // If no saved data, use the data from the API
      const taxaIva = taxaIvaData
      form.reset({
        descricao: taxaIva.descricao,
        valor: taxaIva.valor,
        ativo: taxaIva.ativo,
      })
      // Update window title with API data
      if (taxaIva.descricao && windowId) {
        updateUpdateWindowTitle(windowId, taxaIva.descricao, updateWindowState)
      }
    }
  }, [formData, isInitialized, formId, hasFormData, taxaIvaData, windowId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as TaxaIvaFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: windowId,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        if (value.descricao && value.descricao !== formData?.descricao) {
          updateUpdateWindowTitle(windowId, value.descricao, updateWindowState)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    windowId,
    formId,
    initialData,
    formData,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: TaxaIvaFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateTaxaIvaMutation.mutateAsync({
        id: taxaIvaId,
        data: {
          Descricao: values.descricao,
          Valor: values.valor,
          Ativo: values.ativo,
        },
      }) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Taxa de IVA atualizada com sucesso',
        'Erro ao atualizar taxa de IVA',
        'Taxa de IVA atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar taxa de IVA'))
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

                  <div className='space-y-3'>
                    <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                      <Settings className='h-4 w-4 text-primary' />
                      Configurações da Taxa
                    </div>
                    <FormField
                      control={form.control}
                      name='ativo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            Estado
                            <Badge variant='secondary' className='text-xs opacity-0 pointer-events-none'>
                              Obrigatório
                            </Badge>
                          </FormLabel>
                          <FormControl>
                            <div className='w-full rounded-lg border border-input bg-background px-4 py-3.5 shadow-inner drop-shadow-xl flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-red-500'}`}
                                />
                                <span className='text-sm text-muted-foreground'>Ativo</span>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={updateTaxaIvaMutation.isPending}
                              />
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
              disabled={updateTaxaIvaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateTaxaIvaMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { TaxaIvaUpdateForm }

