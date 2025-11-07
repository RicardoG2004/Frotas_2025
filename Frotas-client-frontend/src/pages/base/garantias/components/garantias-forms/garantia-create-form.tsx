import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateGarantia } from '@/pages/base/garantias/queries/garantias-mutations'
import { ShieldCheck, Calendar, Gauge, ChevronUp, ChevronDown } from 'lucide-react'
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

const garantiaFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
  anos: z
    .string()
    .min(1, { message: 'Os anos são obrigatórios' })
    .regex(/^[0-9]+$/, { message: 'Insira apenas números inteiros' }),
  kms: z
    .string()
    .min(1, { message: 'Os kms são obrigatórios' })
    .regex(/^[0-9]+$/, { message: 'Insira apenas números inteiros' }),
})

type GarantiaFormValues = z.infer<typeof garantiaFormSchema>

interface GarantiaCreateFormProps {
  modalClose: () => void
  initialDesignacao?: string
  onSuccess?: (newGarantia: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

const GarantiaCreateForm = ({
  modalClose,
  initialDesignacao,
  onSuccess,
  shouldCloseWindow = true,
}: GarantiaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `garantia-${instanceId}`

  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState, setWindowReturnData } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createGarantiaMutation = useCreateGarantia()

  const defaultValues = useMemo(
    () => ({
      designacao: '',
      anos: '',
      kms: '',
    }),
    []
  )

  const garantiaResolver: Resolver<GarantiaFormValues> = async (values) => {
    const normalizedValues: GarantiaFormValues = {
      designacao: values.designacao ?? '',
      anos: values.anos ?? '',
      kms: values.kms ?? '',
    }

    const result = garantiaFormSchema.safeParse(normalizedValues)
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

  const form = useForm<GarantiaFormValues>({
    resolver: garantiaResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `garantia-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<GarantiaFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      designacao: 'dados',
      anos: 'dados',
      kms: 'dados',
    },
  })

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
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as GarantiaFormValues)
    } else if (initialDesignacao) {
      form.reset({
        designacao: initialDesignacao || '',
        anos: '',
        kms: '',
      })
    }
  }, [formData, isInitialized, formId, hasFormData, initialDesignacao])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as GarantiaFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      if (effectiveWindowId) {
        updateCreateFormData(
          effectiveWindowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        updateCreateWindowTitle(
          effectiveWindowId,
          value.designacao,
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, defaultValues])

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: GarantiaFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const anosValue = Number.parseInt(values.anos, 10)
      const kmsValue = Number.parseInt(values.kms, 10)

      const response = await createGarantiaMutation.mutateAsync({
        designacao: values.designacao,
        anos: Number.isNaN(anosValue) ? 0 : anosValue,
        kms: Number.isNaN(kmsValue) ? 0 : kmsValue,
      })

      const result = handleApiResponse(
        response,
        'Garantia criada com sucesso',
        'Erro ao criar garantia',
        'Garantia criada com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, designacao: values.designacao },
            'garantia',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          onSuccess({
            id: response.info.data,
            designacao: values.designacao,
          })
        }

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar garantia'))
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
          id='garantiaCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`garantia-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Identificação da Garantia</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <ShieldCheck className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação da Garantia
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina os detalhes da garantia
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='designacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <ShieldCheck className='h-4 w-4' />
                            Designação
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a designação'
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
                      name='anos'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            Anos
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type='number'
                                placeholder='0'
                                min='0'
                                step='1'
                                {...field}
                                onChange={(event) => {
                                  const value = event.target.value
                                  if (value === '') {
                                    field.onChange('')
                                    return
                                  }
                                  const parsed = Math.max(0, parseInt(value, 10))
                                  field.onChange(Number.isNaN(parsed) ? '' : String(parsed))
                                }}
                                value={field.value ?? ''}
                                className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                  onClick={() => {
                                    const currentValue = parseInt(field.value || '0', 10) || 0
                                    const newValue = currentValue + 1
                                    field.onChange(String(newValue))
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
                                    const currentValue = parseInt(field.value || '0', 10) || 0
                                    const newValue = Math.max(0, currentValue - 1)
                                    field.onChange(String(newValue))
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

                    <FormField
                      control={form.control}
                      name='kms'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Gauge className='h-4 w-4' />
                            Kms
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type='number'
                                placeholder='0'
                                min='0'
                                step='1'
                                {...field}
                                onChange={(event) => {
                                  const value = event.target.value
                                  if (value === '') {
                                    field.onChange('')
                                    return
                                  }
                                  const parsed = Math.max(0, parseInt(value, 10))
                                  field.onChange(Number.isNaN(parsed) ? '' : String(parsed))
                                }}
                                value={field.value ?? ''}
                                className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                  onClick={() => {
                                    const currentValue = parseInt(field.value || '0', 10) || 0
                                    const newValue = currentValue + 1
                                    field.onChange(String(newValue))
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
                                    const currentValue = parseInt(field.value || '0', 10) || 0
                                    const newValue = Math.max(0, currentValue - 1)
                                    field.onChange(String(newValue))
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
              disabled={createGarantiaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createGarantiaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { GarantiaCreateForm }


