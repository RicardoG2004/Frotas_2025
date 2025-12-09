import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { Icons } from '@/components/ui/icons'
import { GreetingCard } from '@/components/shared/greeting-card'
import { PageHead } from '@/components/shared/page-head.jsx'
import { RecentPagesGrid } from '@/components/shared/recent-pages-grid'
import { getWindowMetadata } from '@/utils/window-utils'
import { useTheme } from '@/providers/theme-provider'
import { getMenuColorByTheme } from '@/utils/menu-colors'
import { createIconGradient } from '@/lib/icon-gradient'
import { cn } from '@/lib/utils'

export function UtilitariosDashboardPage() {
  const { name, selectedCemiterio } = useAuthStore()
  const navigate = useNavigate()
  const { iconTheme } = useTheme()

  const quickActionPaths = [
    '/utilitarios/tabelas/geograficas/paises',
    '/utilitarios/tabelas/geograficas/distritos',
    '/utilitarios/tabelas/geograficas/concelhos',
    '/utilitarios/tabelas/geograficas/freguesias',
    '/utilitarios/tabelas/geograficas/codigospostais',
    '/utilitarios/tabelas/geograficas/ruas',
    '/utilitarios/tabelas/geograficas/localizacoes',
    '/utilitarios/tabelas/configuracoes/taxas-iva',
    '/utilitarios/tabelas/configuracoes/setores',
    '/utilitarios/tabelas/configuracoes/terceiros',
    '/utilitarios/tabelas/configuracoes/conservatorias',
    '/utilitarios/tabelas/configuracoes/delegacoes',
    '/utilitarios/tabelas/configuracoes/garantias',
    '/utilitarios/tabelas/configuracoes/entidades',
    '/utilitarios/tabelas/configuracoes/fornecedores',
    '/utilitarios/tabelas/configuracoes/fses',
    '/utilitarios/tabelas/configuracoes/cargos',
    '/utilitarios/tabelas/configuracoes/funcionarios',
  ] as const

  const quickActions = quickActionPaths.map((path, index) => {
    const config = getWindowMetadata(path)
    const isColorful = iconTheme === 'colorful'
    const baseStyle: CSSProperties = { borderRadius: 'var(--radius)' }
    return {
      title: config.title,
      description: `Gestão de ${config.title.toLowerCase()}`,
      icon: config.icon ? Icons[config.icon] : Icons.fileText,
      path,
      openInNewWindow: true,
      backgroundStyle: isColorful
        ? {
            ...baseStyle,
            backgroundImage: createIconGradient(
              index,
              quickActionPaths.length
            ),
          }
        : baseStyle,
      backgroundClass: isColorful
        ? ''
        : getMenuColorByTheme(path, iconTheme),
    }
  })

  return (
    <>
      <PageHead title='Dashboard Utilitários | Frotas' />
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-32'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <GreetingCard
            userName={name}
            selectedCemiterio={selectedCemiterio}
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
                <Icons.tablerSettings className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                  Acesso Rápido
                </h2>
                <p className='text-muted-foreground/80 text-sm mt-1'>
                  Aceda rapidamente às principais funcionalidades dos
                  utilitários
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
                      className={cn(
                        'relative p-2.5 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-110 transition-all duration-300 text-white',
                        action.backgroundClass
                      )}
                      style={action.backgroundStyle}
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
