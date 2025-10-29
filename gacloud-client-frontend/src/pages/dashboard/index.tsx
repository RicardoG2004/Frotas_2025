import { modules } from '@/config/modules'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { GreetingCard } from '@/components/shared/greeting-card'
import { PageHead } from '@/components/shared/page-head.jsx'
import { RecentPagesGrid } from '@/components/shared/recent-pages-grid'

export function DashboardPage() {
  const { name, selectedCemiterio, selectedEpoca } = useAuthStore()
  const { hasModuleAccess } = usePermissionsStore()
  const navigate = useNavigate()

  // Define module configurations with icons, colors, and descriptions
  const moduleConfigs = [
    {
      id: modules.frotas.id,
      name: modules.frotas.name,
      description:
        'Gestão completa de frotas e veículos',
      icon: Icons.car,
      color: 'bg-blue-500',
      path: '/frotas',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient:
        'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20',
    },
    {
      id: modules.utilitarios.id,
      name: modules.utilitarios.name,
      description: 'Ferramentas e configurações do sistema',
      icon: Icons.tablerSettings,
      color: 'bg-green-500',
      path: '/utilitarios',
      gradient: 'from-green-500 to-green-600',
      bgGradient:
        'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20',
    },
    // Fake modules for layout testing
    {
      id: 'fake-module-1',
      name: 'Gestão Financeira',
      description: 'Controlo de receitas, despesas e relatórios financeiros',
      icon: Icons.IconReportMoney,
      color: 'bg-amber-500',
      path: '/financeiro',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient:
        'from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20',
      fake: true,
    },
    {
      id: 'fake-module-2',
      name: 'Recursos Humanos',
      description: 'Gestão de funcionários, horários e benefícios',
      icon: Icons.user,
      color: 'bg-pink-500',
      path: '/rh',
      gradient: 'from-pink-500 to-pink-600',
      bgGradient:
        'from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20',
      fake: true,
    },
    {
      id: 'fake-module-3',
      name: 'Manutenção',
      description: 'Controlo de equipamentos e ordens de trabalho',
      icon: Icons.settings,
      color: 'bg-orange-500',
      path: '/manutencao',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient:
        'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20',
      fake: true,
    },
  ]

  // Filter modules based on user access
  const availableModules = moduleConfigs.filter(
    (module) => module.fake || hasModuleAccess(module.id)
  )

  return (
    <>
      <PageHead title='Dashboard | Luma' />
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

        {/* Modules Grid */}
        <div className='w-full relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-2xl shadow-primary/5 p-6'>
          <div className='mb-6'>
            <div className='flex items-center gap-4 mb-3'>
              <div className='p-3 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-sm'>
                <Icons.dashboard className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                  Módulos Disponíveis
                </h2>
                <p className='text-muted-foreground/80 text-sm mt-1'>
                  Selecione um módulo para aceder às suas funcionalidades
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {availableModules.map((module) => (
              <div
                key={module.id}
                className='group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/60 hover:scale-[1.02] hover:bg-card/80 cursor-pointer'
                onClick={() => {
                  if (!module.fake) {
                    const instanceId = crypto.randomUUID()
                    navigate(`${module.path}?instanceId=${instanceId}`)
                  }
                }}
              >
                {/* Modern glassmorphism background */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

                {/* Floating particles effect */}
                <div className='absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-50'></div>
                <div className='absolute bottom-3 left-3 w-1.5 h-1.5 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100'></div>

                <div className='relative p-6'>
                  <div className='flex items-start gap-4'>
                    {/* Modern icon container with glow */}
                    <div
                      className={`relative p-4 rounded-md bg-gradient-to-r ${module.gradient} shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-105 transition-all duration-200`}
                    >
                      <div className='absolute inset-0 rounded-md bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
                      <module.icon className='h-8 w-8 text-white relative z-10' />
                    </div>

                    {/* Content with modern typography */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200'>
                          {module.name}
                        </h3>
                        {module.fake && (
                          <Badge
                            variant='secondary'
                            className='text-xs font-medium'
                          >
                            Em desenvolvimento
                          </Badge>
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-200 line-clamp-2 leading-relaxed mb-4'>
                        {module.description}
                      </p>
                      {module.fake && (
                        <div className='pt-3 border-t border-border/50'>
                          <p className='text-xs text-muted-foreground'>
                            Este módulo estará disponível em breve
                          </p>
                        </div>
                      )}
                      {!module.fake && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <Icons.arrowRight className='h-4 w-4' />
                          <span>Clique para aceder</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modern gradient border */}
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>

                {/* Subtle shine effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-300 opacity-0 group-hover:opacity-100'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
