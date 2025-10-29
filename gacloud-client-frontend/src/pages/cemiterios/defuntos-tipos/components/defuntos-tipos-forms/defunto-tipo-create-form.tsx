import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useCreateDefuntoTipo } from '@/pages/cemiterios/defuntos-tipos/queries/defuntos-tipos-mutations'
import { FileText } from 'lucide-react'
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
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'

const defuntoTipoFormSchema = z.object({
  descricao: z
    .string({ message: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
})

type DefuntoTipoFormSchemaType = z.infer<typeof defuntoTipoFormSchema>

interface DefuntoTipoCreateFormProps {
  modalClose: () => void
  initialDescricao?: string
  onSuccess?: (newDefuntoTipo: { id: string; descricao: string }) => void
  shouldCloseWindow?: boolean
}

export function DefuntoTipoCreateForm({
  modalClose,
  initialDescricao,
  onSuccess,
  shouldCloseWindow = true,
}: DefuntoTipoCreateFormProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `cemiterio-defunto-tipo-${instanceId}`

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, setWindowReturnData } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `defunto-tipo-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<DefuntoTipoFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      descricao: 'dados',
    },
  })

  const createDefuntoTipoMutation = useCreateDefuntoTipo()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      descricao: '',
    }),
    []
  )

  const defuntoTipoResolver: Resolver<DefuntoTipoFormSchemaType> = async (
    values
  ) => {
    const result = defuntoTipoFormSchema.safeParse(values)
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

  const form = useForm<DefuntoTipoFormSchemaType>({
    resolver: defuntoTipoResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
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
      form.reset(formData as DefuntoTipoFormSchemaType)
    } else if (initialDescricao) {
      // If no saved data, use the pre-selected values
      form.reset({
        descricao: initialDescricao || '',
      })
    }
  }, [formData, isInitialized, formId, hasFormData, initialDescricao])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as DefuntoTipoFormSchemaType,
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
        // Update window title based on descricao field
        updateCreateWindowTitle(
          windowId,
          value.descricao || '',
          updateWindowState
        )
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

  const onSubmit = async (values: DefuntoTipoFormSchemaType) => {
    try {
      const finalValues = {
        ...values,
      }

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createDefuntoTipoMutation.mutateAsync(finalValues)
      const result = handleApiResponse(
        response,
        'Tipo de defunto criado com sucesso',
        'Erro ao criar tipo de defunto',
        'Tipo de defunto criado com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (windowId) {
          setEntityReturnDataWithToastSuppression(
            windowId,
            { id: result.data as string, nome: values.descricao },
            'defunto-tipo',
            setWindowReturnData,
            undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: result.data as string,
            descricao: values.descricao,
          })
          onSuccess({
            id: result.data as string,
            descricao: values.descricao,
          })
        }
        // Only close the window if shouldCloseWindow is true
        if (windowId && shouldCloseWindow) {
          removeWindow(windowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar tipo de defunto'))
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
          id='cemiterioDefuntoTipoCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`defunto-tipo-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='dados'>Dados</PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='dados'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <FileText className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Descrição do Tipo de Defunto
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Defina a descrição para este tipo de defunto
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='descricao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <FileText className='h-4 w-4' />
                              Descrição
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza a descrição'
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
              disabled={createDefuntoTipoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createDefuntoTipoMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
