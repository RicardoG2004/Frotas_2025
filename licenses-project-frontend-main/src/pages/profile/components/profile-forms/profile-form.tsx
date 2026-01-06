import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GSResponse } from '@/types'
import { UtilizadorDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { cn } from '@/lib/utils'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpdateProfile } from '../../queries/profile-mutations'
import {
  profileFormSchema,
  ProfileFormSchemaType,
} from '../../schemas/profile-schema'

interface ProfileFormProps {
  profileData?: ResponseApi<GSResponse<UtilizadorDTO>>
  isLoading: boolean
}

export default function ProfileForm({
  profileData,
  isLoading,
}: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile()

  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profileData?.info?.data?.firstName || '',
      lastName: profileData?.info?.data?.lastName || '',
      email: profileData?.info?.data?.email || '',
      phoneNumber: profileData?.info?.data?.phoneNumber || '',
    },
  })

  const onSubmit = async (data: ProfileFormSchemaType) => {
    try {
      const response = await updateProfileMutation.mutateAsync(data)

      if (response.info.succeeded) {
        toast.success('Perfil atualizado com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar perfil'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar perfil'))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder='Introduza o nome' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apelido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PhoneInput
                    country={'pt'}
                    value={value}
                    onChange={(phone) => onChange(phone)}
                    inputClass={cn(
                      'flex h-[50px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
                      'px-4 shadow-inner'
                    )}
                    containerClass='w-full'
                    buttonClass={cn(
                      'absolute top-0 bottom-0 left-0 border border-input rounded-l-md bg-transparent hover:bg-accent',
                      'flex items-center justify-center px-3'
                    )}
                    dropdownClass='bg-background border-input text-foreground'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'A guardar...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
