import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, IdCard, Map, MapPin, Eye, Plus } from 'lucide-react'
import { useCreateTerceiro } from '@/pages/base/terceiros/queries/terceiros-mutations'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { useCurrentWindowId } from '@/utils/window-utils'
import {
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
  setEntityReturnDataWithToastSuppression,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
} from '@/utils/window-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
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
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/persistent-tabs'
import { Autocomplete } from '@/components/ui/autocomplete'

const terceiroFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  nif: z.string().min(1, { message: 'O NIF é obrigatório' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  codigoPostalId: z
    .string()
    .min(1, { message: 'O código postal é obrigatório' }),
})

type TerceiroFormValues = z.infer<typeof terceiroFormSchema>

interface TerceiroCreateFormProps {
  modalClose: () => void
  onSuccess?: (newTerceiro: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const TerceiroCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: TerceiroCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `terceiro-${instanceId}`

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
    setWindowReturnData,
    findWindowByPathAndInstanceId,
  } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createTerceiroMutation = useCreateTerceiro()

  const {
    data: codigosPostais = [],
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()

  const [selectedCodigoPostalId, setSelectedCodigoPostalId] = useState('')

  const defaultValues = useMemo(
    () => ({
      nome: '',
      nif: '',
      morada: '',
      codigoPostalId: '',
    }),
    []
  )

  const terceiroResolver: Resolver<TerceiroFormValues> = async (values) => {
    const result = terceiroFormSchema.safeParse(values)
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

  const form = useForm<TerceiroFormValues>({
    resolver: terceiroResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `terceiro-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<TerceiroFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      nif: 'identificacao',
      morada: 'identificacao',
      codigoPostalId: 'identificacao',
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
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    setFormState,
    effectiveWindowId,
  ])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      const storedData = formData as TerceiroFormValues
      form.reset(storedData)
      setSelectedCodigoPostalId(storedData.codigoPostalId || '')
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as TerceiroFormValues,
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
          value.nome,
          updateWindowState
        )
      }

      if (value.codigoPostalId !== selectedCodigoPostalId) {
        setSelectedCodigoPostalId(value.codigoPostalId || '')
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
    selectedCodigoPostalId,
  ])

  useAutoSelectionWithReturnData({
    windowId: String(effectiveWindowId),
    instanceId,
    data: codigosPostais || [],
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
    cleanupWindowForms(String(effectiveWindowId))

    if (shouldCloseWindow) {
      handleWindowClose(String(effectiveWindowId), navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const handleCreateCodigoPostal = () => {
    if (!effectiveWindowId) {
      toast.error('Não foi possível determinar a janela atual')
      return
    }

    openCodigoPostalCreationWindow(
      navigate,
      String(effectiveWindowId),
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
      String(effectiveWindowId),
      codigoPostalId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: TerceiroFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createTerceiroMutation.mutateAsync({
        Nome: values.nome,
        NIF: values.nif,
        Morada: values.morada,
        CodigoPostalId: values.codigoPostalId,
      })

      const result = handleApiResponse(
        response,
        'Outros Devedores/Credores criado com sucesso',
        'Erro ao criar Outros Devedores/Credores',
        'Outros Devedores/Credores criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            String(effectiveWindowId),
            { id: response.info.data, nome: values.nome },
            'terceiro',
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

        cleanupWindowForms(String(effectiveWindowId))

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(String(effectiveWindowId))
        }

        modalClose()
      }
    } catch (error) {
      toast.error(
        handleApiError(error, 'Erro ao criar Outros Devedores/Credores')
      )
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const codigoPostalOptions = codigosPostais.map((codigoPostal) => ({
    value: codigoPostal.id || '',
    label: `${codigoPostal.codigo} - ${codigoPostal.localidade}`,
  }))

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='terceiroCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`terceiro-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
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
                        Dados de Outros Devedores/Credores
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Introduza as informações principais do terceiro
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
                      name='nif'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <IdCard className='h-4 w-4' />
                            NIF
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o NIF'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
                  <FormField
                    control={form.control}
                    name='morada'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Map className='h-4 w-4' />
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
                    <div className='space-y-2'>
                      <FormField
                        control={form.control}
                        name='codigoPostalId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Código Postal
                            </FormLabel>
                            <FormControl>
                              <div className='relative w-full'>
                                <Autocomplete
                                  options={codigoPostalOptions}
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    setSelectedCodigoPostalId(value)
                                  }}
                                  placeholder={
                                    isLoadingCodigosPostais
                                      ? 'A carregar...'
                                      : 'Selecione um código postal'
                                  }
                                  emptyText='Nenhum código postal encontrado.'
                                  disabled={isLoadingCodigosPostais}
                                  className='w-full px-4 py-6 pr-24 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-2'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewCodigoPostal}
                                    className='h-8 w-8 p-0'
                                    title='Ver Código Postal'
                                    disabled={!form.getValues('codigoPostalId')}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateCodigoPostal}
                                    className='h-8 w-8 p-0'
                                    title='Criar Código Postal'
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
              disabled={createTerceiroMutation.isPending}
              className='w-full md:w-auto'
            >
              {createTerceiroMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default TerceiroCreateForm


