import { useState } from 'react'
import { format } from 'date-fns'
import { useGetClientesByAplicacao } from '@/pages/platform/licencas/queries/licencas-queries'
import { AppUpdateDTO, UpdateType } from '@/types/dtos'
import { pt } from 'date-fns/locale'
import {
  Check,
  X,
  Download,
  AlertCircle,
  Calendar,
  Hash,
  File,
  Loader2,
  Server,
  Monitor,
  Package,
  Users,
  Info,
  Tag,
} from 'lucide-react'
import AppUpdatesService from '@/lib/services/application/app-updates-service'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AppUpdateDetailsViewProps {
  update: AppUpdateDTO
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default function AppUpdateDetailsView({
  update,
}: AppUpdateDetailsViewProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloadingApi, setIsDownloadingApi] = useState(false)
  const [isDownloadingFrontend, setIsDownloadingFrontend] = useState(false)

  // Get clientes if clienteIds exist
  const { data: clientes = [] } = useGetClientesByAplicacao(update.aplicacaoId)
  const selectedClientes = update.clienteIds
    ? clientes.filter((cliente) =>
        update.clienteIds?.some(
          (id) => String(id).toLowerCase() === String(cliente.id).toLowerCase()
        )
      )
    : []

  const handleDownload = async (packageType?: UpdateType) => {
    const fileName =
      packageType === UpdateType.API
        ? update.ficheiroUpdateApi
        : packageType === UpdateType.Frontend
          ? update.ficheiroUpdateFrontend
          : update.ficheiroUpdate

    if (!update.id || !fileName) {
      toast.error('Informações de ficheiro inválidas')
      return
    }

    const setLoading =
      packageType === UpdateType.API
        ? setIsDownloadingApi
        : packageType === UpdateType.Frontend
          ? setIsDownloadingFrontend
          : setIsDownloading

    try {
      setLoading(true)
      const blob = await AppUpdatesService('app-updates').downloadUpdatePackage(
        update.id,
        undefined,
        packageType
      )

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || `update-${update.versao}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Ficheiro descarregado com sucesso')
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao descarregar ficheiro'))
    } finally {
      setLoading(false)
    }
  }

  const isBothType = update.tipoUpdate === UpdateType.Both

  // Render file section for a specific package type
  const renderFileSection = (
    type: 'api' | 'frontend' | 'single',
    fileName: string | null,
    fileSize: number,
    fileHash: string | null,
    isLoading: boolean,
    packageType?: UpdateType
  ) => {
    if (!fileName) return null

    const Icon = type === 'api' ? Server : type === 'frontend' ? Monitor : File
    const label =
      type === 'api'
        ? 'Ficheiro API'
        : type === 'frontend'
          ? 'Ficheiro Frontend'
          : 'Ficheiro de Atualização'

    return (
      <div className='space-y-2'>
        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
          <Icon className='h-4 w-4' />
          <span>{label}</span>
        </div>
        <div className='flex items-center gap-2 rounded-lg border p-3'>
          <File className='h-5 w-5 text-primary' />
          <div className='flex-1'>
            <p className='text-sm font-medium'>{fileName}</p>
            {fileSize > 0 && (
              <p className='text-xs text-muted-foreground'>
                {formatFileSize(fileSize)}
              </p>
            )}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleDownload(packageType)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />A
                descarregar...
              </>
            ) : (
              <>
                <Download className='mr-2 h-4 w-4' />
                Descarregar
              </>
            )}
          </Button>
        </div>
        {fileHash && (
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Hash className='h-3 w-3' />
            <span className='font-mono'>{fileHash}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header Card with Version and Status */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-primary/10 p-2'>
                <Package className='h-5 w-5 text-primary' />
              </div>
              <div>
                <CardTitle className='text-2xl'>{update.versao}</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {update.aplicacao?.nome || 'Aplicação'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {update.ativo ? (
                <Badge variant='default' className='bg-green-500'>
                  <Check className='mr-1 h-3 w-3' />
                  Ativo
                </Badge>
              ) : (
                <Badge variant='secondary'>
                  <X className='mr-1 h-3 w-3' />
                  Inativo
                </Badge>
              )}
              {update.obrigatorio && (
                <Badge variant='destructive'>
                  <AlertCircle className='mr-1 h-3 w-3' />
                  Obrigatório
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for organized content */}
      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-6'>
          <TabsTrigger
            value='general'
            className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
          >
            <Tag className='mr-2 h-4 w-4' />
            Geral
          </TabsTrigger>
          <TabsTrigger
            value='description'
            className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
          >
            <Info className='mr-2 h-4 w-4' />
            Descrição
          </TabsTrigger>
          <TabsTrigger
            value='files'
            className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
          >
            <Download className='mr-2 h-4 w-4' />
            Ficheiros
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value='general' className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Tag className='h-4 w-4' />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Tipo de Atualização
                  </label>
                  <div className='mt-1'>
                    <Badge variant='outline' className='text-sm'>
                      {update.tipoUpdate === UpdateType.API
                        ? 'API'
                        : update.tipoUpdate === UpdateType.Frontend
                          ? 'Frontend'
                          : 'Ambos (API + Frontend)'}
                    </Badge>
                  </div>
                </div>

                {update.versaoMinima && (
                  <div>
                    <label className='text-xs font-medium text-muted-foreground'>
                      Versão Mínima
                    </label>
                    <p className='mt-1 text-sm font-medium'>
                      {update.versaoMinima}
                    </p>
                  </div>
                )}

                <div>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Data de Lançamento
                  </label>
                  <div className='mt-1 flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm'>
                      {format(
                        new Date(update.dataLancamento),
                        'dd/MM/yyyy HH:mm',
                        {
                          locale: pt,
                        }
                      )}
                    </p>
                  </div>
                </div>

                {update.createdOn && (
                  <div>
                    <label className='text-xs font-medium text-muted-foreground'>
                      Criado em
                    </label>
                    <div className='mt-1 flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <p className='text-sm'>
                        {format(
                          new Date(update.createdOn),
                          'dd/MM/yyyy HH:mm',
                          {
                            locale: pt,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clients Card */}
            {selectedClientes.length > 0 ? (
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Clientes Selecionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p className='text-xs text-muted-foreground'>
                      {selectedClientes.length}{' '}
                      {selectedClientes.length === 1
                        ? 'cliente selecionado'
                        : 'clientes selecionados'}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedClientes.map((cliente) => (
                        <Badge
                          key={cliente.id}
                          variant='secondary'
                          className='text-xs'
                        >
                          {cliente.nome}
                          {cliente.sigla && (
                            <span className='ml-1 text-muted-foreground'>
                              ({cliente.sigla})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Esta atualização será lançada para todos os clientes com
                    licença para esta aplicação.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Description Tab */}
        <TabsContent value='description' className='space-y-4'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Info className='h-4 w-4' />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm leading-relaxed'>{update.descricao}</p>
            </CardContent>
          </Card>

          {update.notasAtualizacao && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <File className='h-4 w-4' />
                  Notas de Atualização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-lg bg-muted p-4'>
                  <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                    {update.notasAtualizacao}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value='files' className='space-y-4'>
          {(
            isBothType
              ? update.ficheiroUpdateApi || update.ficheiroUpdateFrontend
              : update.ficheiroUpdate
          ) ? (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Download className='h-4 w-4' />
                  Ficheiros de Atualização
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isBothType ? (
                  // Show both API and Frontend files
                  <>
                    {renderFileSection(
                      'api',
                      update.ficheiroUpdateApi,
                      update.tamanhoFicheiroApi,
                      update.hashFicheiroApi,
                      isDownloadingApi,
                      UpdateType.API
                    )}
                    {renderFileSection(
                      'frontend',
                      update.ficheiroUpdateFrontend,
                      update.tamanhoFicheiroFrontend,
                      update.hashFicheiroFrontend,
                      isDownloadingFrontend,
                      UpdateType.Frontend
                    )}
                    {!update.ficheiroUpdateApi &&
                      !update.ficheiroUpdateFrontend && (
                        <p className='text-sm text-muted-foreground'>
                          Nenhum ficheiro carregado
                        </p>
                      )}
                  </>
                ) : (
                  // Show single file (legacy or single type)
                  renderFileSection(
                    'single',
                    update.ficheiroUpdate,
                    update.tamanhoFicheiro,
                    update.hashFicheiro,
                    isDownloading
                  )
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Download className='h-4 w-4' />
                  Ficheiros de Atualização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Nenhum ficheiro carregado para esta atualização.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
