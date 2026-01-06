import AplicacoesPorArea from '@/pages/dashboard/components/aplicacoes-por-area-chart'
import RecentAplicacoes from '@/pages/dashboard/components/recent-aplicacoes'
import { useGetDashboardCounts } from '@/pages/dashboard/queries/dashboard-queries'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.js'
import PageHead from '@/components/shared/page-head.jsx'

export default function DashboardPage() {
  const { areasCount, aplicacoesCount, activeAplicacoesCount, isLoading } =
    useGetDashboardCounts()

  return (
    <>
      <PageHead title='Dashboard | GSLP' />
      <div className='flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Olá, Bem-vindo de volta 👋
          </h2>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Resumo</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analítico
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Áreas
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
                    <path d='M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' />
                    <path d='M9 12h6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : areasCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Áreas registadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Aplicações
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
                    <path d='M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' />
                    <path d='M9 12h6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : aplicacoesCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Aplicações registadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Aplicações Ativas
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
                    <path d='M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' />
                    <path d='M9 12h6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : activeAplicacoesCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Aplicações ativas
                  </p>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    <path d="M9 12h6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card> */}
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <Card className='col-span-4'>
                <CardHeader>
                  <CardTitle>Aplicações por Área</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <AplicacoesPorArea />
                </CardContent>
              </Card>
              <Card className='col-span-4 md:col-span-3'>
                <CardHeader>
                  <CardTitle>Aplicações Recentes</CardTitle>
                  <CardDescription>
                    Novas aplicações nos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentAplicacoes />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
