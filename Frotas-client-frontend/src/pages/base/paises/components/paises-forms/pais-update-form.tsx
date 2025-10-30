import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdatePais } from '@/pages/base/paises/queries/paises-mutations'
import { useGetPais } from '@/pages/base/paises/queries/paises-queries'
import { Globe, Tag, Hash } from 'lucide-react'
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

const paisFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  codigo: z.string().min(1, { message: 'O código é obrigatório' }),
  prefixo: z.string().min(1, { message: 'O prefixo é obrigatório' }),
})

type PaisFormValues = z.infer<typeof paisFormSchema>

interface PaisUpdateFormProps {
  modalClose: () => void
  paisId: string
  initialData: {
    nome: string
    codigo: string
    prefixo: string
  }
}

const PaisUpdateForm = ({
  modalClose,
  paisId,
  initialData,
}: PaisUpdateFormProps) => {
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

  const updatePaisMutation = useUpdatePais()
  const { data: paisData } = useGetPais(paisId)

  const paisResolver: Resolver<PaisFormValues> = async (values) => {
    const result = paisFormSchema.safeParse(values)
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

  const form = useForm<PaisFormValues>({
    resolver: paisResolver,
    defaultValues: {
      nome: '',
      codigo: '',
      prefixo: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `pais-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<PaisFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      codigo: 'dados',
      prefixo: 'dados',
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
      form.reset(formData as PaisFormValues)
      // Update window title with initial form data
      if (formData?.nome && windowId) {
        updateUpdateWindowTitle(windowId, formData.nome, updateWindowState)
      }
    } else if (paisData?.info?.data) {
      // If no saved data, use the data from the API
      const pais = paisData.info.data
      form.reset({
        nome: pais.nome,
        codigo: pais.codigo,
        prefixo: pais.prefixo,
      })
      // Update window title with API data
      if (pais.nome && windowId) {
        updateUpdateWindowTitle(windowId, pais.nome, updateWindowState)
      }
    }
  }, [formData, isInitialized, formId, hasFormData, paisData, windowId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.codigo || value.prefixo) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(
          value,
          paisData?.info?.data || {}
        )

        setFormState(formId, {
          formData: value as PaisFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        updateUpdateWindowTitle(windowId, value.nome, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, paisData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: PaisFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updatePaisMutation.mutateAsync({
        id: paisId,
        data: {
          nome: values.nome,
          codigo: values.codigo,
          prefixo: values.prefixo,
        },
      })

      const result = handleApiResponse(
        response,
        'País atualizado com sucesso',
        'Erro ao atualizar país',
        'País atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar país'))
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
            tabKey={`pais-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do País</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Globe className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações do País
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas do país
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4'>
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
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='codigo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Código
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o código'
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
                      name='prefixo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Prefixo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o prefixo'
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
              disabled={updatePaisMutation.isPending}
              className='w-full md:w-auto'
            >
              {updatePaisMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { PaisUpdateForm }
