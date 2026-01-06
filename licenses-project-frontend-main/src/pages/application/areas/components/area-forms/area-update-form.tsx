import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateArea } from '@/pages/application/areas/queries/areas-mutations'
import { AreaDTO } from '@/types/dtos'
import { PREDEFINED_COLORS } from '@/lib/constants/colors'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
})

type AreaUpdateFormProps = {
  modalClose: () => void
  areaId: string
  initialData: AreaDTO
}

export default function AreaUpdateForm({
  modalClose,
  areaId,
  initialData,
}: AreaUpdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData.nome,
      color: initialData.color,
    },
  })

  const updateAreaMutation = useUpdateArea()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateAreaMutation.mutateAsync({
        id: areaId,
        data: values,
      })
      modalClose()
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar área'))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
          autoComplete='off'
        >
          <div className='grid grid-cols-1 gap-x-8 gap-y-4'>
            <FormField
              control={form.control}
              name='nome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue>
                          <div className='flex items-center gap-2'>
                            <div
                              className='h-4 w-4 rounded-full'
                              style={{ backgroundColor: field.value }}
                            />
                            <span>
                              {PREDEFINED_COLORS.find(
                                (c) => c.value === field.value
                              )?.label || field.value}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-4 w-4 rounded-full'
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
            <Button
              type='button'
              variant='outline'
              onClick={modalClose}
              className='w-full md:w-auto'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateAreaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateAreaMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
