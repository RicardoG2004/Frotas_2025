import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Wrench, User, Car, Clock, CalendarIcon, Building2, Eye, Plus, DollarSign, Settings, Trash2, ChevronUp, Save, FileText, CalendarDays, PiggyBank } from 'lucide-react'
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
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { DatePicker } from '@/components/ui/date-picker'
import { useUpdateManutencao } from '../../queries/manutencoes-mutations'
import { UpdateManutencaoDTO } from '@/types/dtos/frotas/manutencoes.dtos'
import { useGetFsesSelect } from '@/pages/base/fses/queries/fses-queries'
import { useGetFuncionariosSelect } from '@/pages/base/funcionarios/queries/funcionarios-queries'
import { useGetViaturasSelect } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { useGetServicosSelect } from '@/pages/frotas/servicos/queries/servicos-queries'
import { format } from 'date-fns'

const FIELD_HEIGHT_CLASS = 'h-12'
const SELECT_WITH_ACTIONS_CLASS = `${FIELD_HEIGHT_CLASS} px-4 pr-32 shadow-inner drop-shadow-xl`
const TEXT_INPUT_CLASS = `${FIELD_HEIGHT_CLASS} px-4 shadow-inner drop-shadow-xl`

const manutencaoServicoSchema = z.object({
  id: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.string().optional()
  ),
  servicoId: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  quantidade: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'A quantidade deve ser maior ou igual a 0' }).optional()
  ),
  kmProxima: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'Os KMs devem ser positivos' }).optional().nullable()
  ),
  dataProxima: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  valorSemIva: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'O valor deve ser positivo' }).optional()
  ),
  ivaPercentagem: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'A percentagem de IVA deve ser positiva' }).optional()
  ),
  valorTotal: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'O valor total deve ser positivo' }).optional()
  ),
})

const ManutencaoFormSchema = z.object({
  dataRequisicao: z.date({ message: 'A Data de Requisição é obrigatória' }).nullable().refine((val) => val !== null, { message: 'A Data de Requisição é obrigatória' }),
  fseId: z.string().min(1, { message: 'O Fornecedor de Serviços Externos é obrigatório' }),
  funcionarioId: z.string().min(1, { message: 'O Funcionário é obrigatório' }),
  dataEntrada: z.date({ message: 'A Data de Entrada é obrigatória' }).nullable().refine((val) => val !== null, { message: 'A Data de Entrada é obrigatória' }),
  horaEntrada: z.string().min(1, { message: 'A Hora de Entrada é obrigatória' }),
  dataSaida: z.date({ message: 'A Data de Saída é obrigatória' }).nullable().refine((val) => val !== null, { message: 'A Data de Saída é obrigatória' }),
  horaSaida: z.string().min(1, { message: 'A Hora de Saída é obrigatória' }),
  viaturaId: z.string().min(1, { message: 'A Viatura é obrigatória' }),
  kmsRegistados: z
    .number({ message: 'Os KMs Registados são obrigatórios' })
    .min(0, { message: 'Os KMs Registados devem ser maior ou igual a 0' }),
  totalSemIva: z
    .number({ message: 'O Total S/ IVA é obrigatório' })
    .min(0, { message: 'O Total S/ IVA deve ser maior ou igual a 0' }),
  valorIva: z
    .number({ message: 'O Valor do IVA é obrigatório' })
    .min(0, { message: 'O Valor do IVA deve ser maior ou igual a 0' }),
  total: z
    .number({ message: 'O Total é obrigatório' })
    .min(0, { message: 'O Total deve ser maior ou igual a 0' }),
  servicos: z.array(manutencaoServicoSchema).optional().default([]),
})

type ManutencaoFormSchemaType = z.infer<typeof ManutencaoFormSchema>

interface ManutencaoUpdateFormProps {
  modalClose: () => void
  manutencaoId: string
  initialData: ManutencaoFormSchemaType
}

