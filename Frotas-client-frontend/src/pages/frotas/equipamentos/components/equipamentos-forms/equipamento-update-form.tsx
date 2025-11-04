import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useUpdateEquipamento } from '@/pages/frotas/equipamentos/queries/equipamentos-mutations'
import { useGetEquipamentoById } from '@/pages/frotas/equipamentos/queries/equipamentos-queries'
import { UpdateEquipamentoDTO } from '@/types/dtos/frotas/equipamentos.dtos'
import { Package, AlertCircle, FileText } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'

const equipamentoFormSchema = z.object({
  designacao: z
    .string({ message: 'A Designação é obrigatória' })
    .min(1, { message: 'A Designação é obrigatória' }),
  garantia: z
    .string({ message: 'A Garantia é obrigatória' })
    .min(1, { message: 'A Garantia é obrigatória' }),
  obs: z.string().optional(),
})

type EquipamentoFormSchemaType = z.infer<typeof equipamentoFormSchema>

interface EquipamentoUpdateFormProps {
  modalClose: () => void
  equipamentoId: string
  initialData: EquipamentoFormSchemaType
}

const EquipamentoUpdateForm = ({
  modalClose,
  equipamentoId,
  initialData,
}: EquipamentoUpdateFormProps) => {
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
  const { removeWindow } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `equipamento-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<EquipamentoFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
      garantia: 'detalhes',
      obs: 'detalhes',
    },
  })

  const updateEquipamentoMutation = useUpdateEquipamento()
  const { data: equipamentoData } = useGetEquipamentoById(equipamentoId)

  const effectiveWindowId = windowId || instanceId

  const equipamentoResolver: Resolver<EquipamentoFormSchemaType> = async (values) => {
    const result = equipamentoFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: any = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<EquipamentoFormSchemaType>({
    resolver: equipamentoResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  // Ref to store normalized API data for change detection
  const normalizedApiDataRef = useRef<any>(null)

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
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as EquipamentoFormSchemaType)
    } else if (equipamentoData?.info?.data) {
      const apiData = equipamentoData.info.data

      const normalizedApiData = {
        designacao: apiData.designacao,
        garantia: apiData.garantia,
        obs: apiData.obs,
      }

      if (!normalizedApiDataRef.current) {
        normalizedApiDataRef.current = {}
      }
      normalizedApiDataRef.current[equipamentoId] = normalizedApiData

      form.reset(normalizedApiData)
    }
  }, [formData, isInitialized, formId, hasFormData, equipamentoData, equipamentoId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        const normalizedOriginalData =
          normalizedApiDataRef.current?.[equipamentoId] ||
          equipamentoData?.info?.data ||
          {}
        const hasChanges = detectUpdateFormChanges(
          value,
          normalizedOriginalData
        )

        setFormState(formId, {
          formData: value as EquipamentoFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        updateWindowFormData(
          effectiveWindowId,
          hasChanges,
          setWindowHasFormData
        )

        const newTitle = value.designacao || 'Equipamento'
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, equipamentoData, formId, formData])

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)
    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  const onSubmit = async (values: EquipamentoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: UpdateEquipamentoDTO = {
        designacao: values.designacao,
        garantia: values.garantia,
        obs: values.obs,
      }

      const response = await updateEquipamentoMutation.mutateAsync({
        id: equipamentoId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Equipamento atualizado com sucesso',
        'Erro ao atualizar equipamento',
        'Equipamento atualizado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar equipamento'))
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
          id='equipamentoUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`equipamento-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Package className='h-4 w-4 mr-2' />
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='detalhes'>
                <FileText className='h-4 w-4 mr-2' />
                Detalhes
              </PersistentTabsTrigger>
            </PersistentTabsList>

            {/* TAB 1: IDENTIFICAÇÃO */}
            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Package className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação do Equipamento
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de identificação do equipamento
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='designacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Package className='h-4 w-4' />
                            Designação
                            <Badge variant='secondary' className='text-xs'>
                              Obrigatório
                            </Badge>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Digite a designação do equipamento'
                              {...field}
                              value={String(field.value ?? '')}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>

            {/* TAB 2: DETALHES */}
            <PersistentTabsContent value='detalhes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <FileText className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Detalhes do Equipamento
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações adicionais sobre o equipamento
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='garantia'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4' />
                            Garantia
                            <Badge variant='secondary' className='text-xs'>
                              Obrigatório
                            </Badge>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Digite a garantia do equipamento'
                              {...field}
                              value={String(field.value ?? '')}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='obs'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Observações
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Digite as observações sobre o equipamento (opcional)'
                              {...field}
                              value={String(field.value ?? '')}
                              className='px-4 py-3 shadow-inner drop-shadow-xl min-h-[120px] resize-y'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>
          </PersistentTabs>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='min-w-[120px]'
            >
              {form.formState.isSubmitting ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EquipamentoUpdateForm

