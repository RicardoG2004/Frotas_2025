import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageHead from '@/components/shared/page-head'
import { useGetVersion } from './queries/version-queries'

interface AppVersionData {
  appVersion: string
}

export default function VersionPage() {
  const { data: apiVersionData, isLoading, error } = useGetVersion()
  const [appVersion, setAppVersion] = useState<string>('unknown')

  useEffect(() => {
    // Fetch app version from version.json
    const fetchAppVersion = async () => {
      try {
        const response = await fetch('/version.json')
        const data: AppVersionData = await response.json()
        setAppVersion(data.appVersion)
      } catch (err) {
        setAppVersion('unknown')
      }
    }

    fetchAppVersion()
  }, [])

  const apiVersion = apiVersionData?.apiVersion || 'unknown'

  return (
    <>
      <PageHead title='Versões | GSLP' />
      <div className='flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Versões do Sistema
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-500' />
                Versão da Aplicação
              </CardTitle>
              <CardDescription>
                Versão atual do frontend/cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appVersion === 'unknown' ? (
                <Skeleton className='h-8 w-32' />
              ) : (
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold'>{appVersion}</span>
                  <span className='text-sm text-muted-foreground'>
                    (Frontend)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-blue-500' />
                Versão da API
              </CardTitle>
              <CardDescription>Versão atual do backend/API</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='h-8 w-32' />
              ) : error ? (
                <div className='flex items-center gap-2 text-destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <span className='text-sm'>Erro ao carregar versão</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold'>{apiVersion}</span>
                  <span className='text-sm text-muted-foreground'>
                    (Backend)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error &&
          (() => {
            // Extract API error messages
            const apiMessages =
              error &&
              typeof error === 'object' &&
              'data' in error &&
              typeof error.data === 'object' &&
              error.data !== null &&
              'data' in error.data &&
              typeof error.data.data === 'object' &&
              error.data.data !== null &&
              'messages' in error.data.data &&
              Array.isArray(error.data.data.messages)
                ? error.data.data.messages
                : null

            const statusCode =
              error && typeof error === 'object' && 'statusCode' in error
                ? (error as { statusCode?: number }).statusCode
                : null

            return (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Erro ao obter versão da API</AlertTitle>
                <AlertDescription className='space-y-2'>
                  {apiMessages && apiMessages.length > 0 ? (
                    <div className='space-y-1'>
                      <p className='font-semibold'>Mensagem da API:</p>
                      <ul className='list-disc list-inside space-y-1'>
                        {apiMessages.map((msg: string, idx: number) => (
                          <li key={idx} className='text-sm'>
                            {msg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      Não foi possível obter a versão da API. Verifique a sua
                      ligação e tente novamente.
                    </div>
                  )}
                  {statusCode && (
                    <div className='text-xs text-muted-foreground'>
                      Código de estado: {statusCode}
                    </div>
                  )}
                  <details className='mt-2 text-xs'>
                    <summary className='cursor-pointer font-semibold'>
                      Detalhes técnicos (clique para expandir)
                    </summary>
                    <pre className='mt-2 overflow-auto rounded bg-destructive/10 p-2 text-left'>
                      {JSON.stringify(
                        {
                          message:
                            error instanceof Error
                              ? error.message
                              : String(error),
                          name: error instanceof Error ? error.name : undefined,
                          statusCode,
                          ...(error &&
                            typeof error === 'object' &&
                            'data' in error && {
                              data: (error as { data?: unknown }).data,
                            }),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </details>
                </AlertDescription>
              </Alert>
            )
          })()}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>
              Detalhes sobre as versões do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Versão do Frontend:
              </span>
              <span className='text-sm font-medium'>{appVersion}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Versão da API:
              </span>
              <span className='text-sm font-medium'>
                {isLoading ? 'Carregando...' : apiVersion}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
