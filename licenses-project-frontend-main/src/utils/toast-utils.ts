import { toast as baseToast } from '@/components/ui/use-toast'

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning'

interface ToastOptions {
  title?: string
  description: string
  variant?: ToastVariant
}

export const toast = {
  success: (description: string, title: string = 'Sucesso') => {
    baseToast({
      title,
      description,
      variant: 'success',
    })
  },

  error: (
    description: string | string[],
    title: string = 'Ocorreu um erro'
  ) => {
    const errorMessage = Array.isArray(description)
      ? description.join(', ')
      : description

    baseToast({
      title,
      description: errorMessage,
      variant: 'destructive',
    })
  },

  warning: (description: string, title: string = 'Atenção') => {
    baseToast({
      title,
      description,
      variant: 'warning',
    })
  },

  info: (description: string, title: string = 'Informação') => {
    baseToast({
      title,
      description,
      variant: 'default',
    })
  },

  custom: ({ title, description, variant = 'default' }: ToastOptions) => {
    baseToast({
      title,
      description,
      variant,
    })
  },
}
