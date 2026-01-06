import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const frontendConfigSchema = z.object({
  urlApiHttp: z.string().min(1, { message: 'URL API HTTP é obrigatória' }),
  urlApiHttps: z.string().min(1, { message: 'URL API HTTPS é obrigatória' }),
  urlAccessControlHttp: z
    .string()
    .min(1, { message: 'URL Access Control HTTP é obrigatória' }),
  urlAccessControlHttps: z
    .string()
    .min(1, { message: 'URL Access Control HTTPS é obrigatória' }),
  updaterApiUrlHttp: z
    .string()
    .min(1, { message: 'URL Updater API HTTP é obrigatória' }),
  updaterApiUrlHttps: z
    .string()
    .min(1, { message: 'URL Updater API HTTPS é obrigatória' }),
})

type FrontendConfigFormData = z.infer<typeof frontendConfigSchema>

interface FrontendConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (config: FrontendConfigFormData) => void
  defaultValues?: Partial<FrontendConfigFormData>
}

export function FrontendConfigModal({
  isOpen,
  onClose,
  onConfirm,
  defaultValues,
}: FrontendConfigModalProps) {
  const form = useForm<FrontendConfigFormData>({
    resolver: zodResolver(frontendConfigSchema),
    defaultValues: {
      urlApiHttp: defaultValues?.urlApiHttp || 'http://api.example.com:8084',
      urlApiHttps: defaultValues?.urlApiHttps || 'https://api.example.com:8094',
      urlAccessControlHttp:
        defaultValues?.urlAccessControlHttp || 'http://api.example.com:8084',
      urlAccessControlHttps:
        defaultValues?.urlAccessControlHttps || 'https://api.example.com:8094',
      updaterApiUrlHttp:
        defaultValues?.updaterApiUrlHttp || 'http://updater.example.com:5275',
      updaterApiUrlHttps:
        defaultValues?.updaterApiUrlHttps || 'https://updater.example.com:7038',
    },
  })

  const onSubmit = (data: FrontendConfigFormData) => {
    onConfirm(data)
    onClose()
  }

  return (
    <EnhancedModal
      title='Configuração de URLs e Portas'
      description='Configure as URLs e portas para a configuração do frontend'
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='text-sm font-semibold'>API URLs</h3>
              <FormField
                control={form.control}
                name='urlApiHttp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>URL API HTTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='http://api.example.com:8084'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='urlApiHttps'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>URL API HTTPS</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://api.example.com:8094'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-sm font-semibold'>URL Login</h3>
              <FormField
                control={form.control}
                name='urlAccessControlHttp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>URL Login HTTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='http://api.example.com:8084'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='urlAccessControlHttps'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>URL Login HTTPS</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://api.example.com:8094'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-sm font-semibold'>Updater API URLs</h3>
              <FormField
                control={form.control}
                name='updaterApiUrlHttp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>
                      URL Updater API HTTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='http://updater.example.com:5275'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='updaterApiUrlHttps'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>
                      URL Updater API HTTPS
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://updater.example.com:7038'
                        {...field}
                        className='h-9 px-3 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit'>Confirmar e Descarregar</Button>
          </div>
        </form>
      </Form>
    </EnhancedModal>
  )
}
