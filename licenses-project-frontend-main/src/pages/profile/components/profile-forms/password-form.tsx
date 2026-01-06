import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
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
import { useChangePassword } from '../../queries/profile-mutations'
import {
  passwordFormSchema,
  PasswordFormSchemaType,
} from '../../schemas/password-schema'

export default function PasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const changePasswordMutation = useChangePassword()

  const form = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (data: PasswordFormSchemaType) => {
    try {
      const response = await changePasswordMutation.mutateAsync(data)

      if (response.info.succeeded) {
        toast.success('Palavra-passe alterada com sucesso')
        form.reset()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao alterar palavra-passe'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao alterar palavra-passe'))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-passe Atual</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                    >
                      {showCurrentPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Palavra-passe</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                    >
                      {showNewPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmNewPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nova Palavra-passe</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end'>
          <Button type='submit' disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'A guardar...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
