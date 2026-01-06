import AreasComMaisLicencas from '@/pages/administracao/components/areas-com-mais-licencas-chart'
import LicencasAExpirarChart from '@/pages/administracao/components/licencas-a-expirar-chart'
import { LicencasPorAreaPieChart } from '@/pages/administracao/components/licencas-por-area-pie-chart'
import LicencasUsageChart from '@/pages/administracao/components/licencas-usage-chart'
import { useGetAdministracaoCounts } from '@/pages/administracao/queries/administracao-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHead from '@/components/shared/page-head'
import { ScrollIndicator } from '@/components/shared/scroll-indicator'

export default function AdministratorDashboard() {
  const { clientesCount, licencasCount, activeLicencasCount, isLoading } =
    useGetAdministracaoCounts()

  return (
    <>
      <PageHead title='Administração | GSLP' />
      <ScrollIndicator />
      <div className='flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Administração do Sistema
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
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : clientesCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Clientes registados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Licenças
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : licencasCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Licenças registadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Licenças Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoading ? '...' : activeLicencasCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Licenças em vigor
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-12'>
              <Card className='col-span-4'>
                <AreasComMaisLicencas />
              </Card>
              <Card className='col-span-4'>
                <LicencasPorAreaPieChart />
              </Card>
              <Card className='col-span-4'>
                <LicencasAExpirarChart />
              </Card>
            </div>
            {/* <div className='grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-12'>
              <Card className='col-span-12'>
                <LicencasCriadasTerminadasChart />
              </Card>
            </div> */}
            <div className='grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-12'>
              <Card className='col-span-4'>
                <LicencasUsageChart />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
