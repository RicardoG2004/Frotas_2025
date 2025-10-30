import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateCodigoPostal } from '@/pages/base/codigospostais/queries/codigospostais-mutations'
import { MapPin, Tag, Building2 } from 'lucide-react'
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

const codigoPostalFormSchema = z.object({
  codigo: z.string().min(1, { message: 'O código é obrigatório' }),
  localidade: z.string().min(1, { message: 'A localidade é obrigatória' }),
})

type CodigoPostalFormValues = z.infer<typeof codigoPostalFormSchema>

interface CodigoPostalUpdateFormProps {
  modalClose: () => void
  codigoPostalId: string
  initialData: {
    codigo: string
    localidade: string
  }
}

const CodigoPostalUpdateForm = ({
  modalClose,
  codigoPostalId,
  initialData,
}: CodigoPostalUpdateFormProps) => {
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

  const updateCodigoPostalMutation = useUpdateCodigoPostal()

  const codigoPostalResolver: Resolver<CodigoPostalFormValues> = async (
    values
  ) => {
    const result = codigoPostalFormSchema.safeParse(values)
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

  const form = useForm<CodigoPostalFormValues>({
    resolver: codigoPostalResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `codigopostal-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<CodigoPostalFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      codigo: 'dados',
      localidade: 'dados',
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
        // Set initial window title
        const initialTitle = initialData.codigo || 'Código Postal'
        updateUpdateWindowTitle(windowId, initialTitle, updateWindowState)
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

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as CodigoPostalFormValues)
      // Update window title with saved form data
      if (formData?.codigo && windowId) {
        updateUpdateWindowTitle(windowId, formData.codigo, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    windowId,
    updateWindowState,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.codigo || value.localidade) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(value, initialData)

        setFormState(formId, {
          formData: value as CodigoPostalFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on codigo field
        const newTitle = value.codigo || 'Código Postal'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: CodigoPostalFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateCodigoPostalMutation.mutateAsync({
        id: codigoPostalId,
        data: {
          codigo: values.codigo,
          localidade: values.localidade,
        },
      })

      const result = handleApiResponse(
        response,
        'Código Postal atualizado com sucesso',
        'Erro ao atualizar código postal',
        'Código Postal atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar código postal'))
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
            tabKey={`codigopostal-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Código Postal</TabsTrigger>
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
                        Informações do Código Postal
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Atualize o código postal e a localidade correspondente
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='codigo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            Código Postal
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o código postal'
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
                      name='localidade'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            Localidade
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a localidade'
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
              disabled={updateCodigoPostalMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateCodigoPostalMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { CodigoPostalUpdateForm }
