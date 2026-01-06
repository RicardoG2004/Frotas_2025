import { differenceInDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLicenca } from '../queries/licencas-admin-queries'
import { useGetLicencaUtilizadoresRoleClient } from '../queries/licencas-admin-queries'

interface LicencaExpirationProgressProps {
  licencaId: string
}

export function LicencaExpirationProgress({
  licencaId,
}: LicencaExpirationProgressProps) {
  const { data: licenca, isLoading: isLoadingLicenca } =
    useGetLicenca(licencaId)
  const { data: utilizadoresResponse, isLoading: isLoadingUsers } =
    useGetLicencaUtilizadoresRoleClient(licencaId)

  const utilizadoresAtivos =
    utilizadoresResponse?.info?.data?.filter((u) => u.ativo)?.length || 0
  const maxUtilizadores = licenca?.numeroUtilizadores || 0

  if (isLoadingLicenca || isLoadingUsers) {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Skeleton className='h-[120px]' />
          <Skeleton className='h-[120px]' />
        </div>
        <Skeleton className='h-[200px]' />
      </div>
    )
  }

  if (!licenca?.dataInicio || !licenca?.dataFim) {
    return null
  }

  const startDate = new Date(licenca.dataInicio)
  const endDate = new Date(licenca.dataFim)
  const today = new Date()

  const totalDays = differenceInDays(endDate, startDate)
  const daysUsed = differenceInDays(today, startDate)
  const percentage = Math.round((daysUsed / totalDays) * 100)

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Utilizadores Ativos
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
              <path d='M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{utilizadoresAtivos}</div>
            <p className='text-xs text-muted-foreground'>
              Utilizadores atualmente ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Limite de Utilizadores
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
              <path d='M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{maxUtilizadores}</div>
            <p className='text-xs text-muted-foreground'>
              Máximo de utilizadores permitidos
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <div className='p-4'>
          <h3 className='text-sm font-medium'>Progresso da Licença</h3>
          <p className='text-xs text-muted-foreground'>
            Percentual de tempo utilizado da licença
          </p>

          <div className='mt-4 space-y-2'>
            <Progress value={percentage} className='h-2' />
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>{percentage}% utilizado</span>
              <span>{100 - percentage}% restante</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
