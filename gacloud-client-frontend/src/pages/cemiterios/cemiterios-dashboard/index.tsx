import { useGetCemiteriosCount } from '@/pages/cemiterios/cemiterios/queries/cemiterios-queries'
import { useGetCemiterioSvg } from '@/pages/cemiterios/cemiterios/queries/cemiterios-queries'
import { useGetSepulturasCount } from '@/pages/cemiterios/sepulturas/queries/sepulturas-queries'
import { useGetTalhoesCount } from '@/pages/cemiterios/talhoes/queries/talhoes-queries'
import { useGetZonasCount } from '@/pages/cemiterios/zonas/queries/zonas-queries'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useIconThemeColor } from '@/hooks/use-icon-theme'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { GreetingCard } from '@/components/shared/greeting-card'
import { PageHead } from '@/components/shared/page-head.jsx'
import { RecentPagesGrid } from '@/components/shared/recent-pages-grid'

export function CemiteriosDashboardPage() {
  const { name, selectedCemiterio, selectedEpoca } = useAuthStore()
  const navigate = useNavigate()

  // Real data queries
  const { data: cemiteriosCount, isLoading: isLoadingCemiterios } =
    useGetCemiteriosCount()
  const { data: sepulturasCount, isLoading: isLoadingSepulturas } =
    useGetSepulturasCount()
  const { data: zonasCount, isLoading: isLoadingZonas } = useGetZonasCount()
  const { data: talhoesCount, isLoading: isLoadingTalhoes } =
    useGetTalhoesCount()

  // Cemetery SVG query
  const { data: cemiterioSvgData, isLoading: isLoadingSvg } =
    useGetCemiterioSvg(selectedCemiterio?.id || '')

  const quickStats = [
    {
      title: 'Cemitérios Ativos',
      value: isLoadingCemiterios ? '...' : cemiteriosCount?.toString() || '0',
      description: 'Total de cemitérios',
      icon: Icons.IconGrave,
      color: useIconThemeColor('/cemiterios/configuracoes/cemiterios'),
    },
    {
      title: 'Sepulturas',
      value: isLoadingSepulturas ? '...' : sepulturasCount?.toString() || '0',
      description: 'Sepulturas registadas',
      icon: Icons.IconGrave,
      color: useIconThemeColor('/cemiterios/configuracoes/sepulturas'),
    },
    {
      title: 'Zonas',
      value: isLoadingZonas ? '...' : zonasCount?.toString() || '0',
      description: 'Zonas disponíveis',
      icon: Icons.tablerMap,
      color: useIconThemeColor('/cemiterios/configuracoes/zonas'),
    },
    {
      title: 'Talhões',
      value: isLoadingTalhoes ? '...' : talhoesCount?.toString() || '0',
      description: 'Talhões ativos',
      icon: Icons.tablerFolder,
      color: useIconThemeColor('/cemiterios/configuracoes/talhoes'),
    },
  ]

  const quickActions = [
    {
      title: 'Cemitérios',
      description: 'Gerir cemitérios e suas informações',
      icon: Icons.IconGrave,
      path: '/cemiterios/configuracoes/cemiterios',
      color: useIconThemeColor('/cemiterios/configuracoes/cemiterios'),
      openInNewWindow: true,
    },
    {
      title: 'Zonas',
      description: 'Gerir zonas do cemitério',
      icon: Icons.tablerMap,
      path: '/cemiterios/configuracoes/zonas',
      color: useIconThemeColor('/cemiterios/configuracoes/zonas'),
      openInNewWindow: true,
    },
    {
      title: 'Talhões',
      description: 'Gerir talhões do cemitério',
      icon: Icons.tablerFolder,
      path: '/cemiterios/configuracoes/talhoes',
      color: useIconThemeColor('/cemiterios/configuracoes/talhoes'),
      openInNewWindow: true,
    },
    {
      title: 'Sepulturas',
      description: 'Registar e gerir sepulturas',
      icon: Icons.IconGrave,
      path: '/cemiterios/configuracoes/sepulturas',
      color: useIconThemeColor('/cemiterios/configuracoes/sepulturas'),
      openInNewWindow: true,
    },
    {
      title: 'Proprietários',
      description: 'Gerir proprietários de sepulturas',
      icon: Icons.user,
      path: '/cemiterios/configuracoes/proprietarios',
      color: useIconThemeColor('/cemiterios/configuracoes/proprietarios'),
      openInNewWindow: true,
    },
    {
      title: 'Defuntos',
      description: 'Gerir defuntos',
      icon: Icons.IconGrave,
      path: '/cemiterios/configuracoes/defuntos',
      color: useIconThemeColor('/cemiterios/configuracoes/defuntos'),
      openInNewWindow: true,
    },
    {
      title: 'Coveiros',
      description: 'Gerir coveiros do cemitério',
      icon: Icons.user,
      path: '/cemiterios/configuracoes/coveiros',
      color: useIconThemeColor('/cemiterios/configuracoes/coveiros'),
      openInNewWindow: true,
    },
    {
      title: 'Agências Funerárias',
      description: 'Gerir agências funerárias',
      icon: Icons.IconBuilding,
      path: '/cemiterios/configuracoes/agencias-funerarias',
      color: useIconThemeColor('/cemiterios/configuracoes/agencias-funerarias'),
      openInNewWindow: true,
    },
  ]

  // Get SVG content
  const svgContent = cemiterioSvgData?.info?.data || ''
  const hasSvg = svgContent && !isLoadingSvg

  // Process SVG content to ensure proper scaling
  const processSvgContent = (svgString: string) => {
    if (!svgString) return ''

    try {
      // Create a temporary div to parse the SVG
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = svgString
      const svgElement = tempDiv.querySelector('svg')

      if (svgElement) {
        // Add or update viewBox and preserveAspectRatio for proper scaling
        if (!svgElement.getAttribute('viewBox')) {
          const width = svgElement.getAttribute('width') || '100'
          const height = svgElement.getAttribute('height') || '100'
          svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
        }

        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        svgElement.setAttribute('width', '100%')
        svgElement.setAttribute('height', '100%')
        svgElement.style.maxWidth = '100%'
        svgElement.style.maxHeight = '100%'

        return tempDiv.innerHTML
      }

      return svgString
    } catch (error) {
      console.error('Error processing SVG:', error)
      return svgString
    }
  }

  const processedSvgContent = processSvgContent(svgContent)

  return (
    <>
      <PageHead title='Dashboard Cemitérios | Luma' />
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <GreetingCard
            userName={name}
            selectedCemiterio={selectedCemiterio}
            selectedEpoca={selectedEpoca}
            showStatus={true}
          />
        </div>

        {/* Recent Pages Grid */}
        <div className='mb-8'>
          <RecentPagesGrid maxPages={5} title='Recentes' />
        </div>

        {/* Quick Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/60 hover:scale-[1.02] hover:bg-card/80 cursor-pointer'
              onClick={() => {
                const routes = [
                  '/cemiterios/configuracoes/cemiterios',
                  '/cemiterios/configuracoes/sepulturas',
                  '/cemiterios/configuracoes/zonas',
                  '/cemiterios/configuracoes/talhoes',
                ]
                const route = routes[index]
                const instanceId = crypto.randomUUID()
                navigate(`${route}?instanceId=${instanceId}`)
              }}
            >
              {/* Modern glassmorphism background */}
              <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300' />

              {/* Floating particles effect */}
              <div className='absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-50'></div>

              <div className='relative p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-bold text-sm text-foreground group-hover:text-primary transition-all duration-300'>
                    {stat.title}
                  </h3>
                  <div
                    className={`p-2 rounded-md ${stat.color} shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-110 transition-all duration-300`}
                  >
                    <stat.icon className='h-4 w-4 text-white' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-foreground group-hover:text-primary transition-all duration-300 mb-1'>
                  {stat.value}
                </div>
                <p className='text-xs text-muted-foreground group-hover:text-muted-foreground/90 transition-all duration-300'>
                  {stat.description}
                </p>
              </div>

              {/* Modern gradient border */}
              <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'></div>

              {/* Subtle shine effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100'></div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Quick Actions */}
          <div className='w-full relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-2xl shadow-primary/5 p-6'>
            <div className='mb-4'>
              <div className='flex items-center gap-4 mb-3'>
                <div className='p-3 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-sm'>
                  <Icons.dashboard className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h2 className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                    Acesso Rápido
                  </h2>
                  <p className='text-muted-foreground/80 text-sm mt-1'>
                    Aceda rapidamente às principais funcionalidades de gestão de
                    cemitérios
                  </p>
                </div>
              </div>
            </div>

            <div className='grid gap-3 grid-cols-1 md:grid-cols-2'>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className='group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/60 hover:scale-[1.02] hover:bg-card/80 cursor-pointer'
                  onClick={() => {
                    if (action.openInNewWindow) {
                      const instanceId = crypto.randomUUID()
                      navigate(`${action.path}?instanceId=${instanceId}`)
                    } else {
                      navigate(action.path)
                    }
                  }}
                >
                  {/* Modern glassmorphism background */}
                  <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300' />

                  {/* Floating particles effect */}
                  <div className='absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-50'></div>
                  <div className='absolute bottom-3 left-3 w-1.5 h-1.5 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100'></div>

                  <div className='relative p-4'>
                    <div className='flex items-center gap-3'>
                      {/* Modern icon container with glow */}
                      <div
                        className={`relative p-2.5 rounded-md ${action.color} shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-110 transition-all duration-300`}
                      >
                        <div className='absolute inset-0 rounded-md bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        <action.icon className='h-4 w-4 text-white relative z-10' />
                      </div>

                      {/* Content with modern typography */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-bold text-sm text-foreground group-hover:text-primary transition-all duration-300 mb-0.5'>
                          {action.title}
                        </h3>
                        <p className='text-xs text-muted-foreground group-hover:text-muted-foreground/90 transition-all duration-300 line-clamp-1'>
                          {action.description}
                        </p>
                      </div>

                      {/* Modern arrow with container */}
                      <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                        <div className='p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 border border-primary/20 group-hover:border-primary/30 transition-all duration-300'>
                          <Icons.arrowRight className='h-3 w-3 text-primary' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern gradient border */}
                  <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'></div>

                  {/* Subtle shine effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Cemetery SVG Viewer */}
          <div className='relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-2xl shadow-primary/5'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5'></div>
            <div className='relative p-6'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='p-3 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-sm'>
                  <Icons.tablerMap className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h2 className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                    Mapa do Cemitério
                  </h2>
                  <p className='text-muted-foreground/80 text-sm mt-1'>
                    {selectedCemiterio
                      ? `Visualização do mapa de ${selectedCemiterio.nome}`
                      : 'Selecione um cemitério para visualizar o mapa'}
                  </p>
                </div>
              </div>
              <div className='space-y-4'>
                {!selectedCemiterio ? (
                  <div className='flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25'>
                    <div className='text-center'>
                      <Icons.tablerMap className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
                      <p className='text-sm text-muted-foreground'>
                        Nenhum cemitério selecionado
                      </p>
                    </div>
                  </div>
                ) : isLoadingSvg ? (
                  <div className='flex items-center justify-center h-64 bg-muted/20 rounded-lg'>
                    <div className='text-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
                      <p className='text-sm text-muted-foreground'>
                        A carregar mapa...
                      </p>
                    </div>
                  </div>
                ) : hasSvg ? (
                  <div className='relative h-64 bg-muted/20 rounded-lg overflow-hidden border'>
                    <div
                      className='w-full h-full flex items-center justify-center'
                      dangerouslySetInnerHTML={{ __html: processedSvgContent }}
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25'>
                    <div className='text-center'>
                      <Icons.tablerMap className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
                      <p className='text-sm text-muted-foreground'>
                        Este cemitério não possui mapa disponível
                      </p>
                    </div>
                  </div>
                )}

                {selectedCemiterio && (
                  <div className='flex justify-between items-center'>
                    <div className='text-sm text-muted-foreground'>
                      {selectedCemiterio.nome}
                    </div>
                    {hasSvg && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const instanceId = crypto.randomUUID()
                          navigate(
                            `/cemiterios/configuracoes/mapa/view?cemiterioId=${selectedCemiterio.id}&instanceId=${instanceId}`
                          )
                        }}
                      >
                        <Icons.link className='h-4 w-4 mr-2' />
                        Ver Mapa Completo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
