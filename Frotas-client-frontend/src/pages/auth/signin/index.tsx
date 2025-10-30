import { useState } from 'react'
import { UserAuthForm } from '@/pages/auth/signin/components/user-auth-form'
import { Link } from 'react-router-dom'
import { Logo as LogoLetters } from '@/assets/logo-letters'
import { LogoLumaWhite } from '@/assets/logo-luma-white'
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
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden'>
        {/* Animated gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary animate-pulse' />

        {/* Decorative geometric shapes */}
        <div className='absolute inset-0 overflow-hidden'>
          {/* Large circle */}
          <div className='absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-xl animate-pulse' />
          <div className='absolute top-1/4 -right-16 w-32 h-32 bg-white/5 rounded-full blur-lg' />

          {/* Medium circles */}
          <div
            className='absolute top-1/3 left-8 w-24 h-24 bg-white/15 rounded-full blur-md animate-bounce'
            style={{ animationDelay: '1s', animationDuration: '3s' }}
          />
          <div
            className='absolute bottom-1/4 right-12 w-16 h-16 bg-white/20 rounded-full blur-sm animate-pulse'
            style={{ animationDelay: '2s' }}
          />

          {/* Small decorative dots */}
          <div
            className='absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping'
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className='absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping'
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className='absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping'
            style={{ animationDelay: '2.5s' }}
          />

          {/* Gradient lines */}
          <div className='absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent' />
          <div className='absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent' />
        </div>

        {/* Main content */}
        <div className='relative z-20 flex flex-col h-full'>
          {/* Logo section */}
          <div className='flex items-center text-lg font-medium mb-8'>
            <div className='relative'>
              <LogoLumaWhite
                width={95}
                height={95}
                className='text-white drop-shadow-lg'
                disableLink
              />
              {/* Glow effect around logo */}
              <div className='absolute inset-0 bg-white/20 rounded-full blur-md -z-10 animate-pulse' />
            </div>
          </div>

          {/* Welcome text section */}
          <div className='flex-1 flex flex-col justify-center space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-4xl font-bold text-white drop-shadow-lg'>
                Bem-vindo
              </h2>
              <h3 className='text-2xl font-semibold text-white/90 drop-shadow-md'>
                ao Sistema de Gestão
              </h3>
              <div className='w-16 h-1 bg-white/60 rounded-full' />
            </div>

            <div className='space-y-3 text-white/80'>
              <p className='text-lg leading-relaxed'>
                Gerencie frotas de forma eficiente e moderna
              </p>
              <p className='text-sm leading-relaxed'>
                Uma plataforma completa para administração e controlo
              </p>
            </div>
          </div>

          {/* Bottom section with logo letters */}
          <div className='relative z-20 mt-auto'>
            <div className='mb-6 flex justify-center'>
              <LogoLetters
                width={200}
                className='text-white drop-shadow-lg'
                disableLink
              />
            </div>

            {/* Feature highlights */}
            <div className='grid grid-cols-2 gap-4 text-center text-sm text-white/70'>
              <div className='space-y-1'>
                <div className='w-2 h-2 bg-white/40 rounded-full mx-auto' />
                <p>Gestão Completa</p>
              </div>
              <div className='space-y-1'>
                <div className='w-2 h-2 bg-white/40 rounded-full mx-auto' />
                <p>Interface Moderna</p>
              </div>
            </div>
          </div>
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

          <UserAuthForm />
          <button
            onClick={() => setShowForgotPassword(true)}
            className='text-sm text-muted-foreground hover:text-primary underline underline-offset-4'
          >
            Esqueceu a sua palavra-passe?
          </button>

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
