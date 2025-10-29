import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { CemiterioCreateForm } from '@/pages/cemiterios/cemiterios/components/cemiterios-forms/cemiterio-create-form'
import { useUpdateZona } from '@/pages/cemiterios/zonas/queries/zonas-mutations'
import { useGetZona } from '@/pages/cemiterios/zonas/queries/zonas-queries'
import { Tag, Building2 } from 'lucide-react'
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
import { useCemiterioSelection } from '@/hooks/use-cemiterio-selection'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
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

const zonaFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  cemiterioId: z
    .string({ message: 'O Cemitério é obrigatório' })
    .min(1, { message: 'O Cemitério é obrigatório' }),
})

type ZonaFormSchemaType = z.infer<typeof zonaFormSchema>

interface ZonaUpdateFormProps {
  modalClose: () => void
  zonaId: string
  initialData: {
    nome: string
    cemiterioId: string
  }
}

const ZonaUpdateForm = ({
  modalClose,
  zonaId,
  initialData,
}: ZonaUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId
  const { selectedCemiterio } = useCemiterioSelection()

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

  const updateZonaMutation = useUpdateZona()
  const { data: zonaData } = useGetZona(zonaId)

  const zonaResolver: Resolver<ZonaFormSchemaType> = async (values) => {
    const result = zonaFormSchema.safeParse(values)
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

  const form = useForm<ZonaFormSchemaType>({
    resolver: zonaResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `zona-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ZonaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      cemiterioId: 'dados',
    },
  })

  const [createCemiterioData, setCreateCemiterioData] = useState<{
    nome: string
    isOpen: boolean
  }>({
    nome: '',
    isOpen: false,
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as ZonaFormSchemaType)
    } else if (zonaData) {
      // If no saved data, use the data from the API
      form.reset({
        nome: zonaData.info.data.nome,
        cemiterioId: zonaData.info.data.cemiterioId,
      })
    }
  }, [formData, isInitialized, formId, hasFormData, zonaData])

  // Update cemiterioId when selectedCemiterio changes
  useEffect(() => {
    if (selectedCemiterio?.id) {
      form.setValue('cemiterioId', selectedCemiterio.id, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }, [selectedCemiterio?.id])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.cemiterioId) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(
          value,
          zonaData?.info?.data || {}
        )

        setFormState(formId, {
          formData: value as ZonaFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Zona'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, zonaData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: ZonaFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateZonaMutation.mutateAsync({
        id: zonaId,
        data: {
          id: zonaId,
          nome: values.nome,
          cemiterioId: selectedCemiterio?.id || values.cemiterioId,
        },
      })

      const result = handleApiResponse(
        response,
        'Zona atualizada com sucesso',
        'Erro ao atualizar zona',
        'Zona atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar cemitério zona'))
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
            tabKey={`zona-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Zona</TabsTrigger>
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
                        Identificação da Zona
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Informações básicas para identificação da zona
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
                      name='cemiterioId'
                      render={() => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            Cemitério
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Cemitério selecionado'
                              value={
                                selectedCemiterio?.nome ||
                                'Nenhum cemitério selecionado'
                              }
                              disabled
                              className='px-4 py-6 shadow-inner drop-shadow-xl bg-muted/50'
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
              disabled={updateZonaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateZonaMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>

      <EnhancedModal
        title='Criar Novo Cemitério'
        description='Crie um novo cemitério'
        isOpen={createCemiterioData.isOpen}
        onClose={() =>
          setCreateCemiterioData((prev) => ({ ...prev, isOpen: false }))
        }
        size='md'
      >
        <CemiterioCreateForm
          modalClose={() =>
            setCreateCemiterioData((prev) => ({ ...prev, isOpen: false }))
          }
          onSuccess={(newCemiterio) => {
            form.setValue('cemiterioId', newCemiterio.id, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
            setCreateCemiterioData((prev) => ({ ...prev, isOpen: false }))
          }}
          initialNome={createCemiterioData.nome}
          shouldCloseWindow={false}
        />
      </EnhancedModal>
    </div>
  )
}

export { ZonaUpdateForm }
