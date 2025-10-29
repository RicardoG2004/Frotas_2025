import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
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
import { useToast } from '@/components/ui/use-toast'

const formSchema = z
  .object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(8, { message: 'A palavra-passe deve ter pelo menos 8 caracteres' }),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  })

export default function ResetPasswordForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || '',
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const utilizadoresService = UtilizadoresService('reset-password')
      const response = await utilizadoresService.resetPassword(data)

      if (response.info.succeeded) {
        toast({
          title: 'Sucesso',
          description: 'Palavra-passe alterada com sucesso',
          variant: 'success',
        })
        navigate('/login')
      } else {
        toast({
          title: 'Erro',
          description: getErrorMessage(
            response,
            'Erro ao alterar palavra-passe'
          ),
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: handleApiError(error, 'Algo correu mal'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Introduza o seu email'
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
              <FormLabel>Nova palavra-passe</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Introduza a nova palavra-passe'
                    disabled={loading}
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-500' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-500' />
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
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar palavra-passe</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirme a nova palavra-passe'
                    disabled={loading}
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-500' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-500' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className='w-full' type='submit'>
          {loading ? 'Alterando palavra-passe...' : 'Alterar palavra-passe'}
        </Button>
      </form>
    </Form>
  )
}
