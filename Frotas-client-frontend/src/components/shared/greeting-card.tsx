import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

interface GreetingCardProps {
  userName?: string
  selectedCemiterio?: {
    id: string
    nome: string
  } | null
  selectedEpoca?: {
    id: string
    ano: string | number
    descricao: string
  } | null
  showStatus?: boolean
  className?: string
}

export function GreetingCard({
  userName,
  selectedCemiterio,
  selectedEpoca,
  showStatus = true,
  className = '',
}: GreetingCardProps) {
  const currentTime = new Date()
  const hour = currentTime.getHours()
  const dayOfWeek = currentTime.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  // Enhanced time-based greeting with more specific periods
  const getGreeting = () => {
    if (hour >= 5 && hour < 12) return 'Bom dia'
    if (hour >= 12 && hour < 14) return 'Bom almoço'
    if (hour >= 14 && hour < 18) return 'Boa tarde'
    if (hour >= 18 && hour < 22) return 'Boa noite'
    return 'Boa madrugada'
  }

  // Get appropriate icon based on time
  const getGreetingIcon = () => {
    if (hour >= 5 && hour < 12) return Icons.sun
    if (hour >= 12 && hour < 14) return Icons.pizza
    if (hour >= 14 && hour < 18) return Icons.sun
    if (hour >= 18 && hour < 22) return Icons.moon
    return Icons.moon
  }

  const greeting = getGreeting()

  // Get user's first name with better handling
  const getUserFirstName = () => {
    if (!userName) return 'Utilizador'
    const firstName = userName.trim().split(' ')[0]
    return firstName || 'Utilizador'
  }

  // Get contextual message based on time and day
  const getContextualMessage = () => {
    if (isWeekend) {
      return 'Esperamos que tenha um bom fim de semana!'
    }
    if (hour >= 8 && hour < 18) {
      return 'Bem-vindo ao dashboard de gestão de frotas'
    }
    if (hour >= 18 && hour < 22) {
      return 'Obrigado pelo seu trabalho hoje!'
    }
    return 'Bem-vindo ao sistema de gestão Frotas'
  }

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br from-card/98 via-card/95 to-card/90 border border-border/60 shadow-2xl shadow-primary/5 hover:shadow-3xl hover:shadow-primary/10 transition-shadow duration-200 group ${className}`}
    >
      {/* Simplified background effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5'></div>
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl'></div>
      <div className='absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-accent/20 to-accent/5 rounded-full blur-xl'></div>

      <CardContent className='relative z-10 p-4 md:p-5'>
        <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4'>
          <div className='flex-1'>
            <div className='flex items-start gap-3 mb-2'>
              <div className='relative group/avatar'>
                <div className='w-10 h-10 bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 rounded-md flex items-center justify-center shadow-md shadow-primary/20 border border-primary/20'>
                  {(() => {
                    const IconComponent = getGreetingIcon()
                    return <IconComponent className='h-5 w-5 text-primary' />
                  })()}
                </div>
                <div className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-background shadow-md'></div>
              </div>
              <div className='flex-1 space-y-1'>
                <h1 className='text-2xl xl:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight'>
                  {greeting}, {getUserFirstName()}!
                </h1>
                <p className='text-muted-foreground text-base font-medium leading-relaxed max-w-xl'>
                  {getContextualMessage()}
                </p>
                {showStatus && (
                  <div className='flex items-center gap-2 text-xs text-muted-foreground/80'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
                    <span>
                      Sistema ativo •{' '}
                      {new Date().toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(selectedCemiterio || selectedEpoca) && (
            <div className='flex flex-col sm:flex-row xl:flex-col gap-3'>
              {selectedCemiterio && (
                <div className='relative overflow-hidden bg-gradient-to-br from-card/80 via-card/70 to-card/60 rounded-xl p-3 border border-border/50 shadow-md shadow-primary/5 min-w-0'>
                  <div className='relative flex items-start gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md flex items-center justify-center shadow-sm border border-primary/20 flex-shrink-0'>
                      <Icons.IconGrave className='h-4 w-4 text-primary' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5'>
                        Cemitério
                      </div>
                      <div
                        className='font-bold text-foreground text-sm leading-tight break-words hyphens-auto'
                        title={selectedCemiterio.nome || 'Nenhum selecionado'}
                      >
                        {(() => {
                          const nome =
                            selectedCemiterio.nome || 'Nenhum selecionado'
                          const maxLength = 30 // Character limit
                          return nome.length > maxLength
                            ? nome.substring(0, maxLength) + '...'
                            : nome
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEpoca && (
                <div className='relative overflow-hidden bg-gradient-to-br from-card/80 via-card/70 to-card/60 rounded-xl p-3 border border-border/50 shadow-md shadow-primary/5 min-w-0'>
                  <div className='relative flex items-start gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md flex items-center justify-center shadow-sm border border-primary/20 flex-shrink-0'>
                      <Icons.dashboard className='h-4 w-4 text-primary' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5'>
                        Época
                      </div>
                      <div className='font-bold text-foreground text-sm leading-tight break-words hyphens-auto'>
                        {selectedEpoca.ano || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
