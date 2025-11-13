import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateGarantia } from '@/pages/base/garantias/queries/garantias-mutations'
import { useGetGarantia } from '@/pages/base/garantias/queries/garantias-queries'
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

interface GarantiaUpdateFormProps {
  modalClose: () => void
  garantiaId: string
  initialData: {
    designacao: string
    anos: string
    kms: string
  }
}

const GarantiaUpdateForm = ({
  modalClose,
  garantiaId,
  initialData,
}: GarantiaUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const removeWindow = useWindowsStore((state) => state.removeWindow)
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const updateGarantiaMutation = useUpdateGarantia()
  const { data: garantiaData } = useGetGarantia(garantiaId)

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
    defaultValues: initialData,
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
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId,
        })

        const initialTitle = initialData.designacao || 'Garantia'
        if (windowId) {
          updateUpdateWindowTitle(windowId, initialTitle, updateWindowState)
        }
      }
      isFirstRender.current = false
    }
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    initialData,
    windowId,
    updateWindowState,
  ])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as GarantiaFormValues)
      if (formData?.designacao && windowId) {
        updateUpdateWindowTitle(windowId, formData.designacao, updateWindowState)
      }
    } else if (garantiaData) {
      form.reset({
        designacao: garantiaData.designacao ?? '',
        anos: garantiaData.anos != null ? String(garantiaData.anos) : '',
        kms: garantiaData.kms != null ? String(garantiaData.kms) : '',
      })
      if (garantiaData.designacao && windowId) {
        updateUpdateWindowTitle(windowId, garantiaData.designacao, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    garantiaData,
    windowId,
    updateWindowState,
  ])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      setFormState(formId, {
        formData: value as GarantiaFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      if (windowId) {
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        updateUpdateWindowTitle(windowId, value.designacao, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  const handleClose = () => {
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: GarantiaFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const anosValue = Number.parseInt(values.anos, 10)
      const kmsValue = Number.parseInt(values.kms, 10)

      const response = await updateGarantiaMutation.mutateAsync({
        id: garantiaId,
        data: {
          designacao: values.designacao,
          anos: Number.isNaN(anosValue) ? 0 : anosValue,
          kms: Number.isNaN(kmsValue) ? 0 : kmsValue,
        },
      })

      const result = handleApiResponse(
        response,
        'Garantia atualizada com sucesso',
        'Erro ao atualizar garantia',
        'Garantia atualizada com avisos'
      )

      if (result.success) {
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar garantia'))
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
            tabKey={`garantia-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados' className='flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4' />
                Identificação
              </TabsTrigger>
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
                        Identificação
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Atualize os detalhes da garantia
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
              disabled={updateGarantiaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateGarantiaMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { GarantiaUpdateForm }


