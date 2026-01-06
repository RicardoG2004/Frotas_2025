import { useGetLicencaApiKey } from '@/pages/platform/licencas/queries/licencas-queries'
import { useAuthStore } from '@/stores/auth-store'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import PageHead from '@/components/shared/page-head'
import { LicencaApiKeyCard } from './components/licenca-api-key-card'
import { LicencaExpirationProgress } from './components/licenca-expiration-progress'
import { LicencaUtilizadoresList } from './components/licenca-utilizadores-list'

export default function LicencasAdminPage() {
  const { licencaId } = useAuthStore()
  const { data, isLoading } = useGetLicencaApiKey(licencaId!)

  console.log(data)

  console.log('LicencasAdminPage - licencaId:', licencaId)

  return (
    <div className='px-4 pb-4 md:px-8 md:pb-8'>
      <PageHead title='Licenças Admin' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Licenças', link: '/administracao/licencas/admin' },
        ]}
      />
      <div className='mt-10 grid grid-cols-1 md:grid-cols-12 gap-6'>
        <div className='col-span-1 md:col-span-6'>
          <Card className='h-[400px] md:h-[calc(100vh-300px)] overflow-hidden flex flex-col'>
            <div className='p-4 border-b flex flex-col justify-center'>
              <h3 className='text-sm font-medium'>Utilizadores da Licença</h3>
              <p className='text-xs text-muted-foreground'>
                Lista de utilizadores que podem ser ativados nesta licença
              </p>
            </div>
            <ScrollArea className='flex-1'>
              <div className='p-4'>
                {licencaId && <LicencaUtilizadoresList licencaId={licencaId} />}
              </div>
            </ScrollArea>
          </Card>
        </div>
        <div className='col-span-1 md:col-span-6'>
          <div className='flex flex-col gap-6'>
            {licencaId && <LicencaExpirationProgress licencaId={licencaId} />}
            {isLoading ? (
              <div>Loading API key...</div>
            ) : data?.apiKey ? (
              <LicencaApiKeyCard apiKey={data.apiKey} />
            ) : null}
            {/* <Card>
              <PerfisComMaisUtilizadoresChart />
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
