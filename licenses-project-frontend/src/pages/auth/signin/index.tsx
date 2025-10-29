import { useState } from 'react'
import ForgotPasswordForm from '@/pages/auth/signin/components/forgot-password-form'
import UserAuthForm from '@/pages/auth/signin/components/user-auth-form'
import { Link } from 'react-router-dom'
import { Logo } from '@/assets/logo'
import { Logo as LogoLetters } from '@/assets/logo-letters'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function () {
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        to='/'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex'>
        <div className='absolute inset-0 bg-primary dark:bg-secondary' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Logo width={95} height={95} className='text-white' disableLink />
        </div>
        <div className='relative z-20 mt-auto'>
          <div className='mb-4 flex justify-center'>
            <LogoLetters width={200} className='text-white' disableLink />
          </div>
          {/* <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote> */}
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {showForgotPassword
                ? 'Recuperar palavra-passe'
                : 'Faça login para continuar'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {showForgotPassword
                ? 'Introduza o seu email para recuperar a palavra-passe'
                : 'Introduza o seu email e palavra-passe para continuar'}
            </p>
          </div>

          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : (
            <>
              <UserAuthForm />
              <button
                onClick={() => setShowForgotPassword(true)}
                className='text-sm text-muted-foreground hover:text-primary underline underline-offset-4'
              >
                Esqueceu a sua palavra-passe?
              </button>
            </>
          )}

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
