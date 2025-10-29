'use client'

import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
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

interface LicenseCountByArea {
  name: string
  total: number
  active: number
  expired: number
}

const licenseStatusConfig = {
  active: {
    label: 'Ativas',
    color: '#4ade80',
  },
  expired: {
    label: 'Expiradas',
    color: '#f87171',
  },
} satisfies ChartConfig

export default function LicenseDistributionByArea() {
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

  if (!licencas.length) {
    return (
      <div className='flex h-[350px] items-center justify-center'>
        <p className='text-muted-foreground'>Nenhuma licença encontrada</p>
      </div>
    )
  }

  // // Filter licenses from the last 30 days
  // const thirtyDaysAgo = subDays(new Date(), 30)
  // const recentLicenses = licencas.filter(
  //   (license) =>
  //     license.dataInicio && new Date(license.dataInicio) >= thirtyDaysAgo
  // )

  // Group licenses by area and count active/expired status
  const licensesByArea = licencas.reduce<LicenseCountByArea[]>(
    (acc, license) => {
      const areaName = license.aplicacao?.area?.nome || 'Sem área'
      const isActive =
        license.dataFim &&
        new Date(license.dataFim) > new Date() &&
        license.ativo === true

      const existingArea = acc.find((item) => item.name === areaName)
      if (existingArea) {
        existingArea.total++
        isActive ? existingArea.active++ : existingArea.expired++
      } else {
        acc.push({
          name: areaName,
          total: 1,
          active: isActive ? 1 : 0,
          expired: isActive ? 0 : 1,
        })
      }
      return acc
    },
    []
  )

  // Get top 5 areas by total license count
  const topAreas = licensesByArea
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((area) => ({
      ...area,
      name: area.name.length > 20 ? `${area.name.slice(0, 20)}...` : area.name,
    }))

  return (
    <div>
      <CardHeader>
        <CardTitle>Áreas com mais licenças</CardTitle>
        <CardDescription>Geral</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <ChartContainer config={licenseStatusConfig}>
            <BarChart
              data={topAreas}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              height={350}
            >
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor='end'
                height={60}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey='active'
                stackId='stack'
                radius={[4, 4, 0, 0]}
                fill={licenseStatusConfig.active.color}
              />
              <Bar
                dataKey='expired'
                stackId='stack'
                radius={[4, 4, 0, 0]}
                fill={licenseStatusConfig.expired.color}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
