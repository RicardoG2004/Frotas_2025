import { useGetAplicacoesPaginated } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

export default function AplicacoesPorArea() {
  const {
    data: aplicacoesResponse,
    isLoading,
    error,
  } = useGetAplicacoesPaginated(1, 100, null, null)
  const aplicacoes = aplicacoesResponse?.info?.data || []

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  if (!aplicacoes.length) {
    return <div>No data available</div>
  }

  // Process data to count applications by area
  const processedData = aplicacoes.reduce((acc: any[], app) => {
    const existingArea = acc.find((item) => item.name === app.area?.nome)

    if (existingArea) {
      existingArea.total++
      if (app.ativo) {
        existingArea.active++
      } else {
        existingArea.inactive++
      }
    } else {
      acc.push({
        name: app.area?.nome || 'Sem área',
        total: 1,
        active: app.ativo ? 1 : 0,
        inactive: app.ativo ? 0 : 1,
      })
    }
    return acc
  }, [])

  return (
    <div className='h-[350px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={processedData}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey='active'
            name='Ativas'
            fill='#4ade80'
            radius={[4, 4, 0, 0]}
            stackId='stack'
          />
          <Bar
            dataKey='inactive'
            name='Inativas'
            fill='#f87171'
            radius={[4, 4, 0, 0]}
            stackId='stack'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
