import { addDays, isWithinInterval, startOfDay } from 'date-fns'
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { CardHeader } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'

export default function LicencasAExpirarChart() {
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

  // Get today and 30 days from now
  const today = startOfDay(new Date())
  const thirtyDaysFromNow = addDays(today, 30)

  // Filter licenses that will expire in the next 30 days
  const expiringLicenses = licencas.filter(
    (lic) =>
      lic.dataFim &&
      lic.ativo &&
      isWithinInterval(new Date(lic.dataFim), {
        start: today,
        end: thirtyDaysFromNow,
      })
  )

  // Group licenses by week
  const weeklyData = [
    { name: '0-7 dias', range: [0, 7], count: 0 },
    { name: '8-14 dias', range: [8, 14], count: 0 },
    { name: '15-21 dias', range: [15, 21], count: 0 },
    { name: '22-30 dias', range: [22, 30], count: 0 },
  ]

  expiringLicenses.forEach((license) => {
    const daysUntilExpiry = Math.floor(
      (new Date(license.dataFim!).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    const week = weeklyData.find(
      (w) => daysUntilExpiry >= w.range[0] && daysUntilExpiry <= w.range[1]
    )

    if (week) {
      week.count++
    }
  })

  return (
    <div>
      <CardHeader>
        <CardTitle>Licenças a Expirar</CardTitle>
        <CardDescription>Próximos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey='name' stroke='#888888' fontSize={12} />
            <YAxis stroke='#888888' fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey='count'
              name='Licenças a expirar'
              fill='#f59e0b'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
