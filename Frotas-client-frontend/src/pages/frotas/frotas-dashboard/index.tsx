import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useIconThemeColor } from '@/hooks/use-icon-theme'
import { Icons } from '@/components/ui/icons'
import { GreetingCard } from '@/components/shared/greeting-card'
import { PageHead } from '@/components/shared/page-head.jsx'
import { RecentPagesGrid } from '@/components/shared/recent-pages-grid'

export function FrotasDashboardPage() {
  const { name, selectedCemiterio, selectedEpoca } = useAuthStore()
  const navigate = useNavigate()

  const quickActions = [
    {
      title: 'Coveiros',
      description: 'Gestão de coveiros de cemitérios',
      icon: Icons.user,
      path: '/frotas/configuracoes/coveiros',
      color: useIconThemeColor('/frotas/configuracoes/coveiros'),
      openInNewWindow: true,
    },
    {
      title: 'Peças',
      description: 'Gestão de peças',
      icon: Icons.container,
      path: '/frotas/configuracoes/pecas',
      color: useIconThemeColor('/frotas/configuracoes/pecas'),
      openInNewWindow: true,
    },
    {
      title: 'Serviços',
      description: 'Gestão de serviços',
      icon: Icons.settings,
      path: '/frotas/configuracoes/servicos',
      color: useIconThemeColor('/frotas/configuracoes/servicos'),
      openInNewWindow: true,
    },
    {
      title: 'Marcas',
      description: 'Gestão de marcas de carros',
      icon: Icons.shield,
      path: '/frotas/configuracoes/marcas',
      color: useIconThemeColor('/frotas/configuracoes/marcas'),
      openInNewWindow: true,
    },
    {
      title: 'Modelos',
      description: 'Gestão de modelos de veículos',
      icon: Icons.layers,
      path: '/frotas/configuracoes/modelos',
      color: useIconThemeColor('/frotas/configuracoes/modelos'),
      openInNewWindow: true,
    },
    {
      title: 'Categorias',
      description: 'Gestão de categorias de veículos',
      icon: Icons.truck,
      path: '/frotas/configuracoes/categorias',
      color: useIconThemeColor('/frotas/configuracoes/categorias'),
      openInNewWindow: true,
    },
    {
      title: 'Fornecedores',
      description: 'Gestão de fornecedores',
      icon: Icons.IconBuilding,
      path: '/frotas/configuracoes/fornecedores',
      color: useIconThemeColor('/frotas/configuracoes/fornecedores'),
      openInNewWindow: true,
    },
    {
      title: 'Equipamentos',
      description: 'Gestão de equipamentos',
      icon: Icons.wrench,
      path: '/frotas/configuracoes/equipamentos',
      color: useIconThemeColor('/frotas/configuracoes/equipamentos'),
      openInNewWindow: true,
    },
  ]

  return (
    <>
      <PageHead title='Dashboard Frotas | Frotas' />
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-32'>
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

        {/* Quick Actions */}
        <div className='w-full relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-2xl shadow-primary/5 p-6'>
          <div className='mb-4'>
            <div className='flex items-center gap-4 mb-3'>
              <div className='p-3 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-sm'>
                <Icons.car className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                  Acesso Rápido
                </h2>
                <p className='text-muted-foreground/80 text-sm mt-1'>
                  Aceda rapidamente às principais funcionalidades de frotas
                </p>
              </div>
            </div>
          </div>

          <div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
                      className={`relative p-2.5 ${action.color} shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-110 transition-all duration-300`}
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      <div
                        className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                        style={{ borderRadius: 'var(--radius)' }}
                      ></div>
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
                      <div
                        className='p-1.5 bg-primary/10 group-hover:bg-primary/20 border border-primary/20 group-hover:border-primary/30 transition-all duration-300'
                        style={{ borderRadius: 'var(--radius)' }}
                      >
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
      </div>
    </>
  )
}

