import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useUpdateSepulturaTipoDescricao } from '@/pages/cemiterios/sepulturas-tipos-descricoes/queries/sepulturas-tipos-descricoes-mutations'
import { useGetSepulturaTipoDescricao } from '@/pages/cemiterios/sepulturas-tipos-descricoes/queries/sepulturas-tipos-descricoes-queries'
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
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'

const sepulturaTipoDescricaoFormSchema = z.object({
  descricao: z
    .string({ message: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
})

type SepulturaTipoDescricaoFormSchemaType = z.infer<
  typeof sepulturaTipoDescricaoFormSchema
>

interface SepulturaTipoDescricaoUpdateFormProps {
  modalClose: () => void
  sepulturaTipoDescricaoId: string
  initialData: {
    descricao: string
  }
}

const SepulturaTipoDescricaoUpdateForm = ({
  modalClose,
  sepulturaTipoDescricaoId,
  initialData,
}: SepulturaTipoDescricaoUpdateFormProps) => {
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

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `sepultura-tipo-descricao-${instanceId}`,
  })
  const { handleError } =
    useSubmitErrorTab<SepulturaTipoDescricaoFormSchemaType>({
      setActiveTab,
      fieldToTabMap: {
        default: 'dados',
        descricao: 'dados',
      },
    })

  const updateSepulturaTipoDescricaoMutation = useUpdateSepulturaTipoDescricao()
  const { data: sepulturaTipoDescricaoData } = useGetSepulturaTipoDescricao(
    sepulturaTipoDescricaoId
  )

  const sepulturaTipoDescricaoResolver: Resolver<
    SepulturaTipoDescricaoFormSchemaType
  > = async (values) => {
    const result = sepulturaTipoDescricaoFormSchema.safeParse(values)
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

  const form = useForm<SepulturaTipoDescricaoFormSchemaType>({
    resolver: sepulturaTipoDescricaoResolver,
    defaultValues: initialData,
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
      form.reset(formData as SepulturaTipoDescricaoFormSchemaType)
    } else if (sepulturaTipoDescricaoData) {
      // If no saved data, use the data from the API
      form.reset({
        descricao: sepulturaTipoDescricaoData.info.data.descricao,
      })
    }
  }, [formData, isInitialized, formId, hasFormData, sepulturaTipoDescricaoData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with original values
      const hasChanges = detectUpdateFormChanges(
        value,
        sepulturaTipoDescricaoData?.info?.data || {}
      )

      setFormState(formId, {
        formData: value as SepulturaTipoDescricaoFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      // Update window hasFormData flag
      updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
      // Update window title based on descricao field
      const newTitle = value.descricao || 'Descrição do Tipo'
      updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, sepulturaTipoDescricaoData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: SepulturaTipoDescricaoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateSepulturaTipoDescricaoMutation.mutateAsync({
        id: sepulturaTipoDescricaoId,
        data: {
          descricao: values.descricao,
        },
      })
      const result = handleApiResponse(
        response,
        'Descrição de tipo de sepultura atualizada com sucesso',
        'Erro ao atualizar descrição de tipo de sepultura',
        'Descrição de tipo de sepultura atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(
        handleApiError(
          error,
          'Erro ao atualizar cemitério sepultura tipo descrição'
        )
      )
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
            tabKey={`sepultura-tipo-descricao-${instanceId}`}
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
                          Descrição do Tipo de Sepultura
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Defina a descrição para este tipo de sepultura
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
              disabled={updateSepulturaTipoDescricaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateSepulturaTipoDescricaoMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SepulturaTipoDescricaoUpdateForm }
