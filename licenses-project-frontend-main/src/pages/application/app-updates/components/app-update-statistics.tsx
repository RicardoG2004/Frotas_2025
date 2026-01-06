import { format } from 'date-fns'
import { AppUpdateStatisticsDTO } from '@/types/dtos'
import { pt } from 'date-fns/locale'
import { Package, CheckCircle, Calendar, HardDrive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AppUpdateStatisticsProps {
  statistics: AppUpdateStatisticsDTO
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default function AppUpdateStatistics({
  statistics,
}: AppUpdateStatisticsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total de Atualizações
          </CardTitle>
          <Package className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{statistics.totalUpdates}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Ativas</CardTitle>
          <CheckCircle className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{statistics.activeUpdates}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Última Versão</CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {statistics.latestVersion || 'N/A'}
          </div>
          {statistics.latestReleaseDate && (
            <p className='text-xs text-muted-foreground'>
              {format(new Date(statistics.latestReleaseDate), 'dd/MM/yyyy', {
                locale: pt,
              })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tamanho Total</CardTitle>
          <HardDrive className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatFileSize(statistics.totalFileSize)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
