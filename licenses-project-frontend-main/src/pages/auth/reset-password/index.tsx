import { Link } from 'react-router-dom'
import ResetPasswordForm from './components/reset-password-form'

export default function () {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        to='/auth/signin'
        className='absolute right-4 top-4 hidden md:right-8 md:top-8'
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-primary dark:bg-secondary' />
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Redefinir palavra-passe
            </h1>
            <p className='text-sm text-muted-foreground'>
              Introduza a sua nova palavra-passe
            </p>
          </div>

          <ResetPasswordForm />

          <p className='px-8 text-center text-sm text-muted-foreground'>
            Ao continuar, você concorda com nossos{' '}
            <Link
              to='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link
              to='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
