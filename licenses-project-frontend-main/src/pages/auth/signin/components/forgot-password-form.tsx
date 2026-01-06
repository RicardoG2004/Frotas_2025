import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
})

type ForgotPasswordFormProps = {
  onBack: () => void
}

export default function ForgotPasswordForm({
  onBack,
}: ForgotPasswordFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const utilizadoresService = UtilizadoresService('forgot-password')
      const response = await utilizadoresService.forgotPassword(data.email)

      if (response.info.succeeded) {
        toast({
          title: 'Sucesso',
          description: response.info.data,
          variant: 'success',
        })

        onBack()
      } else {
        toast({
          title: 'Erro',
          description: getErrorMessage(
            response,
            'Erro ao recuperar palavra-passe'
          ),
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.log(error)

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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-4'
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

          <div className='flex flex-col space-y-2'>
            <Button disabled={loading} className='w-full' type='submit'>
              {loading ? 'Enviando...' : 'Enviar email de recuperação'}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={onBack}
              disabled={loading}
              className='w-full'
            >
              Voltar ao login
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
