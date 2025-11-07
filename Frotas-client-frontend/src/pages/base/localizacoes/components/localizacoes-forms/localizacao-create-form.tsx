import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useCreateLocalizacao } from '@/pages/base/localizacoes/queries/localizacoes-mutations'
import {
  MapPin,
  Building2,
  Mail,
  Plus,
  Eye,
  Phone,
  Home,
  Printer,
} from 'lucide-react'
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
  openFreguesiaCreationWindow,
  openCodigoPostalCreationWindow,
  openFreguesiaViewWindow,
  openCodigoPostalViewWindow,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
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

const localizacaoFormSchema = z.object({
  designacao: z
    .string()
    .min(1, { message: 'A designação é obrigatória' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  freguesiaId: z.string().min(1, { message: 'A freguesia é obrigatória' }),
  codigoPostalId: z
    .string()
    .min(1, { message: 'O código postal é obrigatório' }),
  telefone: z.string().min(1, { message: 'O telefone é obrigatório' }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .min(1, { message: 'O email é obrigatório' }),
  fax: z.string().min(1, { message: 'O fax é obrigatório' }),
})

type LocalizacaoFormValues = z.infer<typeof localizacaoFormSchema>

interface LocalizacaoCreateFormProps {
  modalClose: () => void
  preSelectedFreguesiaId?: string
  preSelectedCodigoPostalId?: string
  initialDesignacao?: string
  initialMorada?: string
  onSuccess?: (newLocalizacao: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

const LocalizacaoCreateForm = ({
  modalClose,
  preSelectedFreguesiaId,
  preSelectedCodigoPostalId,
  initialDesignacao,
  initialMorada,
  onSuccess,
  shouldCloseWindow = true,
}: LocalizacaoCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `localizacao-${instanceId}`

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

  const {
    data: freguesiasData,
    isLoading: isLoadingFreguesias,
    refetch: refetchFreguesias,
  } = useGetFreguesiasSelect()
  const {
    data: codigosPostaisData,
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()
  const createLocalizacaoMutation = useCreateLocalizacao()

  const defaultValues = useMemo(
    () => ({
      designacao: '',
      morada: '',
      freguesiaId: '',
      codigoPostalId: '',
      telefone: '',
      email: '',
      fax: '',
    }),
    []
  )

  const localizacaoResolver: Resolver<LocalizacaoFormValues> = async (
    values
  ) => {
    const result = localizacaoFormSchema.safeParse(values)
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

  const form = useForm<LocalizacaoFormValues>({
    resolver: localizacaoResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `localizacao-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<LocalizacaoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      designacao: 'dados',
      morada: 'dados',
      freguesiaId: 'dados',
      codigoPostalId: 'dados',
      telefone: 'dados',
      email: 'dados',
      fax: 'dados',
    },
  })

  const [selectedFreguesiaId, setSelectedFreguesiaId] = useState<string>('')
  const [selectedCodigoPostalId, setSelectedCodigoPostalId] = useState<string>('')

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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, effectiveWindowId, setFormState])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as LocalizacaoFormValues)
    } else if (
      preSelectedFreguesiaId ||
      preSelectedCodigoPostalId ||
      initialDesignacao ||
      initialMorada
    ) {
      form.reset({
        designacao: initialDesignacao || '',
        morada: initialMorada || '',
        freguesiaId: preSelectedFreguesiaId || '',
        codigoPostalId: preSelectedCodigoPostalId || '',
        telefone: '',
        email: '',
        fax: '',
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedFreguesiaId,
    preSelectedCodigoPostalId,
    initialDesignacao,
    initialMorada,
    form,
  ])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as LocalizacaoFormValues,
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
  }, [
    form,
    effectiveWindowId,
    formId,
    defaultValues,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: freguesiasData || [],
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
    data: codigosPostaisData || [],
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

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const handleCreateFreguesia = () => {
    openFreguesiaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewFreguesia = () => {
    const freguesiaId = form.getValues('freguesiaId')
    if (!freguesiaId) {
      toast.error('Por favor, selecione uma freguesia primeiro')
      return
    }

    openFreguesiaViewWindow(
      navigate,
      effectiveWindowId,
      freguesiaId,
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
    const codigoPostalId = form.getValues('codigoPostalId')
    if (!codigoPostalId) {
      toast.error('Por favor, selecione um código postal primeiro')
      return
    }

    openCodigoPostalViewWindow(
      navigate,
      effectiveWindowId,
      codigoPostalId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: LocalizacaoFormValues) => {
    try {
      const finalValues = {
        ...values,
        freguesiaId: selectedFreguesiaId || values.freguesiaId,
        codigoPostalId: selectedCodigoPostalId || values.codigoPostalId,
      }

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createLocalizacaoMutation.mutateAsync(finalValues)

      const result = handleApiResponse(
        response,
        'Localização criada com sucesso',
        'Erro ao criar localização',
        'Localização criada com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.designacao },
            'localizacao',
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
      toast.error(handleApiError(error, 'Erro ao criar localização'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedFreguesias =
    freguesiasData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []
  const sortedCodigosPostais =
    codigosPostaisData
      ?.slice()
      .sort((a, b) => a.codigo.localeCompare(b.codigo)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='localizacaoCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`localizacao-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Localização</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Localização
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina os dados básicos da localização e sua ligação
                        geográfica
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='designacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
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
                      name='morada'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Home className='h-4 w-4' />
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
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='Introduza o email'
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
                      name='fax'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Printer className='h-4 w-4' />
                            Fax
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o fax'
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
              disabled={createLocalizacaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createLocalizacaoMutation.isPending
                ? 'A criar...'
                : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { LocalizacaoCreateForm }

