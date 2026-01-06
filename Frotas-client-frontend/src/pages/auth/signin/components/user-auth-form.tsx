import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/utils/toast-utils'
import { useLogin } from '@/hooks/use-auth'
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

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type UserFormValue = z.infer<typeof formSchema>

export function UserAuthForm() {
  const login = useLogin()

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'cliente@movi.pt',
      password: 'Cliente1234"',
    },
  })

  const onSubmit = async (data: UserFormValue) => {
    try {
      login.mutate(data, {
        onSuccess: (response) => {
          if (response.succeeded) {
            toast.success('Login realizado com sucesso')
          } else {
            toast.error(response.messages?.error || 'Credenciais inválidas')
          }
        },
        onError: (_error) => {
          toast.error('Credenciais inválidas')
        },
      })
    } catch (error) {
      toast.error('Algo correu mal')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Introduza o seu email...'
                  disabled={login.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Introduza a sua palavra-passe...'
                  disabled={login.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={login.isPending}
          className='ml-auto w-full'
          type='submit'
        >
          {login.isPending ? 'A entrar...' : 'Entrar com o email'}
        </Button>
      </form>
    </Form>
  )
}
