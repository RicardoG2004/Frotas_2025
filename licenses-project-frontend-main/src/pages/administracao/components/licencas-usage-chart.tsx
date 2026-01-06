'use client'

import { differenceInDays } from 'date-fns'
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface LicenseUsage {
  name: string
  usage: number
  color: string
}

export default function LicencasUsageChart() {
  const { data: licencasResponse, isLoading, error } = useGetLicencas()
  const licencas = licencasResponse?.info?.data || []

  if (isLoading) {
    return (
      <div>
        <CardHeader>
          <CardTitle>Uso das Licenças</CardTitle>
          <CardDescription>Por percentual de utilização</CardDescription>
        </CardHeader>
        <CardContent className='flex h-[350px] items-center justify-center'>
          <p>Carregando dados...</p>
        </CardContent>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <CardHeader>
          <CardTitle>Uso das Licenças</CardTitle>
          <CardDescription>Por percentual de utilização</CardDescription>
        </CardHeader>
        <CardContent className='flex h-[350px] items-center justify-center'>
          <p className='text-destructive'>Erro ao carregar dados</p>
        </CardContent>
      </div>
    )
  }

  // Calculate usage percentage for each active license
  const licenseUsage: LicenseUsage[] = licencas
    .filter((license) => license.ativo && license.dataInicio && license.dataFim)
    .map((license) => {
      const startDate = new Date(license.dataInicio!)
      const endDate = new Date(license.dataFim!)
      const today = new Date()

      const totalDays = differenceInDays(endDate, startDate)
      const daysUsed = differenceInDays(today, startDate)

      const usage = Math.round((daysUsed / totalDays) * 100)

      return {
        name: license.nome,
        usage: usage > 100 ? 100 : usage,
        color: license.aplicacao?.area?.color || '#4ade80',
      }
    })
    .filter((license) => license.usage >= 50)
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 10)

  const chartConfig = licenseUsage.reduce(
    (acc, license) => {
      acc[license.name] = {
        label: license.name,
        color: license.color,
      }
      return acc
    },
    {
      usage: {
        label: 'Uso',
      },
    } as ChartConfig
  )

  return (
    <div>
      <CardHeader>
        <CardTitle>Uso das Licenças</CardTitle>
        <CardDescription>Por percentual de utilização</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={licenseUsage}
              layout='vertical'
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='name'
                type='category'
                hide
                tickLine={false}
                axisLine={false}
              />
              <XAxis
                type='number'
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                hide
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value: ValueType) => `${value}%`}
                  />
                }
              />
              <Bar dataKey='usage' radius={4} barSize={40}>
                {licenseUsage.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList
                  dataKey='name'
                  position='insideLeft'
                  offset={8}
                  className='fill-[--color-label] dark:fill-white text-xs'
                />
                <LabelList
                  dataKey='usage'
                  position='right'
                  offset={8}
                  formatter={(value: number) => `${value}%`}
                  className='fill-foreground text-xs'
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
