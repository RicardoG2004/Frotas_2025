import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import {
  User,
  Home,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Eye,
  Plus,
} from 'lucide-react'
import { useCreateFuncionario } from '../../queries/funcionarios-mutations'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetCargosSelect } from '@/pages/base/cargos/queries/cargos-queries'
import { useGetDelegacoesSelect } from '@/pages/base/delegacoes/queries/delegacoes-queries'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
  openFreguesiaCreationWindow,
  openFreguesiaViewWindow,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
  openCargoCreationWindow,
  openCargoViewWindow,
  openDelegacaoCreationWindow,
  openDelegacaoViewWindow,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { handleApiResponse } from '@/utils/response-handlers'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
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
import { Autocomplete } from '@/components/ui/autocomplete'
import { Switch } from '@/components/ui/switch'

const funcionarioFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  freguesiaId: z.string().min(1, { message: 'A freguesia é obrigatória' }),
  codigoPostalId: z
    .string()
    .min(1, { message: 'O código postal é obrigatório' }),
  cargoId: z.string().min(1, { message: 'O cargo é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  telefone: z.string().min(1, { message: 'O telefone é obrigatório' }),
  delegacaoId: z.string().min(1, { message: 'A delegação é obrigatória' }),
  ativo: z.boolean().default(true),
})

type FuncionarioFormValues = z.infer<typeof funcionarioFormSchema>

