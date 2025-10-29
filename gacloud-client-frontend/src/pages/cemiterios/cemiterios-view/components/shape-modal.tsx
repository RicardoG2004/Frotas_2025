import React from 'react'
import { useTheme } from '@/providers/theme-provider'
import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import {
  SepulturaEstado,
  SepulturaEstadoLabel,
} from '@/types/enums/sepultura-estado.enum'
import {
  SepulturaSituacao,
  SepulturaSituacaoLabel,
} from '@/types/enums/sepultura-situacao.enum'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import InfoIcon from '@mui/icons-material/Info'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import PrintIcon from '@mui/icons-material/Print'
import { useNavigate } from 'react-router-dom'
import { getMenuColorByTheme } from '@/utils/menu-colors'
import { generateInstanceId } from '@/utils/window-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetSepultura } from '../../sepulturas/queries/sepulturas-queries'

interface ShapeData {
  type: string
  [key: string]: string
}

interface Defunto {
  nome: string
  dataFalecimento: string
  foto: string
}

const InfoCard = ({
  title,
  icon: Icon,
  children,
  color = 'primary',
  themeColor,
  className,
}: {
  title: string
  icon: any
  children: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  themeColor?: string
  className?: string
}) => {
  const colorMap = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-destructive text-destructive-foreground',
  }

  // Use theme color if provided, otherwise fall back to color map
  const iconBgColor = themeColor || colorMap[color]

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className='h-5 w-5 text-white' />
          </div>
          <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>{children}</CardContent>
    </Card>
  )
}

