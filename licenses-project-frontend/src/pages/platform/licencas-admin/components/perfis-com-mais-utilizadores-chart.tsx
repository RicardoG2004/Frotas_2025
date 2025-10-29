import { useGetPerfisUtilizadoresFromLicenca } from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { PieChart, Pie, ResponsiveContainer, Label } from 'recharts'
import { PREDEFINED_COLORS } from '@/lib/constants/colors'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface PerfilCount {
  name: string
  value: number
  fill: string
}

export function PerfisComMaisUtilizadoresChart() {
  const {
    data: perfisResponse,
    isLoading,
    error,
  } = useGetPerfisUtilizadoresFromLicenca()
  const perfis = perfisResponse?.info?.data?.perfis || []

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

  const processedData = perfis.reduce<PerfilCount[]>((acc, perfil) => {
    if (perfil.ativo) {
      acc.push({
        name: perfil.nome || 'Sem nome',
        value: perfil.utilizadores.length,
        fill: PREDEFINED_COLORS[acc.length % PREDEFINED_COLORS.length].value,
      })
    }
    return acc
  }, [])

  const topPerfis = processedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((perfil) => ({
      ...perfil,
      name:
        perfil.name.length > 20
          ? `${perfil.name.slice(0, 20)}...`
          : perfil.name,
    }))

  const chartData = topPerfis.map((perfil) => ({
    ...perfil,
    fill: perfil.fill,
  }))

  const chartConfig = topPerfis.reduce(
    (acc, perfil) => {
      acc[perfil.name] = {
        label: perfil.name,
        color: perfil.fill,
      }
      return acc
    },
    {
      value: {
        label: 'Utilizadores',
      },
    } as Record<string, { label: string; color?: string }>
  )

  const totalUtilizadores = topPerfis.reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <CardHeader>
        <CardTitle>Distribuição por Perfil</CardTitle>
        <CardDescription>Utilizadores por perfil</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-3xl font-bold'
                          >
                            {totalUtilizadores.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Utilizadores
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
