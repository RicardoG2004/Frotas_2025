import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@/routes/hooks'
import TokensClient from '@/lib/services/auth/tokens-client'
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

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const defaultValues = {
    email: 'administrator@globalsoft.pt',
    password: 'Password123!',
  }

  // const defaultValues = {
  //   email: 'admin@globalsoft.pt',
  //   password: 'Password123!',
  // }

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    try {
      setLoading(true)
      const success = await TokensClient.login(data.email, data.password)

      if (success) {
        toast.success('Login realizado com sucesso')
        router.push('/')
      } else {
        toast.error('Credenciais inválidas')
      }
    } catch (error) {
      toast.error('Algo correu mal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
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
                    disabled={loading}
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
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            {loading ? 'A entrar...' : 'Entrar com o email'}
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Ou continue com
          </span>
        </div>
      </div>
    </>
  )
}