const InfoRow = ({
  label,
  value,
  icon: Icon,
  variant = 'default',
  color = 'primary',
}: {
  label: string
  value: string | boolean
  icon?: any
  variant?: 'default' | 'status' | 'date' | 'highlight'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}) => {
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-destructive',
  }

  return (
    <div className='flex items-center justify-between py-2 px-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors'>
      <div className='flex items-center gap-3 flex-1'>
        {Icon && (
          <div
            className={`p-2 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}
          >
            <Icon className={`h-4 w-4 ${colorMap[color]}`} />
          </div>
        )}
        <span className='text-sm font-medium text-muted-foreground'>
          {label}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        {variant === 'status' && typeof value === 'boolean' ? (
          <Badge variant={value ? 'default' : 'secondary'} className='text-xs'>
            {value ? 'Ativo' : 'Inativo'}
          </Badge>
        ) : variant === 'date' ? (
          <span className='text-sm font-mono font-semibold bg-muted px-2 py-1 rounded border'>
            {value}
          </span>
        ) : (
          <span className='text-sm font-semibold text-foreground'>{value}</span>
        )}
      </div>
    </div>
  )
}

const DefuntoCard = ({ defunto }: { defunto: Defunto }) => {
  const [imageError] = React.useState(false)

  return (
    <Card className='hover:shadow-lg transition-shadow cursor-pointer hover:bg-muted/50'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16'>
            {defunto.foto && !imageError ? (
              <AvatarImage src={defunto.foto} alt={defunto.nome} />
            ) : (
              <AvatarFallback>
                <PersonIcon className='h-8 w-8' />
              </AvatarFallback>
            )}
          </Avatar>

          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-semibold text-foreground truncate mb-1'>
              {defunto.nome}
            </h3>
            <div className='flex items-center gap-2'>
              <div className='p-1 rounded-md bg-primary/10'>
                <EventIcon className='h-4 w-4 text-primary' />
              </div>
              <span className='text-sm font-mono font-medium text-muted-foreground'>
                {defunto.dataFalecimento}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ProprietarioCard = ({ proprietario }: { proprietario: any }) => {
  const navigate = useNavigate()
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const handleProprietarioClick = () => {
    if (proprietario.proprietario?.id) {
      const instanceId = generateInstanceId()
      navigate(
        `/cemiterios/configuracoes/proprietarios/update?proprietarioId=${proprietario.proprietario.id}&instanceId=${instanceId}`
      )
    }
  }

  return (
    <Card
      className='hover:shadow-lg transition-shadow cursor-pointer hover:bg-muted/50'
      onClick={handleProprietarioClick}
    >
      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Header with entity info */}
          <div className='flex items-center gap-3'>
            <Avatar className='h-12 w-12'>
              <AvatarFallback>
                <PersonIcon className='h-6 w-6' />
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <h4 className='text-sm font-semibold text-foreground truncate'>
                {proprietario.proprietario?.entidade?.nome || 'N/A'}
              </h4>
              <p className='text-xs text-muted-foreground'>
                {proprietario.proprietario?.entidade?.nif || 'N/A'}
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className='flex flex-wrap gap-1'>
            {proprietario.proprietario && (
              <Badge variant='default' className='text-xs'>
                Proprietário
              </Badge>
            )}
            {proprietario.responsavel && (
              <Badge variant='secondary' className='text-xs'>
                Responsável
              </Badge>
            )}
            {proprietario.responsavelGuiaReceita && (
              <Badge variant='outline' className='text-xs'>
                Guia Receita
              </Badge>
            )}
            {proprietario.ativo ? (
              <Badge variant='default' className='text-xs bg-green-500'>
                Ativo
              </Badge>
            ) : (
              <Badge variant='secondary' className='text-xs'>
                Inativo
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className='space-y-2 text-xs'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Data:</span>
              <span className='font-mono font-medium'>
                {formatDate(proprietario.data)}
              </span>
            </div>
            {proprietario.fracao && (
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Fração:</span>
                <span className='font-medium'>{proprietario.fracao}</span>
              </div>
            )}
            {proprietario.dataInativacao && (
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Inativação:</span>
                <span className='font-mono font-medium text-destructive'>
                  {formatDate(proprietario.dataInativacao)}
                </span>
              </div>
            )}
          </div>

          {/* Observations */}
          {proprietario.observacoes && (
            <div className='pt-2 border-t'>
              <p className='text-xs text-muted-foreground line-clamp-2'>
                {proprietario.observacoes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ShapeModalProps {
  data: ShapeData | null
  onClose: () => void
}

export const ShapeModal = ({ data, onClose }: ShapeModalProps) => {
  const navigate = useNavigate()
  const { iconTheme } = useTheme()
  const relationId = data?.['relation-id'] || ''
  const {
    data: sepulturaData,
    isLoading,
    isFetching,
  } = useGetSepultura(relationId)

  // Get theme-based colors for different sections
  const sepulturaColor = getMenuColorByTheme(
    '/cemiterios/configuracoes/sepulturas',
    iconTheme
  )
  const defuntosColor = getMenuColorByTheme(
    '/cemiterios/configuracoes/defuntos',
    iconTheme
  )
  const proprietariosColor = getMenuColorByTheme(
    '/cemiterios/configuracoes/proprietarios',
    iconTheme
  )

  // Add smooth animation styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes modalSlideIn {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes modalFadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .modal-backdrop {
        animation: modalFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .modal-content {
        animation: modalSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Format date to Brazilian format
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Early returns for invalid states
  if (!data) return null
  if (data['shape-type']?.toLowerCase() !== 'sepultura') return null

  if (!relationId) {
    return (
      <div className='fixed inset-0 bg-background/40 backdrop-blur-md z-[1200] flex items-center justify-center p-4 modal-backdrop'>
        <Card className='w-full max-w-md border-2 border-destructive/20 shadow-2xl modal-content'>
          <CardContent className='p-8 text-center'>
            <div className='w-20 h-20 rounded-full bg-destructive mx-auto mb-6 flex items-center justify-center'>
              <CancelIcon className='h-10 w-10 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-destructive mb-2'>
              Sepultura não encontrada
            </h2>
            <p className='text-muted-foreground mb-6'>
              Esta sepultura não possui dados cadastrados no sistema.
            </p>
            <Button onClick={onClose} className='w-14 h-14 rounded-full'>
              <CloseIcon className='h-6 w-6' />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='fixed inset-0 bg-background/40 backdrop-blur-md z-[1200] flex items-center justify-center p-4 modal-backdrop'>
        <Card className='w-full max-w-md border-2 border-primary/20 shadow-2xl modal-content'>
          <CardContent className='p-8 text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4'></div>
            <h3 className='text-lg font-semibold text-muted-foreground'>
              Carregando dados da sepultura...
            </h3>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sepultura = sepulturaData?.info?.data as SepulturaDTO | undefined

  // Show loading skeleton while data is being fetched
  if (isLoading || isFetching) {
    return (
      <div className='fixed inset-0 bg-background/40 backdrop-blur-md z-[1200] flex items-center justify-center p-4 pt-20 pb-20 modal-backdrop'>
        <Card className='w-full max-w-6xl max-h-[calc(100vh-160px)] overflow-hidden flex flex-col border-2 border-primary/20 shadow-2xl shadow-primary/10 modal-content ring-1 ring-primary/10'>
          {/* Header Skeleton */}
          <CardHeader className='border-b bg-muted/20 flex-shrink-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-10 rounded-lg bg-gradient-to-b from-primary to-primary/80'></div>
                <div className='min-w-0 flex-1'>
                  <div className='h-6 bg-muted animate-pulse rounded w-48 mb-2'></div>
                  <div className='h-4 bg-muted animate-pulse rounded w-32'></div>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='h-10 w-10'
              >
                <CloseIcon className='h-5 w-5' />
              </Button>
            </div>
          </CardHeader>

          {/* Content Skeleton */}
          <div className='overflow-y-auto flex-1 p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Left Column Skeleton */}
              <div className='space-y-6'>
                <div className='h-8 bg-muted animate-pulse rounded w-32'></div>
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className='h-4 bg-muted animate-pulse rounded w-full'
                    ></div>
                  ))}
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className='space-y-6'>
                <div className='h-8 bg-muted animate-pulse rounded w-32'></div>
                <div className='space-y-4'>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className='h-4 bg-muted animate-pulse rounded w-full'
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!sepultura) {
    return (
      <div className='fixed inset-0 bg-background/40 backdrop-blur-md z-[1200] flex items-center justify-center p-4 modal-backdrop'>
        <Card className='w-full max-w-md border-2 border-destructive/20 shadow-2xl modal-content'>
          <CardContent className='p-8 text-center'>
            <h2 className='text-xl font-bold text-destructive'>
              Não foi possível carregar os dados da sepultura
            </h2>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 bg-background/40 backdrop-blur-md z-[1200] flex items-center justify-center p-4 pt-20 pb-20 modal-backdrop'>
      <Card className='w-full max-w-6xl max-h-[calc(100vh-160px)] overflow-hidden flex flex-col border-2 border-primary/20 shadow-2xl shadow-primary/10 modal-content ring-1 ring-primary/10'>
        {/* Header */}
        <CardHeader className='border-b bg-muted/20 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-10 rounded-lg bg-gradient-to-b from-primary to-primary/80'></div>
              <div className='min-w-0 flex-1'>
                <CardTitle className='text-xl font-bold truncate'>
                  {sepultura.nome}
                </CardTitle>
                <CardDescription className='text-sm'>
                  {data['shape-type']} • ID: {sepultura.id}
                </CardDescription>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='h-10 w-10'
            >
              <CloseIcon className='h-5 w-5' />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <div className='overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Left Column */}
            <div className='space-y-6'>
              {/* Status Section */}
              <InfoCard
                title='Status da Sepultura'
                icon={CheckCircleIcon}
                color='success'
                themeColor={sepulturaColor}
              >
                <div className='space-y-2'>
                  <InfoRow
                    label='Estado'
                    value={
                      SepulturaEstadoLabel[
                        sepultura.sepulturaEstadoId as SepulturaEstado
                      ] || 'N/A'
                    }
                    icon={CheckCircleIcon}
                    color='success'
                  />
                  <InfoRow
                    label='Situação'
                    value={
                      SepulturaSituacaoLabel[
                        sepultura.sepulturaSituacaoId as SepulturaSituacao
                      ] || 'N/A'
                    }
                    icon={CheckCircleIcon}
                    color='success'
                  />
                </div>
              </InfoCard>

              {/* Basic Info Section */}
              <InfoCard
                title='Informações Básicas'
                icon={InfoIcon}
                color='primary'
                themeColor={sepulturaColor}
              >
                <div className='space-y-2'>
                  <InfoRow
                    label='Tipo'
                    value={sepultura.sepulturaTipo?.nome || 'N/A'}
                    icon={GroupIcon}
                    color='primary'
                  />
                  <InfoRow
                    label='Talhão'
                    value={sepultura.talhao?.nome || 'N/A'}
                    icon={LocationOnIcon}
                    color='primary'
                  />
                </div>
              </InfoCard>

              {/* Dimensions Section */}
              <InfoCard
                title='Dimensões'
                icon={InfoIcon}
                color='secondary'
                themeColor={sepulturaColor}
              >
                <div className='grid grid-cols-2 gap-2 mb-4'>
                  <InfoRow
                    label='Largura'
                    value={sepultura.largura ? `${sepultura.largura}cm` : 'N/A'}
                    color='secondary'
                  />
                  <InfoRow
                    label='Comprimento'
                    value={
                      sepultura.comprimento
                        ? `${sepultura.comprimento}cm`
                        : 'N/A'
                    }
                    color='secondary'
                  />
                  <InfoRow
                    label='Área'
                    value={sepultura.area ? `${sepultura.area}cm²` : 'N/A'}
                    color='secondary'
                  />
                  <InfoRow
                    label='Profundidade'
                    value={
                      sepultura.profundidade
                        ? `${sepultura.profundidade}cm`
                        : 'N/A'
                    }
                    color='secondary'
                  />
                  <InfoRow
                    label='Fila'
                    value={sepultura.fila || 'N/A'}
                    color='secondary'
                  />
                  <InfoRow
                    label='Coluna'
                    value={sepultura.coluna || 'N/A'}
                    color='secondary'
                  />
                </div>

                <Separator className='my-4' />

                <div className='space-y-3'>
                  <h4 className='text-sm font-semibold text-muted-foreground'>
                    Funduras
                  </h4>
                  <div className='grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg border'>
                    {[
                      { key: 'fundura1', label: 'Fundura 1' },
                      { key: 'fundura2', label: 'Fundura 2' },
                      { key: 'fundura3', label: 'Fundura 3' },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          sepultura[key as keyof SepulturaDTO] === true
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-card border-border hover:bg-muted'
                        }`}
                      >
                        <span className='text-xs font-semibold uppercase tracking-wide'>
                          {label}
                        </span>
                        <div className='w-8 h-8 rounded-full border-2 flex items-center justify-center'>
                          {sepultura[key as keyof SepulturaDTO] === true ? (
                            <CheckCircleIcon className='h-4 w-4 text-white' />
                          ) : (
                            <CancelIcon className='h-4 w-4 text-muted-foreground' />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Dates Section */}
              <InfoCard
                title='Datas Importantes'
                icon={EventIcon}
                color='warning'
                themeColor={sepulturaColor}
              >
                <div className='space-y-2'>
                  <InfoRow
                    label='Data Concessão'
                    value={formatDate(sepultura.dataConcessao)}
                    variant='date'
                    color='warning'
                  />
                  <InfoRow
                    label='Início Aluguer'
                    value={formatDate(sepultura.dataInicioAluguer)}
                    variant='date'
                    color='warning'
                  />
                  <InfoRow
                    label='Fim Aluguer'
                    value={formatDate(sepultura.dataFimAluguer)}
                    variant='date'
                    color='warning'
                  />
                  <InfoRow
                    label='Início Reserva'
                    value={formatDate(sepultura.dataInicioReserva)}
                    variant='date'
                    color='warning'
                  />
                  <InfoRow
                    label='Fim Reserva'
                    value={formatDate(sepultura.dataFimReserva)}
                    variant='date'
                    color='warning'
                  />
                </div>
              </InfoCard>

              {/* Defuntos Section */}
              <InfoCard
                title='Defuntos'
                icon={PersonIcon}
                color='primary'
                themeColor={defuntosColor}
              >
                <div className='space-y-3'>
                  {[
                    {
                      nome: 'John Smith',
                      dataFalecimento: '15/03/2023',
                      foto: '',
                    },
                    {
                      nome: 'Mary Johnson',
                      dataFalecimento: '22/06/2022',
                      foto: '',
                    },
                  ].map((defunto, index) => (
                    <DefuntoCard key={index} defunto={defunto} />
                  ))}
                </div>
              </InfoCard>

              {/* Proprietários Section */}
              <InfoCard
                title='Proprietários'
                icon={GroupIcon}
                color='secondary'
                themeColor={proprietariosColor}
              >
                <div className='space-y-3'>
                  {sepultura.proprietarios &&
                  sepultura.proprietarios.length > 0 ? (
                    sepultura.proprietarios.map((proprietario, index) => (
                      <ProprietarioCard
                        key={index}
                        proprietario={proprietario}
                      />
                    ))
                  ) : (
                    <div className='text-center py-6'>
                      <div className='w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center'>
                        <GroupIcon className='h-6 w-6 text-muted-foreground' />
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Nenhum proprietário cadastrado
                      </p>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>
          </div>

          {/* Observations Section - Full width at bottom */}
          {sepultura.observacao && (
            <InfoCard
              title='Observações'
              icon={InfoIcon}
              color='primary'
              themeColor={sepulturaColor}
              className='mt-6'
            >
              <div className='p-4 bg-muted rounded-lg border min-h-[80px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent'>
                <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
                  {sepultura.observacao}
                </p>
              </div>
            </InfoCard>
          )}
        </div>

        {/* Action Buttons */}
        <div className='border-t bg-muted/20 p-4 flex gap-2 justify-center flex-shrink-0'>
          <Button
            variant='default'
            onClick={() => {
              if (sepultura?.id) {
                const instanceId = generateInstanceId()
                navigate(
                  `/cemiterios/configuracoes/sepulturas/update?sepulturaId=${sepultura.id}&instanceId=${instanceId}`
                )
              }
            }}
            className='h-11 w-11 rounded-lg'
          >
            <EditIcon className='h-5 w-5' />
          </Button>

          <Button
            variant='secondary'
            onClick={() => {
              // TODO: Implement print functionality
            }}
            className='h-11 w-11 rounded-lg'
          >
            <PrintIcon className='h-5 w-5' />
          </Button>

          <Button
            variant='destructive'
            onClick={() => {
              // TODO: Implement delete functionality
            }}
            className='h-11 w-11 rounded-lg'
          >
            <DeleteIcon className='h-5 w-5' />
          </Button>
        </div>
      </Card>
    </div>
  )
}