interface FuncionarioCreateFormProps {
  modalClose: () => void
  onSuccess?: (newFuncionario: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const FuncionarioCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: FuncionarioCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `funcionario-${instanceId}`

  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const {
    removeWindow,
    updateWindowState,
    findWindowByPathAndInstanceId,
    setWindowReturnData,
  } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createFuncionarioMutation = useCreateFuncionario()

  const {
    data: freguesiasData = [],
    isLoading: isLoadingFreguesias,
    refetch: refetchFreguesias,
  } = useGetFreguesiasSelect()
  const {
    data: codigosPostaisData = [],
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()
  const {
    data: cargosData = [],
    isLoading: isLoadingCargos,
    refetch: refetchCargos,
  } = useGetCargosSelect()
  const {
    data: delegacoesData = [],
    isLoading: isLoadingDelegacoes,
    refetch: refetchDelegacoes,
  } = useGetDelegacoesSelect()

  const defaultValues = useMemo(
    () => ({
      nome: '',
      morada: '',
      freguesiaId: '',
      codigoPostalId: '',
      cargoId: '',
      email: '',
      telefone: '',
      delegacaoId: '',
      ativo: true,
    }),
    []
  )

  const funcionarioResolver: Resolver<FuncionarioFormValues> = async (values) => {
    const result = funcionarioFormSchema.safeParse(values)
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

  const form = useForm<FuncionarioFormValues>({
    resolver: funcionarioResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `funcionario-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<FuncionarioFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      email: 'identificacao',
      telefone: 'identificacao',
      cargoId: 'identificacao',
      ativo: 'identificacao',
      morada: 'localizacao',
      freguesiaId: 'localizacao',
      codigoPostalId: 'localizacao',
      delegacaoId: 'localizacao',
    },
  })

  const [selectedFreguesiaId, setSelectedFreguesiaId] = useState<string>('')
  const [selectedCodigoPostalId, setSelectedCodigoPostalId] = useState<string>('')
  const [selectedCargoId, setSelectedCargoId] = useState<string>('')
  const [selectedDelegacaoId, setSelectedDelegacaoId] = useState<string>('')

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
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    effectiveWindowId,
    setFormState,
  ])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as FuncionarioFormValues)
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as FuncionarioFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
        windowId: effectiveWindowId,
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
          value.nome || 'Novo Funcionário',
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    formId,
    defaultValues,
    setFormState,
    effectiveWindowId,
    setWindowHasFormData,
    updateWindowState,
  ])

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: freguesiasData,
    setValue: (value: string) => {
      setSelectedFreguesiaId(value)
      form.setValue('freguesiaId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchFreguesias,
    itemName: 'Freguesia',
    successMessage: 'Freguesia selecionada automaticamente',
    manualSelectionMessage:
      'Freguesia criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['freguesias-select'],
    returnDataKey: `return-data-${effectiveWindowId}-freguesia`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: codigosPostaisData,
    setValue: (value: string) => {
      setSelectedCodigoPostalId(value)
      form.setValue('codigoPostalId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchCodigosPostais,
    itemName: 'Código Postal',
    successMessage: 'Código postal selecionado automaticamente',
    manualSelectionMessage:
      'Código postal criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['codigospostais-select'],
    returnDataKey: `return-data-${effectiveWindowId}-codigopostal`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: cargosData,
    setValue: (value: string) => {
      setSelectedCargoId(value)
      form.setValue('cargoId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchCargos,
    itemName: 'Cargo',
    successMessage: 'Cargo selecionado automaticamente',
    manualSelectionMessage:
      'Cargo criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['cargos-select'],
    returnDataKey: `return-data-${effectiveWindowId}-cargo`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: delegacoesData,
    setValue: (value: string) => {
      setSelectedDelegacaoId(value)
      form.setValue('delegacaoId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchDelegacoes,
    itemName: 'Delegação',
    successMessage: 'Delegação selecionada automaticamente',
    manualSelectionMessage:
      'Delegação criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['delegacoes-select'],
    returnDataKey: `return-data-${effectiveWindowId}-delegacao`,
  })

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)
    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: FuncionarioFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = (await createFuncionarioMutation.mutateAsync({
        Nome: values.nome,
        Morada: values.morada,
        FreguesiaId: values.freguesiaId,
        CodigoPostalId: values.codigoPostalId,
        CargoId: values.cargoId,
        Email: values.email,
        Telefone: values.telefone,
        DelegacaoId: values.delegacaoId,
        Ativo: values.ativo,
      })) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Funcionário criado com sucesso',
        'Erro ao criar funcionário',
        'Funcionário criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.nome },
            'funcionario',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          onSuccess({
            id: response.info.data,
            nome: values.nome,
          })
        }

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar funcionário'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedFreguesias = [...freguesiasData].sort((a, b) =>
    (a.nome || '').localeCompare(b.nome || '')
  )
  const sortedCodigosPostais = [...codigosPostaisData].sort((a, b) =>
    (a.codigo || '').localeCompare(b.codigo || '')
  )
  const sortedCargos = [...cargosData].sort((a, b) =>
    (a.designacao || '').localeCompare(b.designacao || '')
  )
  const sortedDelegacoes = [...delegacoesData].sort((a, b) =>
    (a.designacao || '').localeCompare(b.designacao || '')
  )

  const handleCreateFreguesia = () => {
    openFreguesiaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewFreguesia = () => {
    const id = form.getValues('freguesiaId')
    if (!id) {
      toast.error('Selecione uma freguesia primeiro')
      return
    }
    openFreguesiaViewWindow(
      navigate,
      effectiveWindowId,
      id,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateCodigoPostal = () => {
    openCodigoPostalCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewCodigoPostal = () => {
    const id = form.getValues('codigoPostalId')
    if (!id) {
      toast.error('Selecione um código postal primeiro')
      return
    }
    openCodigoPostalViewWindow(
      navigate,
      effectiveWindowId,
      id,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateCargo = () => {
    openCargoCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewCargo = () => {
    const id = form.getValues('cargoId')
    if (!id) {
      toast.error('Selecione um cargo primeiro')
      return
    }
    openCargoViewWindow(
      navigate,
      effectiveWindowId,
      id,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateDelegacao = () => {
    openDelegacaoCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewDelegacao = () => {
    const id = form.getValues('delegacaoId')
    if (!id) {
      toast.error('Selecione uma delegação primeiro')
      return
    }
    openDelegacaoViewWindow(
      navigate,
      effectiveWindowId,
      id,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='funcionarioCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`funcionario-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='localizacao'>Localização</TabsTrigger>
            </TabsList>

            <TabsContent value='identificacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <User className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Dados do Funcionário
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina a identidade e contactos do funcionário
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
                            <User className='h-4 w-4' />
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
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='nome@empresa.com'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                      name='telefone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            Telefone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o telefone'
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
                      name='cargoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Briefcase className='h-4 w-4' />
                            Cargo
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedCargos.map((cargo) => ({
                                  value: cargo.id || '',
                                  label: cargo.designacao,
                                }))}
                                value={selectedCargoId || field.value}
                                onValueChange={(value) => {
                                  setSelectedCargoId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoadingCargos
                                    ? 'A carregar...'
                                    : 'Selecione um cargo'
                                }
                                emptyText='Nenhum cargo encontrado.'
                                disabled={isLoadingCargos}
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewCargo}
                                  className='h-8 w-8 p-0'
                                  title='Ver Cargo'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateCargo}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo Cargo'
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
                  </div>

                  <FormField
                    control={form.control}
                    name='ativo'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-inner'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base flex items-center gap-2'>
                            Ativo
                          </FormLabel>
                          <p className='text-sm text-muted-foreground'>
                            Defina se o funcionário está ativo no sistema
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='localizacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Home className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Localização e Estrutura
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Associe freguesia, código postal e delegação
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='morada'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          Morada
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Introduza a morada'
                            {...field}
                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='freguesiaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            Freguesia
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedFreguesias.map((freguesia) => ({
                                  value: freguesia.id || '',
                                  label: freguesia.nome,
                                }))}
                                value={selectedFreguesiaId || field.value}
                                onValueChange={(value) => {
                                  setSelectedFreguesiaId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoadingFreguesias
                                    ? 'A carregar...'
                                    : 'Selecione uma freguesia'
                                }
                                emptyText='Nenhuma freguesia encontrada.'
                                disabled={isLoadingFreguesias}
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewFreguesia}
                                  className='h-8 w-8 p-0'
                                  title='Ver Freguesia'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateFreguesia}
                                  className='h-8 w-8 p-0'
                                  title='Criar Nova Freguesia'
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
                      name='codigoPostalId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Código Postal
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedCodigosPostais.map(
                                  (codigoPostal) => ({
                                    value: codigoPostal.id || '',
                                    label: codigoPostal.codigo,
                                  })
                                )}
                                value={selectedCodigoPostalId || field.value}
                                onValueChange={(value) => {
                                  setSelectedCodigoPostalId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoadingCodigosPostais
                                    ? 'A carregar...'
                                    : 'Selecione um código postal'
                                }
                                emptyText='Nenhum código postal encontrado.'
                                disabled={isLoadingCodigosPostais}
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewCodigoPostal}
                                  className='h-8 w-8 p-0'
                                  title='Ver Código Postal'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateCodigoPostal}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo Código Postal'
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
                  </div>

                  <FormField
                    control={form.control}
                    name='delegacaoId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Building2 className='h-4 w-4' />
                          Delegação
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Autocomplete
                              options={sortedDelegacoes.map((delegacao) => ({
                                value: delegacao.id || '',
                                label: delegacao.designacao,
                              }))}
                              value={selectedDelegacaoId || field.value}
                              onValueChange={(value) => {
                                setSelectedDelegacaoId(value)
                                field.onChange(value)
                              }}
                              placeholder={
                                isLoadingDelegacoes
                                  ? 'A carregar...'
                                  : 'Selecione uma delegação'
                              }
                              emptyText='Nenhuma delegação encontrada.'
                              disabled={isLoadingDelegacoes}
                              className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                            />
                            <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handleViewDelegacao}
                                className='h-8 w-8 p-0'
                                title='Ver Delegação'
                                disabled={!field.value}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handleCreateDelegacao}
                                className='h-8 w-8 p-0'
                                title='Criar Nova Delegação'
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
                </CardContent>
              </Card>
            </TabsContent>
          </PersistentTabs>
        </form>
      </Form>

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          type='submit'
          form='funcionarioCreateForm'
          disabled={createFuncionarioMutation.isPending}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}

export default FuncionarioCreateForm

