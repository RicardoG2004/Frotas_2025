'use client'

import { subMonths, addMonths, format, startOfDay, endOfDay } from 'date-fns'
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { CardContent } from '@/components/ui/card'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface DailyLicenseCount {
  date: string
  created: number
  ended: number
}

const chartConfig = {
  created: {
    label: 'Licenças Criadas',
    color: '#4ade80',
  },
  ended: {
    label: 'Licenças Terminadas',
    color: '#f87171',
  },
} satisfies ChartConfig

export default function LicencasCriadasTerminadasChart() {
  const { data: licencasResponse, isLoading, error } = useGetLicencas()
  const licencas = licencasResponse?.info?.data || []

  if (isLoading) {
    return (
      <div className='flex h-[350px] items-center justify-center'>
        <p>Carregando dados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-[350px] items-center justify-center'>
        <p className='text-destructive'>Erro ao carregar dados</p>
      </div>
    )
  }

  // Get date range for one month before and after current date
  const currentDate = new Date()
  const startDate = startOfDay(subMonths(currentDate, 1))
  const endDate = endOfDay(addMonths(currentDate, 1))

  // Initialize daily data for all days in the range
  const dailyData: Record<string, DailyLicenseCount> = {}
  let currentDay = startDate
  while (currentDay <= endDate) {
    const dateKey = format(currentDay, 'yyyy-MM-dd')
    dailyData[dateKey] = { date: dateKey, created: 0, ended: 0 }
    currentDay = new Date(currentDay.setDate(currentDay.getDate() + 1))
  }

  // Fill in the actual license data
  licencas.forEach((license) => {
    const createdDate = license.dataInicio
      ? startOfDay(new Date(license.dataInicio))
      : null
    const endedDate = license.dataFim
      ? startOfDay(new Date(license.dataFim))
      : null

    if (createdDate && createdDate >= startDate && createdDate <= endDate) {
      const dateKey = format(createdDate, 'yyyy-MM-dd')
      if (dailyData[dateKey]) {
        dailyData[dateKey].created++
      }
    }

    if (endedDate && endedDate >= startDate && endedDate <= endDate) {
      const dateKey = format(endedDate, 'yyyy-MM-dd')
      if (dailyData[dateKey]) {
        dailyData[dateKey].ended++
      }
    }
  })

  // Convert to array and sort by date
  const chartData = Object.values(dailyData).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  return (
    <div>
      <CardHeader>
        <CardTitle>Licenças Criadas vs. Terminadas</CardTitle>
        <CardDescription>Últimos 2 meses</CardDescription>
      </CardHeader>
      <CardContent className='pl-2'></CardContent>
      <ResponsiveContainer width='100%' height={300}>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              stroke='#888888'
              fontSize={12}
            />
            <YAxis stroke='#888888' fontSize={12} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    format(new Date(value), 'dd/MM/yyyy')
                  }
                />
              }
            />
            <Bar
              dataKey='created'
              name='Criadas'
              fill={chartConfig.created.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='ended'
              name='Terminadas'
              fill={chartConfig.ended.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  )
}
