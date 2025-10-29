import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateTalhao } from '@/pages/cemiterios/talhoes/queries/talhoes-mutations'
import { ZonaCreateForm } from '@/pages/cemiterios/zonas/components/zonas-forms/zonas-create-form'
import { useGetZonasSelect } from '@/pages/cemiterios/zonas/queries/zonas-queries'
import { Tag, MapPin } from 'lucide-react'
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
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
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

const talhaoFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  zonaId: z
    .string({ message: 'A Zona é obrigatória' })
    .min(1, { message: 'A Zona é obrigatória' }),
})

type TalhaoFormSchemaType = z.infer<typeof talhaoFormSchema>

interface TalhaoCreateFormProps {
  modalClose: () => void
  preSelectedZonaId?: string
  onSuccess?: (newTalhao: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const TalhaoCreateForm = ({
  modalClose,
  preSelectedZonaId,
  onSuccess,
  shouldCloseWindow = true,
}: TalhaoCreateFormProps) => {
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
  const { removeWindow } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)
  const setWindowReturnData = useWindowsStore(
    (state) => state.setWindowReturnData
  )

  const { data: zonaData, isLoading: isLoadingZona } = useGetZonasSelect()

  const createTalhaoMutation = useCreateTalhao()
  const [createZonaData, setCreateZonaData] = useState<{
    nome: string
    isOpen: boolean
  }>({
    nome: '',
    isOpen: false,
  })

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      nome: '',
      zonaId: '',
    }),
    []
  )

  const talhaoResolver: Resolver<TalhaoFormSchemaType> = async (values) => {
    const result = talhaoFormSchema.safeParse(values)
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

  const form = useForm<TalhaoFormSchemaType>({
    resolver: talhaoResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `talhao-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<TalhaoFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      zonaId: 'dados',
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
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as TalhaoFormSchemaType)
    } else if (preSelectedZonaId) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: '',
        zonaId: preSelectedZonaId,
      })
    }
  }, [formData, isInitialized, formId, hasFormData, preSelectedZonaId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as TalhaoFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      // Update window hasFormData flag using the utility function
      if (windowId) {
        updateCreateFormData(
          windowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        // Update window title based on nome field
        updateCreateWindowTitle(windowId, value.nome, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, formId, defaultValues])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: TalhaoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createTalhaoMutation.mutateAsync({
        nome: values.nome,
        zonaId: values.zonaId,
      })

      const result = handleApiResponse(
        response,
        'Talhão criado com sucesso',
        'Erro ao criar talhão',
        'Talhão criado com avisos'
      )

      if (result.success) {
        const newTalhaoId = response.info.data

        // Get parent window ID from sessionStorage as fallback
        const parentWindowIdFromStorage = sessionStorage.getItem(
          `parent-window-${instanceId}`
        )
        const effectiveWindowId = windowId || instanceId

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: newTalhaoId, nome: values.nome },
            'talhao',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )

          // Clean up sessionStorage after a delay to ensure parent window has time to read it
          setTimeout(() => {
            if (parentWindowIdFromStorage) {
              sessionStorage.removeItem(`parent-window-${instanceId}`)
            }
          }, 2000) // 2 second delay
        }

        if (onSuccess) {
          onSuccess({
            id: newTalhaoId,
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
      toast.error(handleApiError(error, 'Erro ao criar talhão'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedZonas =
    zonaData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='talhaoCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`talhao-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Talhão</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Tag className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação do Talhão
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Informações básicas para identificação do talhão
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
                      name='zonaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Zona
                          </FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={sortedZonas.map((zona) => ({
                                value: zona.id || '',
                                label: zona.nome,
                              }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={
                                isLoadingZona
                                  ? 'A carregar...'
                                  : 'Selecione uma zona'
                              }
                              emptyText='Nenhuma zona encontrada.'
                              disabled={isLoadingZona}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                              createOption={(inputValue) => ({
                                value: 'new',
                                label: `Criar nova zona: "${inputValue}"`,
                                inputValue,
                              })}
                              onCreateOption={(inputValue) => {
                                setCreateZonaData({
                                  nome: inputValue,
                                  isOpen: true,
                                })
                              }}
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
              disabled={createTalhaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createTalhaoMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>

      <EnhancedModal
        title='Criar Nova Zona'
        description='Crie uma nova zona'
        isOpen={createZonaData.isOpen}
        onClose={() =>
          setCreateZonaData((prev) => ({ ...prev, isOpen: false }))
        }
        size='md'
      >
        <ZonaCreateForm
          modalClose={() =>
            setCreateZonaData((prev) => ({ ...prev, isOpen: false }))
          }
          onSuccess={(newZona) => {
            form.setValue('zonaId', newZona.id)
            setCreateZonaData((prev) => ({ ...prev, isOpen: false }))
          }}
          initialNome={createZonaData.nome}
          shouldCloseWindow={false}
        />
      </EnhancedModal>
    </div>
  )
}

export { TalhaoCreateForm }