const ManutencaoUpdateForm = ({
  modalClose,
  manutencaoId,
  initialData,
}: ManutencaoUpdateFormProps) => {
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
  const { removeWindow, updateWindowState, findWindowByPathAndInstanceId } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  // Handlers for create/view buttons
  const handleCreateFse = () => {
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/fses/create?instanceId=${instanceId}`)
  }

  const handleViewFse = () => {
    const fseId = form.getValues('fseId')
    if (!fseId) {
      toast.error('Por favor, selecione um Fornecedor de Serviços Externos primeiro')
      return
    }
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/fses/update?fseId=${fseId}&instanceId=${instanceId}`)
  }

  const handleCreateFuncionario = () => {
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/funcionarios/create?instanceId=${instanceId}`)
  }

  const handleViewFuncionario = () => {
    const funcionarioId = form.getValues('funcionarioId')
    if (!funcionarioId) {
      toast.error('Por favor, selecione um funcionário primeiro')
      return
    }
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/funcionarios/update?funcionarioId=${funcionarioId}&instanceId=${instanceId}`)
  }

  const handleCreateViatura = () => {
    const instanceId = crypto.randomUUID()
    navigate(`/frotas/viaturas/create?instanceId=${instanceId}`)
  }

  const handleViewViatura = () => {
    const viaturaId = form.getValues('viaturaId')
    if (!viaturaId) {
      toast.error('Por favor, selecione uma viatura primeiro')
      return
    }
    const instanceId = crypto.randomUUID()
    navigate(`/frotas/viaturas/update?viaturaId=${viaturaId}&instanceId=${instanceId}`)
  }

  const effectiveWindowId = windowId || instanceId

  const updateManutencaoMutation = useUpdateManutencao()

  const { data: fsesData, isLoading: isLoadingFses, refetch: refetchFses } =
    useGetFsesSelect()
  const {
    data: funcionariosData,
    isLoading: isLoadingFuncionarios,
    refetch: refetchFuncionarios,
  } = useGetFuncionariosSelect()
  const {
    data: viaturasData,
    isLoading: isLoadingViaturas,
    refetch: refetchViaturas,
  } = useGetViaturasSelect()
  const {
    data: servicosData,
    isLoading: isLoadingServicos,
  } = useGetServicosSelect()

  const form = useForm<ManutencaoFormSchemaType>({
    resolver: zodResolver(ManutencaoFormSchema),
    defaultValues: initialData,
    mode: 'onSubmit',
  })

  const [savedServicos, setSavedServicos] = useState<Set<string>>(new Set())
  const [expandedServicos, setExpandedServicos] = useState<Set<string>>(new Set())

  const {
    fields: servicoFields,
    append: appendServico,
    remove: removeServico,
  } = useFieldArray({
    control: form.control,
    name: 'servicos',
    keyName: 'fieldId',
  })

  // Não usar watch para evitar re-renders durante a digitação
  // Usar getValues apenas quando necessário

  const { handleSubmit, handleError } = useSubmitErrorTab(form, formId)


  useTabManager({
    formId,
    form,
    defaultValues: initialData,
    windowId: effectiveWindowId,
  })

  // Inicializar serviços vindos do backend como guardados
  useEffect(() => {
    if (servicoFields.length > 0) {
      servicoFields.forEach((servico, index) => {
        const servicoData = form.getValues(`servicos.${index}`)
        if (servicoData?.id) {
          setSavedServicos((prev) => {
            const next = new Set(prev)
            if (!next.has(servico.fieldId)) {
              next.add(servico.fieldId)
            }
            return next
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicoFields.length])

  useEffect(() => {
    if (isFirstRender.current) {
      if (!hasBeenVisited) {
        resetFormState(formId, {
          formData: initialData,
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
      form.reset(formData as ManutencaoFormSchemaType)
    } else {
      form.reset(initialData)
    }
  }, [formData, isInitialized, formId, hasFormData, initialData])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const subscription = form.watch((value) => {
      // Não atualizar se houver um input focado (evita perder o foco durante a digitação)
      const activeElement = document.activeElement
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA'
      
      if (isInputFocused) {
        // Se há um input focado, usar debounce mais longo para evitar interrupções
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        timeoutId = setTimeout(() => {
          // Verificar novamente se ainda está focado antes de atualizar
          const stillFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA'
          if (stillFocused) {
            return // Não atualizar se ainda estiver digitando
          }
          
          const hasChanges = detectUpdateFormChanges(value, initialData)
          if (JSON.stringify(value) !== JSON.stringify(formData)) {
            setFormState(formId, {
              formData: value as ManutencaoFormSchemaType,
              isDirty: hasChanges,
              isValid: form.formState.isValid,
              isSubmitting: form.formState.isSubmitting,
              hasBeenModified: hasChanges,
              windowId: effectiveWindowId,
            })

            if (effectiveWindowId) {
              updateWindowFormData(
                effectiveWindowId,
                value,
                setWindowHasFormData,
                initialData
              )
              const newTitle = 'Atualizar Manutenção'
              updateUpdateWindowTitle(
                effectiveWindowId,
                newTitle,
                updateWindowState
              )
            }
          }
        }, 1000) // Debounce maior quando há input focado
      } else {
        // Se não há input focado, atualizar normalmente com debounce menor
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        timeoutId = setTimeout(() => {
          const hasChanges = detectUpdateFormChanges(value, initialData)
          if (JSON.stringify(value) !== JSON.stringify(formData)) {
            setFormState(formId, {
              formData: value as ManutencaoFormSchemaType,
              isDirty: hasChanges,
              isValid: form.formState.isValid,
              isSubmitting: form.formState.isSubmitting,
              hasBeenModified: hasChanges,
              windowId: effectiveWindowId,
            })

            if (effectiveWindowId) {
              updateWindowFormData(
                effectiveWindowId,
                value,
                setWindowHasFormData,
                initialData
              )
              const newTitle = 'Atualizar Manutenção'
              updateUpdateWindowTitle(
                effectiveWindowId,
                newTitle,
                updateWindowState
              )
            }
          }
        }, 300) // Debounce menor quando não há input focado
      }
    })
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      subscription.unsubscribe()
    }
  }, [form, effectiveWindowId, formId, formData, initialData])

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: fsesData,
    setValue: (value: string) => {
      form.setValue('fseId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchFses,
    itemName: 'Fornecedor de Serviços Externos',
    successMessage: 'Fornecedor de Serviços Externos selecionado automaticamente',
    manualSelectionMessage: 'Fornecedor de Serviços Externos criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['fses-select'],
    returnDataKey: `return-data-${effectiveWindowId}-fse`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: funcionariosData,
    setValue: (value: string) => {
      form.setValue('funcionarioId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchFuncionarios,
    itemName: 'Funcionário',
    successMessage: 'Funcionário selecionado automaticamente',
    manualSelectionMessage: 'Funcionário criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['funcionarios-select'],
    returnDataKey: `return-data-${effectiveWindowId}-funcionario`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: viaturasData,
    setValue: (value: string) => {
      form.setValue('viaturaId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchViaturas,
    itemName: 'Viatura',
    successMessage: 'Viatura selecionada automaticamente',
    manualSelectionMessage: 'Viatura criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['viaturas-select'],
    returnDataKey: `return-data-${effectiveWindowId}-viatura`,
  })

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)
    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  const handleAddServico = () => {
    appendServico({
      id: undefined,
      servicoId: '',
      quantidade: undefined,
      kmProxima: undefined,
      dataProxima: undefined as any,
      valorSemIva: undefined,
      ivaPercentagem: undefined,
      valorTotal: undefined,
    })
  }

  const handleRemoveServico = (index: number) => {
    const servico = servicoFields[index]
    if (servico) {
      setSavedServicos((prev) => {
        const next = new Set(prev)
        next.delete(servico.fieldId)
        return next
      })
      setExpandedServicos((prev) => {
        const next = new Set(prev)
        next.delete(servico.fieldId)
        return next
      })
    }
    removeServico(index)
  }

  const handleSaveServico = (index: number) => {
    const servico = servicoFields[index]
    if (!servico) return

    const servicoData = form.getValues(`servicos.${index}`)
    if (!servicoData) return

    // Campos são opcionais, não há validação obrigatória

    setSavedServicos((prev) => new Set(prev).add(servico.fieldId))
    setExpandedServicos((prev) => {
      const next = new Set(prev)
      next.delete(servico.fieldId)
      return next
    })
    toast.success('Serviço guardado com sucesso.')
  }

  const handleToggleExpandServico = (index: number) => {
    const servico = servicoFields[index]
    if (!servico) return

    setExpandedServicos((prev) => {
      const next = new Set(prev)
      if (next.has(servico.fieldId)) {
        next.delete(servico.fieldId)
      } else {
        next.add(servico.fieldId)
      }
      return next
    })
  }

  const formatDateLabel = (date: Date | string | null | undefined): string => {
    if (!date) return ''
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return ''
      return format(dateObj, 'dd/MM/yyyy')
    } catch {
      return ''
    }
  }

  const onSubmit = async (values: ManutencaoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const servicosPayload = values.servicos
        ?.filter((servico) => servico.servicoId) // Apenas filtrar serviços que tenham um serviço selecionado
        .map((servico) => ({
          servicoId: servico.servicoId,
          quantidade: servico.quantidade ?? 0,
          kmProxima: servico.kmProxima ?? null,
          dataProxima: servico.dataProxima ? format(servico.dataProxima, 'yyyy-MM-dd') : null,
          valorSemIva: servico.valorSemIva ?? 0,
          ivaPercentagem: servico.ivaPercentagem ?? 0,
          valorTotal: servico.valorTotal ?? 0,
        })) || []

      const requestData: UpdateManutencaoDTO = {
        dataRequisicao: values.dataRequisicao ? format(values.dataRequisicao, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        fseId: values.fseId,
        funcionarioId: values.funcionarioId,
        dataEntrada: values.dataEntrada ? format(values.dataEntrada, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        horaEntrada: values.horaEntrada,
        dataSaida: values.dataSaida ? format(values.dataSaida, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        horaSaida: values.horaSaida,
        viaturaId: values.viaturaId,
        kmsRegistados: values.kmsRegistados,
        totalSemIva: values.totalSemIva,
        valorIva: values.valorIva,
        total: values.total,
        servicos: servicosPayload.length > 0 ? servicosPayload : undefined,
      }

      const response = await updateManutencaoMutation.mutateAsync({
        id: manutencaoId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Manutenção atualizada com sucesso',
        'Erro ao atualizar Manutenção',
        'Manutenção atualizada com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar Manutenção'))
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
          id='manutencaoUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='informacoes'
            className='w-full'
            tabKey={`manutencao-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='informacoes'>
                <Wrench className='mr-2 h-4 w-4' />
                Informações
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='servicos' className='h-9 px-3 py-1.5'>
                <Settings className='mr-2 h-4 w-4' />
                Serviços
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='informacoes'>
              <div className='grid grid-cols-1 lg:grid-cols-[0.8fr_1.5fr_0.5fr] gap-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Calendar className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base'>
                          Informações Gerais
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='dataRequisicao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CalendarIcon className='h-4 w-4' />
                              Data Requisição
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione a data de requisição'
                                className='h-12'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='viaturaId'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='flex items-center gap-2'>
                              <Car className='h-4 w-4' />
                              Viatura
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={
                                    viaturasData?.map((viatura) => {
                                      const matricula = viatura.matricula || ''
                                      const marca = viatura.marca?.nome || ''
                                      const modelo = viatura.modelo?.nome || ''
                                      const label =
                                        marca && modelo
                                          ? `${matricula} / ${marca} ${modelo}`
                                          : matricula
                                      return {
                                        value: viatura.id || '',
                                        label: label,
                                      }
                                    }) || []
                                  }
                                  value={field.value || ''}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingViaturas
                                      ? 'A carregar...'
                                      : 'Selecione uma viatura'
                                  }
                                  emptyText='Nenhuma viatura encontrada.'
                                  disabled={isLoadingViaturas}
                                  className='px-4 py-6 shadow-inner pr-24'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewViatura}
                                    className='h-8 w-8 p-0'
                                    title='Ver Viatura'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateViatura}
                                    className='h-8 w-8 p-0'
                                    title='Criar Viatura'
                                  >
                                    <Plus className='h-4 w-4' />
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
                        name='kmsRegistados'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Car className='h-4 w-4' />
                              KMs Registados
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className='px-4 py-6 shadow-inner'
                                min={0}
                                step={1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Building2 className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base'>
                          Oficina
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='fseId'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Fornecedores de Serviços Externos
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={
                                    fsesData?.map((fse) => ({
                                      value: fse.id || '',
                                      label: fse.nome || '',
                                    })) || []
                                  }
                                  value={field.value || ''}
                                  onValueChange={field.onChange}
                                placeholder={
                                  isLoadingFses
                                    ? 'A carregar...'
                                    : 'Selecione um FSE'
                                }
                                emptyText='Nenhum Fornecedor de Serviços Externos encontrado.'
                                  disabled={isLoadingFses}
                                  className='px-4 py-6 shadow-inner pr-24'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewFse}
                                    className='h-8 w-8 p-0'
                                    title='Ver Fornecedor de Serviços Externos'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateFse}
                                    className='h-8 w-8 p-0'
                                    title='Criar Fornecedor de Serviços Externos'
                                  >
                                    <Plus className='h-4 w-4' />
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
                        name='funcionarioId'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Funcionário
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={
                                    funcionariosData?.map((funcionario) => {
                                      const nome = funcionario.nome || ''
                                      const cargo = funcionario.cargo?.designacao || ''
                                      const label = cargo ? `${nome} / ${cargo}` : nome
                                      return {
                                        value: funcionario.id || '',
                                        label: label,
                                      }
                                    }) || []
                                  }
                                  value={field.value || ''}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingFuncionarios
                                      ? 'A carregar...'
                                      : 'Selecione um funcionário'
                                  }
                                  emptyText='Nenhum funcionário encontrado.'
                                  disabled={isLoadingFuncionarios}
                                  className='px-4 py-6 shadow-inner pr-24'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewFuncionario}
                                    className='h-8 w-8 p-0'
                                    title='Ver Funcionário'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateFuncionario}
                                    className='h-8 w-8 p-0'
                                    title='Criar Funcionário'
                                  >
                                    <Plus className='h-4 w-4' />
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
                        name='dataEntrada'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CalendarIcon className='h-4 w-4' />
                              Data Entrada
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione a data de entrada'
                                className='h-12'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='horaEntrada'
                        render={({ field }) => {
                          const currentValue = field.value || ''
                          const [hours, minutes] = currentValue ? currentValue.split(':').map(Number) : [0, 0]
                          const displayHours = isNaN(hours) ? 0 : hours
                          const displayMinutes = isNaN(minutes) ? 0 : minutes
                          const formattedTime = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`

                          const updateTime = useCallback((newHours: number, newMinutes: number) => {
                            const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
                            field.onChange(formatted)
                          }, [field])

                          const [isSelectingHours, setIsSelectingHours] = useState(true)
                          const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
                          const [open, setOpen] = useState(false)
                          const clockRef = useRef<HTMLDivElement>(null)
                          const startHour24Ref = useRef<number | null>(null)
                          const startAngleRef = useRef<number | null>(null)
                          const lastAngleRef = useRef<number | null>(null)
                          const unwrappedAngleRef = useRef<number>(0)
                          
                          const hour12 = displayHours % 12 || 12
                          const hourPosition = hour12 === 12 ? 0 : hour12
                          const hourAngle = (hourPosition * 30) + (displayMinutes * 0.5) - 90
                          const minuteAngle = (displayMinutes * 6) - 90

                          const calculateAngleFromMouse = (clientX: number, clientY: number) => {
                            if (!clockRef.current) return 0
                            const rect = clockRef.current.getBoundingClientRect()
                            const centerX = rect.left + rect.width / 2
                            const centerY = rect.top + rect.height / 2
                            const clickX = clientX - centerX
                            const clickY = clientY - centerY
                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                            if (angle < 0) angle += 360
                            return angle
                          }

                          const handlePointerMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(type)
                            setIsSelectingHours(type === 'hour')
                            
                            const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                            
                            if (type === 'hour') {
                              startHour24Ref.current = displayHours
                              startAngleRef.current = angle
                            } else {
                              let newMinute = Math.round(angle / 6)
                              if (newMinute >= 60) newMinute = 0
                              if (newMinute < 0) newMinute = 0
                              updateTime(displayHours, newMinute)
                            }
                          }

                          useEffect(() => {
                            if (!isDragging) {
                              startHour24Ref.current = null
                              startAngleRef.current = null
                              lastAngleRef.current = null
                              unwrappedAngleRef.current = 0
                              return
                            }

                            const handleMouseMove = (e: MouseEvent) => {
                              const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                              
                              if (isDragging === 'hour') {
                                const startHour24 = startHour24Ref.current
                                const startAngle = startAngleRef.current
                                
                                if (startAngle !== null && startHour24 !== null) {
                                  if (lastAngleRef.current === null) {
                                    lastAngleRef.current = angle
                                    unwrappedAngleRef.current = startAngle
                                  } else {
                                    let delta = angle - lastAngleRef.current
                                    if (delta > 180) {
                                      delta -= 360
                                    } else if (delta < -180) {
                                      delta += 360
                                    }
                                    unwrappedAngleRef.current += delta
                                    lastAngleRef.current = angle
                                  }
                                  
                                  const totalRotation = unwrappedAngleRef.current - startAngle
                                  const hoursDelta = totalRotation / 15
                                  let newHour24 = startHour24 + hoursDelta
                                  newHour24 = ((newHour24 % 24) + 24) % 24
                                  const finalHour = Math.round(newHour24)
                                  
                                  if (finalHour >= 0 && finalHour <= 23) {
                                    updateTime(finalHour, displayMinutes)
                                  }
                                }
                              } else {
                                let newMinute = Math.round(angle / 6)
                                if (newMinute >= 60) newMinute = 0
                                if (newMinute < 0) newMinute = 0
                                updateTime(displayHours, newMinute)
                              }
                            }

                            const handleMouseUp = () => {
                              setIsDragging(null)
                              startHour24Ref.current = null
                              startAngleRef.current = null
                              lastAngleRef.current = null
                              unwrappedAngleRef.current = 0
                            }

                            window.addEventListener('mousemove', handleMouseMove)
                            window.addEventListener('mouseup', handleMouseUp)

                            return () => {
                              window.removeEventListener('mousemove', handleMouseMove)
                              window.removeEventListener('mouseup', handleMouseUp)
                            }
                          }, [isDragging, displayHours, displayMinutes, updateTime])

                          const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const centerX = rect.left + rect.width / 2
                            const centerY = rect.top + rect.height / 2
                            const clickX = e.clientX - centerX
                            const clickY = e.clientY - centerY
                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                            if (angle < 0) angle += 360

                            if (isSelectingHours) {
                              let newHour12 = Math.round(angle / 30)
                              if (newHour12 === 0 || newHour12 === 12) newHour12 = 12
                              const isPM = displayHours >= 12
                              const hour24 = newHour12 === 12 
                                ? (isPM ? 12 : 0)
                                : (isPM ? newHour12 + 12 : newHour12)
                              updateTime(hour24, displayMinutes)
                            } else {
                              let newMinute = Math.round(angle / 6)
                              if (newMinute >= 60) newMinute = 0
                              if (newMinute < 0) newMinute = 0
                              updateTime(displayHours, newMinute)
                            }
                          }
                          
                          return (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Clock className='h-4 w-4' />
                                Hora Entrada
                              </FormLabel>
                              <FormControl>
                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <div className='relative cursor-pointer'>
                                      <Input
                                        type='time'
                                        placeholder='HH:mm'
                                        value={currentValue}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className='px-4 py-6 shadow-inner pl-12 cursor-pointer'
                                        readOnly
                                        onClick={() => setOpen(true)}
                                      />
                                      <Clock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-auto p-6' align='start'>
                                    <div className='space-y-4'>
                                      <div className='relative w-48 h-48 mx-auto'>
                                        <div
                                          ref={clockRef}
                                          className='relative w-full h-full rounded-full border-4 border-border bg-gradient-to-br from-background to-muted/20 shadow-lg cursor-pointer hover:border-primary/50 transition-colors'
                                          onClick={handleClockClick}
                                        >
                                          {Array.from({ length: 12 }).map((_, i) => {
                                            const hourNumber = i === 0 ? 12 : i
                                            const angle = (i * 30) - 90
                                            const rad = (angle * Math.PI) / 180
                                            const radius = 75
                                            const centerX = 92
                                            const centerY = 92
                                            const x = centerX + radius * Math.cos(rad)
                                            const y = centerY + radius * Math.sin(rad)
                                            
                                            return (
                                              <div
                                                key={i}
                                                className='absolute text-base font-bold text-foreground select-none'
                                                style={{
                                                  left: `${x}px`,
                                                  top: `${y}px`,
                                                  transform: 'translate(-50%, -50%)',
                                                }}
                                              >
                                                {hourNumber}
                                              </div>
                                            )
                                          })}

                                          {Array.from({ length: 60 }).map((_, i) => {
                                            if (i % 5 === 0) return null
                                            const angle = (i * 6) - 90
                                            const rad = (angle * Math.PI) / 180
                                            const radius = 90
                                            const centerX = 92
                                            const centerY = 92
                                            const x = centerX + radius * Math.cos(rad)
                                            const y = centerY + radius * Math.sin(rad)
                                            
                                            return (
                                              <div
                                                key={i}
                                                className='absolute w-1 h-1 rounded-full bg-muted-foreground/30'
                                                style={{
                                                  left: `${x}px`,
                                                  top: `${y}px`,
                                                  transform: 'translate(-50%, -50%)',
                                                }}
                                              />
                                            )
                                          })}

                                          <div
                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-20 cursor-grab active:cursor-grabbing'
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              width: isSelectingHours ? '4px' : '2px',
                                              height: '45px',
                                              transform: `translate(-50%, -100%) rotate(${hourAngle + 90}deg)`,
                                              transformOrigin: '50% 100%',
                                              opacity: isSelectingHours ? 1 : 0.5,
                                              borderRadius: '2px 2px 0 0',
                                            }}
                                            onMouseDown={(e) => handlePointerMouseDown(e, 'hour')}
                                          />

                                          <div
                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-30 cursor-grab active:cursor-grabbing'
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              width: !isSelectingHours ? '3px' : '2px',
                                              height: '64px',
                                              transform: `translate(-50%, -100%) rotate(${minuteAngle + 90}deg)`,
                                              transformOrigin: '50% 100%',
                                              opacity: !isSelectingHours ? 1 : 0.5,
                                              borderRadius: '2px 2px 0 0',
                                            }}
                                            onMouseDown={(e) => handlePointerMouseDown(e, 'minute')}
                                          />

                                          <div className='absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground border-4 border-background shadow-md z-10' />
                                        </div>
                                      </div>

                                      <div className='flex items-center justify-center gap-2 pt-2 border-t'>
                                        <Input
                                          type='number'
                                          min={0}
                                          max={23}
                                          value={displayHours}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0
                                            const clamped = Math.max(0, Math.min(23, val))
                                            updateTime(clamped, displayMinutes)
                                          }}
                                          className='w-16 text-center'
                                          placeholder='00'
                                        />
                                        <span className='text-lg font-medium'>:</span>
                                        <Input
                                          type='number'
                                          min={0}
                                          max={59}
                                          value={displayMinutes}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0
                                            const clamped = Math.max(0, Math.min(59, val))
                                            updateTime(displayHours, clamped)
                                          }}
                                          className='w-16 text-center'
                                          placeholder='00'
                                        />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name='dataSaida'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CalendarIcon className='h-4 w-4' />
                              Data Saída
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione a data de saída'
                                className='h-12'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='horaSaida'
                        render={({ field }) => {
                          const currentValue = field.value || ''
                          const [hours, minutes] = currentValue ? currentValue.split(':').map(Number) : [0, 0]
                          const displayHours = isNaN(hours) ? 0 : hours
                          const displayMinutes = isNaN(minutes) ? 0 : minutes
                          const formattedTime = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`

                          const updateTime = useCallback((newHours: number, newMinutes: number) => {
                            const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
                            field.onChange(formatted)
                          }, [field])

                          const [isSelectingHours, setIsSelectingHours] = useState(true)
                          const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
                          const [open, setOpen] = useState(false)
                          const clockRef = useRef<HTMLDivElement>(null)
                          const startHour24Ref = useRef<number | null>(null)
                          const startAngleRef = useRef<number | null>(null)
                          const lastAngleRef = useRef<number | null>(null)
                          const unwrappedAngleRef = useRef<number>(0)
                          
                          const hour12 = displayHours % 12 || 12
                          const hourPosition = hour12 === 12 ? 0 : hour12
                          const hourAngle = (hourPosition * 30) + (displayMinutes * 0.5) - 90
                          const minuteAngle = (displayMinutes * 6) - 90

                          const calculateAngleFromMouse = (clientX: number, clientY: number) => {
                            if (!clockRef.current) return 0
                            const rect = clockRef.current.getBoundingClientRect()
                            const centerX = rect.left + rect.width / 2
                            const centerY = rect.top + rect.height / 2
                            const clickX = clientX - centerX
                            const clickY = clientY - centerY
                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                            if (angle < 0) angle += 360
                            return angle
                          }

                          const handlePointerMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(type)
                            setIsSelectingHours(type === 'hour')
                            
                            const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                            
                            if (type === 'hour') {
                              startHour24Ref.current = displayHours
                              startAngleRef.current = angle
                            } else {
                              let newMinute = Math.round(angle / 6)
                              if (newMinute >= 60) newMinute = 0
                              if (newMinute < 0) newMinute = 0
                              updateTime(displayHours, newMinute)
                            }
                          }

                          useEffect(() => {
                            if (!isDragging) {
                              startHour24Ref.current = null
                              startAngleRef.current = null
                              lastAngleRef.current = null
                              unwrappedAngleRef.current = 0
                              return
                            }

                            const handleMouseMove = (e: MouseEvent) => {
                              const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                              
                              if (isDragging === 'hour') {
                                const startHour24 = startHour24Ref.current
                                const startAngle = startAngleRef.current
                                
                                if (startAngle !== null && startHour24 !== null) {
                                  if (lastAngleRef.current === null) {
                                    lastAngleRef.current = angle
                                    unwrappedAngleRef.current = startAngle
                                  } else {
                                    let delta = angle - lastAngleRef.current
                                    if (delta > 180) {
                                      delta -= 360
                                    } else if (delta < -180) {
                                      delta += 360
                                    }
                                    unwrappedAngleRef.current += delta
                                    lastAngleRef.current = angle
                                  }
                                  
                                  const totalRotation = unwrappedAngleRef.current - startAngle
                                  const hoursDelta = totalRotation / 15
                                  let newHour24 = startHour24 + hoursDelta
                                  newHour24 = ((newHour24 % 24) + 24) % 24
                                  const finalHour = Math.round(newHour24)
                                  
                                  if (finalHour >= 0 && finalHour <= 23) {
                                    updateTime(finalHour, displayMinutes)
                                  }
                                }
                              } else {
                                let newMinute = Math.round(angle / 6)
                                if (newMinute >= 60) newMinute = 0
                                if (newMinute < 0) newMinute = 0
                                updateTime(displayHours, newMinute)
                              }
                            }

                            const handleMouseUp = () => {
                              setIsDragging(null)
                              startHour24Ref.current = null
                              startAngleRef.current = null
                              lastAngleRef.current = null
                              unwrappedAngleRef.current = 0
                            }

                            window.addEventListener('mousemove', handleMouseMove)
                            window.addEventListener('mouseup', handleMouseUp)

                            return () => {
                              window.removeEventListener('mousemove', handleMouseMove)
                              window.removeEventListener('mouseup', handleMouseUp)
                            }
                          }, [isDragging, displayHours, displayMinutes, updateTime])

                          const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const centerX = rect.left + rect.width / 2
                            const centerY = rect.top + rect.height / 2
                            const clickX = e.clientX - centerX
                            const clickY = e.clientY - centerY
                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                            if (angle < 0) angle += 360

                            if (isSelectingHours) {
                              let newHour12 = Math.round(angle / 30)
                              if (newHour12 === 0 || newHour12 === 12) newHour12 = 12
                              const isPM = displayHours >= 12
                              const hour24 = newHour12 === 12 
                                ? (isPM ? 12 : 0)
                                : (isPM ? newHour12 + 12 : newHour12)
                              updateTime(hour24, displayMinutes)
                            } else {
                              let newMinute = Math.round(angle / 6)
                              if (newMinute >= 60) newMinute = 0
                              if (newMinute < 0) newMinute = 0
                              updateTime(displayHours, newMinute)
                            }
                          }
                          
                          return (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Clock className='h-4 w-4' />
                                Hora Saída
                              </FormLabel>
                              <FormControl>
                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <div className='relative cursor-pointer'>
                                      <Input
                                        type='time'
                                        placeholder='HH:mm'
                                        value={currentValue}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className='px-4 py-6 shadow-inner pl-12 cursor-pointer'
                                        readOnly
                                        onClick={() => setOpen(true)}
                                      />
                                      <Clock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-auto p-6' align='start'>
                                    <div className='space-y-4'>
                                      <div className='relative w-48 h-48 mx-auto'>
                                        <div
                                          ref={clockRef}
                                          className='relative w-full h-full rounded-full border-4 border-border bg-gradient-to-br from-background to-muted/20 shadow-lg cursor-pointer hover:border-primary/50 transition-colors'
                                          onClick={handleClockClick}
                                        >
                                          {Array.from({ length: 12 }).map((_, i) => {
                                            const hourNumber = i === 0 ? 12 : i
                                            const angle = (i * 30) - 90
                                            const rad = (angle * Math.PI) / 180
                                            const radius = 75
                                            const centerX = 92
                                            const centerY = 92
                                            const x = centerX + radius * Math.cos(rad)
                                            const y = centerY + radius * Math.sin(rad)
                                            
                                            return (
                                              <div
                                                key={i}
                                                className='absolute text-base font-bold text-foreground select-none'
                                                style={{
                                                  left: `${x}px`,
                                                  top: `${y}px`,
                                                  transform: 'translate(-50%, -50%)',
                                                }}
                                              >
                                                {hourNumber}
                                              </div>
                                            )
                                          })}

                                          {Array.from({ length: 60 }).map((_, i) => {
                                            if (i % 5 === 0) return null
                                            const angle = (i * 6) - 90
                                            const rad = (angle * Math.PI) / 180
                                            const radius = 90
                                            const centerX = 92
                                            const centerY = 92
                                            const x = centerX + radius * Math.cos(rad)
                                            const y = centerY + radius * Math.sin(rad)
                                            
                                            return (
                                              <div
                                                key={i}
                                                className='absolute w-1 h-1 rounded-full bg-muted-foreground/30'
                                                style={{
                                                  left: `${x}px`,
                                                  top: `${y}px`,
                                                  transform: 'translate(-50%, -50%)',
                                                }}
                                              />
                                            )
                                          })}

                                          <div
                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-20 cursor-grab active:cursor-grabbing'
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              width: isSelectingHours ? '4px' : '2px',
                                              height: '45px',
                                              transform: `translate(-50%, -100%) rotate(${hourAngle + 90}deg)`,
                                              transformOrigin: '50% 100%',
                                              opacity: isSelectingHours ? 1 : 0.5,
                                              borderRadius: '2px 2px 0 0',
                                            }}
                                            onMouseDown={(e) => handlePointerMouseDown(e, 'hour')}
                                          />

                                          <div
                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-30 cursor-grab active:cursor-grabbing'
                                            style={{
                                              left: '50%',
                                              top: '50%',
                                              width: !isSelectingHours ? '3px' : '2px',
                                              height: '64px',
                                              transform: `translate(-50%, -100%) rotate(${minuteAngle + 90}deg)`,
                                              transformOrigin: '50% 100%',
                                              opacity: !isSelectingHours ? 1 : 0.5,
                                              borderRadius: '2px 2px 0 0',
                                            }}
                                            onMouseDown={(e) => handlePointerMouseDown(e, 'minute')}
                                          />

                                          <div className='absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground border-4 border-background shadow-md z-10' />
                                        </div>
                                      </div>

                                      <div className='flex items-center justify-center gap-2 pt-2 border-t'>
                                        <Input
                                          type='number'
                                          min={0}
                                          max={23}
                                          value={displayHours}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0
                                            const clamped = Math.max(0, Math.min(23, val))
                                            updateTime(clamped, displayMinutes)
                                          }}
                                          className='w-16 text-center'
                                          placeholder='00'
                                        />
                                        <span className='text-lg font-medium'>:</span>
                                        <Input
                                          type='number'
                                          min={0}
                                          max={59}
                                          value={displayMinutes}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0
                                            const clamped = Math.max(0, Math.min(59, val))
                                            updateTime(displayHours, clamped)
                                          }}
                                          className='w-16 text-center'
                                          placeholder='00'
                                        />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <DollarSign className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base'>
                          Totais de Manutenção
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='totalSemIva'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <DollarSign className='h-4 w-4' />
                              Total S/ IVA
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className='px-4 py-6 shadow-inner'
                                step={0.01}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='valorIva'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <DollarSign className='h-4 w-4' />
                              Valor do IVA
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className='px-4 py-6 shadow-inner'
                                step={0.01}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='total'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <DollarSign className='h-4 w-4' />
                              Total
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className='px-4 py-6 shadow-inner'
                                step={0.01}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>

            {/* Serviços */}
            <PersistentTabsContent value='servicos'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                        <FileText className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='flex items-center gap-2 text-base'>
                          Serviços
                        </CardTitle>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          Registe serviços aplicados nesta manutenção.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                      <p className='text-sm text-muted-foreground'>
                        Adicione registos de serviços com todas as informações relevantes.
                      </p>
                      <Button
                        type='button'
                        variant='secondary'
                        size='default'
                        className='md:min-w-[220px]'
                        onClick={handleAddServico}
                      >
                        Adicionar
                      </Button>
                    </div>
                    {servicoFields.length === 0 ? (
                      <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                          <FileText className='h-6 w-6' />
                        </div>
                        <h4 className='mt-4 text-sm font-semibold text-foreground'>
                          Sem serviços registados
                        </h4>
                        <p className='mt-2 text-sm text-muted-foreground'>
                          Clique em "Adicionar" para registar um serviço aplicado nesta manutenção.
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                          <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                            <FileText className='h-4 w-4 text-primary' />
                            Serviços registados
                            <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                              {servicoFields.length}
                            </Badge>
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            Edite as informações conforme necessário e remova registos que já não sejam relevantes.
                          </p>
                        </div>

                        <div className='space-y-4'>
                          {servicoFields.map((servico, index) => {
                            // Usar getValues apenas quando necessário para evitar re-renders durante a digitação
                            const servicoData = form.getValues(`servicos.${index}`)
                            const dataProximaFormatada = formatDateLabel(servicoData?.dataProxima)
                            const hasId = !!servicoData?.id
                            const isSaved = hasId || savedServicos.has(servico.fieldId)
                            const isExpanded = expandedServicos.has(servico.fieldId)
                            
                            const servicoNome = servicoData?.servicoId
                              ? servicosData?.find((s) => s.id === servicoData.servicoId)?.designacao || 'Não definido'
                              : 'Não definido'

                            return (
                              <div
                                key={servico.fieldId}
                                className={cn(
                                  'group rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md md:p-5',
                                  isSaved && !isExpanded && 'space-y-3'
                                )}
                              >
                                <div className='flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between'>
                                  <div className='flex items-center gap-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                      <FileText className='h-5 w-5' />
                                    </div>
                                    <div>
                                      <div className='flex items-center gap-2'>
                                        <p className='text-sm font-semibold text-foreground'>
                                          Serviço #{index + 1}
                                        </p>
                                        {isSaved && (
                                          <Badge variant='outline' className='rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-[10px]'>
                                            Guardado
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    {isSaved ? (
                                      <>
                                        <Button
                                          type='button'
                                          variant='outline'
                                          size='sm'
                                          onClick={() => handleToggleExpandServico(index)}
                                          className='gap-2'
                                        >
                                          {isExpanded ? (
                                            <>
                                              <ChevronUp className='h-4 w-4' />
                                              Ocultar
                                            </>
                                          ) : (
                                            <>
                                              <Eye className='h-4 w-4' />
                                              Ver dados
                                            </>
                                          )}
                                        </Button>
                                        <Button
                                          type='button'
                                          variant='ghost'
                                          size='sm'
                                          onClick={() => handleRemoveServico(index)}
                                          className='text-destructive hover:text-destructive'
                                        >
                                          <Trash2 className='h-4 w-4' />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          type='button'
                                          variant='default'
                                          size='sm'
                                          onClick={() => handleSaveServico(index)}
                                          className='gap-2'
                                        >
                                          <Save className='h-4 w-4' />
                                          Guardar
                                        </Button>
                                        <Button
                                          type='button'
                                          variant='ghost'
                                          size='sm'
                                          onClick={() => handleRemoveServico(index)}
                                          className='text-destructive hover:text-destructive'
                                        >
                                          <Trash2 className='h-4 w-4' />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {isSaved && !isExpanded ? (
                                  <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                    <CardContent className='p-4'>
                                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                        <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                          <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                            <Settings className='h-4 w-4 text-primary' />
                                          </div>
                                          <div className='flex-1 space-y-1'>
                                            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                              Serviço
                                            </p>
                                            <p className='text-sm font-medium text-foreground'>{servicoNome || 'Não definido'}</p>
                                          </div>
                                        </div>
                                        <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                          <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                            <DollarSign className='h-4 w-4 text-primary' />
                                          </div>
                                          <div className='flex-1 space-y-1'>
                                            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                              Quantidade
                                            </p>
                                            <p className='text-sm font-medium text-foreground'>
                                              {servicoData?.quantidade !== undefined ? servicoData.quantidade : 'Não definida'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                          <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                            <PiggyBank className='h-4 w-4 text-primary' />
                                          </div>
                                          <div className='flex-1 space-y-1'>
                                            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                              Valor Total
                                            </p>
                                            <p className='text-sm font-medium text-foreground'>
                                              {servicoData?.valorTotal !== undefined ? `${servicoData.valorTotal.toFixed(2)} €` : 'Não definido'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                    <CardHeader className='pb-3'>
                                      <div className='flex items-center gap-2'>
                                        <div className='rounded-full bg-primary/10 p-2'>
                                          <FileText className='h-4 w-4 text-primary' />
                                        </div>
                                        <div>
                                          <CardTitle className='text-base font-semibold'>Informações do Serviço</CardTitle>
                                          <CardDescription className='text-xs'>Dados do serviço aplicado</CardDescription>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                      <div className='grid gap-4 md:grid-cols-12'>
                                        <div className='md:col-span-3'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.servicoId`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Serviço</FormLabel>
                                              <FormControl>
                                                <div className='relative'>
                                                  <Autocomplete
                                                    options={
                                                      servicosData?.map((servico) => ({
                                                        value: servico.id || '',
                                                        label: servico.designacao || '',
                                                      })) || []
                                                    }
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                      field.onChange(value)
                                                      // Preencher automaticamente os campos quando um serviço é selecionado
                                                      if (value && servicosData) {
                                                        const servicoSelecionado = servicosData.find((s) => s.id === value)
                                                        if (servicoSelecionado) {
                                                          const quantidade = form.getValues(`servicos.${index}.quantidade`) || 0
                                                          const custo = servicoSelecionado.custo || 0
                                                          const ivaPercentagem = servicoSelecionado.taxaIva?.valor || 0
                                                          const valorSemIva = custo * quantidade
                                                          const valorIva = (valorSemIva * ivaPercentagem) / 100
                                                          const valorTotal = valorSemIva + valorIva
                                                          
                                                          form.setValue(`servicos.${index}.valorSemIva`, valorSemIva)
                                                          form.setValue(`servicos.${index}.ivaPercentagem`, ivaPercentagem)
                                                          form.setValue(`servicos.${index}.valorTotal`, valorTotal)
                                                        }
                                                      } else {
                                                        // Limpar os valores quando o serviço for removido
                                                        form.setValue(`servicos.${index}.valorSemIva`, undefined)
                                                        form.setValue(`servicos.${index}.ivaPercentagem`, undefined)
                                                        form.setValue(`servicos.${index}.valorTotal`, undefined)
                                                      }
                                                    }}
                                                    placeholder={
                                                      isLoadingServicos
                                                        ? 'A carregar...'
                                                        : 'Selecione o serviço'
                                                    }
                                                    disabled={isLoadingServicos}
                                                    className={SELECT_WITH_ACTIONS_CLASS}
                                                  />
                                                </div>
                                              </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <div className='md:col-span-3'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.quantidade`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Quantidade</FormLabel>
                                              <FormControl>
                                                <NumberInput
                                                  value={field.value}
                                                  onValueChange={(value) => {
                                                    field.onChange(value)
                                                    // Recalcular os valores quando a quantidade mudar
                                                    const servicoId = form.getValues(`servicos.${index}.servicoId`)
                                                    if (servicoId && servicosData) {
                                                      const servicoSelecionado = servicosData.find((s) => s.id === servicoId)
                                                      if (servicoSelecionado) {
                                                        const quantidade = value || 0
                                                        const custo = servicoSelecionado.custo || 0
                                                        const ivaPercentagem = servicoSelecionado.taxaIva?.valor || 0
                                                        const valorSemIva = custo * quantidade
                                                        const valorIva = (valorSemIva * ivaPercentagem) / 100
                                                        const valorTotal = valorSemIva + valorIva
                                                        
                                                        form.setValue(`servicos.${index}.valorSemIva`, valorSemIva)
                                                        form.setValue(`servicos.${index}.ivaPercentagem`, ivaPercentagem)
                                                        form.setValue(`servicos.${index}.valorTotal`, valorTotal)
                                                      }
                                                    }
                                                  }}
                                                  placeholder='0'
                                                  min={0}
                                                  step={1}
                                                  className={TEXT_INPUT_CLASS}
                                                />
                                              </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <div className='md:col-span-3'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.kmProxima`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>KM Próxima</FormLabel>
                                              <FormControl>
                                                <NumberInput
                                                  value={field.value ?? undefined}
                                                  onValueChange={(value) => field.onChange(value ?? null)}
                                                  placeholder='0'
                                                  min={0}
                                                  step={1}
                                                  className={TEXT_INPUT_CLASS}
                                                />
                                              </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <div className='md:col-span-3'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.dataProxima`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Data Próxima</FormLabel>
                                              <FormControl>
                                                <DatePicker
                                                  value={field.value || undefined}
                                                  onChange={field.onChange}
                                                  placeholder='Selecione a data'
                                                  allowClear
                                                  className={FIELD_HEIGHT_CLASS}
                                                />
                                              </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <div className='md:col-span-4'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.valorSemIva`}
                                            render={({ field }) => {
                                            const servicoId = form.watch(`servicos.${index}.servicoId`)
                                            const isDisabled = !!servicoId && servicoId.trim() !== ''
                                            return (
                                              <FormItem>
                                                <FormLabel>Valor S/ IVA (€)</FormLabel>
                                                <FormControl>
                                                  <NumberInput
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    placeholder='0,00'
                                                    min={0}
                                                    step={0.01}
                                                    className={TEXT_INPUT_CLASS}
                                                    disabled={isDisabled}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )
                                          }}
                                          />
                                        </div>

                                        <div className='md:col-span-4'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.ivaPercentagem`}
                                            render={({ field }) => {
                                            const servicoId = form.watch(`servicos.${index}.servicoId`)
                                            const isDisabled = !!servicoId && servicoId.trim() !== ''
                                            return (
                                              <FormItem>
                                                <FormLabel>IVA %</FormLabel>
                                                <FormControl>
                                                  <NumberInput
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    placeholder='0,00'
                                                    min={0}
                                                    step={0.01}
                                                    className={TEXT_INPUT_CLASS}
                                                    disabled={isDisabled}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )
                                          }}
                                          />
                                        </div>

                                        <div className='md:col-span-4'>
                                          <FormField
                                            control={form.control}
                                            name={`servicos.${index}.valorTotal`}
                                            render={({ field }) => {
                                            const servicoId = form.watch(`servicos.${index}.servicoId`)
                                            const isDisabled = !!servicoId && servicoId.trim() !== ''
                                            return (
                                              <FormItem>
                                                <FormLabel>Valor Total (€)</FormLabel>
                                                <FormControl>
                                                  <NumberInput
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    placeholder='0,00'
                                                    min={0}
                                                    step={0.01}
                                                    className={TEXT_INPUT_CLASS}
                                                    disabled={isDisabled}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )
                                          }}
                                          />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>
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
              disabled={updateManutencaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateManutencaoMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { ManutencaoUpdateForm }

