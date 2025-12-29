import { useState, useEffect, useCallback } from 'react'
import { format, addMonths, subMonths, getYear, getMonth } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Eye, Plus, Car, CalendarDays, Trash2, Edit, CalendarPlus, Fuel, Gauge, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useGetFuncionarios } from '@/pages/base/funcionarios/queries/funcionarios-queries'
import { Autocomplete } from '@/components/ui/autocomplete'
import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { useGetViaturasSelect } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { AbastecimentosService } from '@/lib/services/frotas/abastecimentos-service'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CreateAbastecimentoDTO, AbastecimentoDTO, UpdateAbastecimentoDTO } from '@/types/dtos/frotas/abastecimentos.dtos'
import { handleApiResponse } from '@/utils/response-handlers'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function parseNumberOrEmpty(value: string): string {
  if (!value) return ''
  const n = Number(value)
  return Number.isFinite(n) ? String(n) : ''
}

const STORAGE_KEY = 'abastecimentos-page-state'

interface SavedState {
  selectedDate?: string
  currentMonth?: string
  selectedFuncionarioId?: string
  selectedViaturaId?: string
  data?: string
  kms?: string
  litros?: string
  valor?: string
  showAbastecimentoForm?: boolean
}

function loadStateFromStorage(): SavedState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Erro ao carregar estado do localStorage:', error)
  }
  return null
}

function saveStateToStorage(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Erro ao salvar estado no localStorage:', error)
  }
}

export function AbastecimentosPage() {
  const savedState = loadStateFromStorage()
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    savedState?.selectedDate ? new Date(savedState.selectedDate) : new Date()
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    savedState?.currentMonth ? new Date(savedState.currentMonth) : new Date()
  )
  const [calendarDayCounts, setCalendarDayCounts] = useState<Record<string, number>>({})
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string>(savedState?.selectedFuncionarioId || '')
  const [selectedViaturaId, setSelectedViaturaId] = useState<string>(savedState?.selectedViaturaId || '')
  const [data, setData] = useState<string>(savedState?.data || '')
  const [kms, setKms] = useState<string>(savedState?.kms || '')
  const [litros, setLitros] = useState<string>(savedState?.litros || '')
  const [valor, setValor] = useState<string>(savedState?.valor || '')
  const [showAbastecimentoForm, setShowAbastecimentoForm] = useState<boolean>(savedState?.showAbastecimentoForm || false)
  const [editingAbastecimentoId, setEditingAbastecimentoId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [abastecimentoToDelete, setAbastecimentoToDelete] = useState<AbastecimentoDTO | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Get funcionarios
  const { data: funcionariosData } = useGetFuncionarios()
  const funcionarios = funcionariosData?.info?.data || []

  // Get viaturas
  const { data: viaturasData } = useGetViaturasSelect()
  const viaturas = viaturasData || []

  // Get abastecimentos by date
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: abastecimentosData, refetch: refetchAbastecimentos } = useQuery<AbastecimentoDTO[] | null>({
    queryKey: ['abastecimentos-by-date', formattedDate],
    queryFn: async () => {
      if (!formattedDate) return null
      const response = await AbastecimentosService('abastecimento').getAbastecimentosByDate(formattedDate)
      return response.info?.data || []
    },
    enabled: !!formattedDate,
    staleTime: 30000,
  })
  const abastecimentos: AbastecimentoDTO[] = abastecimentosData || []

  // Atualizar "heat counts" quando os dados chegam
  useEffect(() => {
    if (!formattedDate) return
    setCalendarDayCounts((prev) => {
      const count = abastecimentos.length
      return prev[formattedDate] === count ? prev : { ...prev, [formattedDate]: count }
    })
  }, [formattedDate, abastecimentos.length])

  // Prepare funcionarios options for Autocomplete
  const funcionarioOptions = useMemo(() => {
    return funcionarios
      .filter((f) => f.ativo)
      .map((funcionario) => {
        const nome = funcionario.nome || ''
        const cargo = funcionario.cargo?.designacao || 'Sem cargo'
        return {
          value: funcionario.id,
          label: `${nome} - ${cargo}`,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [funcionarios])

  // Prepare viaturas options for Autocomplete
  const viaturaOptions = useMemo(() => {
    return viaturas.map((viatura) => {
      const matricula = viatura.matricula || ''
      const marca = viatura.marca?.nome || ''
      const modelo = viatura.modelo?.nome || ''
      const label = marca && modelo
        ? `${matricula} / ${marca} ${modelo}`
        : matricula
      return {
        value: viatura.id,
        label: label,
      }
    })
  }, [viaturas])

  // Sincronizar campo data com calendário selecionado
  useEffect(() => {
    if (selectedDate && !editingAbastecimentoId) {
      setData(format(selectedDate, 'yyyy-MM-dd'))
    }
  }, [selectedDate, editingAbastecimentoId])

  // Salvar estado no localStorage
  useEffect(() => {
    if (!editingAbastecimentoId) {
      const stateToSave: SavedState = {
        selectedDate: selectedDate?.toISOString(),
        currentMonth: currentMonth.toISOString(),
        selectedFuncionarioId,
        selectedViaturaId,
        data,
        kms,
        litros,
        valor,
        showAbastecimentoForm,
      }
      saveStateToStorage(stateToSave)
    }
  }, [
    selectedDate,
    currentMonth,
    selectedFuncionarioId,
    selectedViaturaId,
    data,
    kms,
    litros,
    valor,
    showAbastecimentoForm,
    editingAbastecimentoId,
  ])

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const currentYear = getYear(new Date())
  const yearOptions = []
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    yearOptions.push(year)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(parseInt(monthIndex))
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(parseInt(year))
    setCurrentMonth(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleCreateFuncionario = () => {
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/funcionarios/create?instanceId=${instanceId}`)
  }

  const handleViewFuncionario = () => {
    if (!selectedFuncionarioId) {
      return
    }
    const instanceId = crypto.randomUUID()
    navigate(`/utilitarios/tabelas/configuracoes/funcionarios/update?funcionarioId=${selectedFuncionarioId}&instanceId=${instanceId}`)
  }

  const handleCreateViatura = () => {
    const instanceId = crypto.randomUUID()
    navigate(`/frotas/viaturas/create?instanceId=${instanceId}`)
  }

  const handleViewViatura = () => {
    if (!selectedViaturaId) {
      return
    }
    const instanceId = crypto.randomUUID()
    navigate(`/frotas/viaturas/update?viaturaId=${selectedViaturaId}&instanceId=${instanceId}`)
  }

  // Delete abastecimento mutation
  const deleteAbastecimentoMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await AbastecimentosService('abastecimento').deleteAbastecimento(id)
      return response
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Abastecimento eliminado com sucesso',
        'Erro ao eliminar abastecimento',
        'Abastecimento eliminado com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['abastecimentos-by-date'] })
        refetchAbastecimentos()
      }
    },
    onError: (error: any) => {
      let errorMessage = 'Erro ao eliminar abastecimento'
      if (error?.data?.info?.messages) {
        const messages = error.data.info.messages
        if (typeof messages === 'object') {
          const messageArray = Object.values(messages).flat()
          errorMessage = messageArray.join(', ') || errorMessage
        } else if (Array.isArray(messages)) {
          errorMessage = messages.join(', ') || errorMessage
        }
      } else if (error?.data?.info?.message) {
        errorMessage = error.data.info.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    },
  })

  // Update abastecimento mutation
  const updateAbastecimentoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAbastecimentoDTO }) => {
      const response = await AbastecimentosService('abastecimento').updateAbastecimento(id, data)
      return response
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Abastecimento atualizado com sucesso',
        'Erro ao atualizar abastecimento',
        'Abastecimento atualizado com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['abastecimentos-by-date'] })
        refetchAbastecimentos()
        setShowAbastecimentoForm(false)
        setEditingAbastecimentoId(null)
      }
    },
    onError: (error: any) => {
      let errorMessage = 'Erro ao atualizar abastecimento'
      if (error?.data?.info?.messages) {
        const messages = error.data.info.messages
        if (typeof messages === 'object') {
          const messageArray = Object.values(messages).flat()
          errorMessage = messageArray.join(', ') || errorMessage
        } else if (Array.isArray(messages)) {
          errorMessage = messages.join(', ') || errorMessage
        }
      } else if (error?.data?.info?.message) {
        errorMessage = error.data.info.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    },
  })

  // Create abastecimento mutation
  const createAbastecimentoMutation = useMutation({
    mutationFn: async (data: CreateAbastecimentoDTO) => {
      const response = await AbastecimentosService('abastecimento').createAbastecimento(data)
      return response
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Abastecimento criado com sucesso',
        'Erro ao criar abastecimento',
        'Abastecimento criado com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['abastecimentos-by-date'] })
        refetchAbastecimentos()
        setShowAbastecimentoForm(false)
        setEditingAbastecimentoId(null)
      }
    },
    onError: (error: any) => {
      let errorMessage = 'Erro ao criar abastecimento'
      if (error?.data?.info?.messages) {
        const messages = error.data.info.messages
        if (typeof messages === 'object') {
          const messageArray = Object.values(messages).flat()
          errorMessage = messageArray.join(', ') || errorMessage
        } else if (Array.isArray(messages)) {
          errorMessage = messages.join(', ') || errorMessage
        }
      } else if (error?.data?.info?.message) {
        errorMessage = error.data.info.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    },
  })

  const handleEditAbastecimento = (abastecimento: AbastecimentoDTO) => {
    setEditingAbastecimentoId(abastecimento.id)
    const abastecimentoDate = abastecimento.data ? new Date(abastecimento.data) : new Date()
    setSelectedDate(abastecimentoDate)
    setCurrentMonth(abastecimentoDate)
    setSelectedFuncionarioId(abastecimento.funcionarioId)
    setSelectedViaturaId(abastecimento.viaturaId)
    setData(abastecimento.data ? abastecimento.data.slice(0, 10) : '')
    setKms(typeof abastecimento.kms === 'number' ? String(abastecimento.kms) : '')
    setLitros(typeof abastecimento.litros === 'number' ? String(abastecimento.litros) : '')
    setValor(typeof abastecimento.valor === 'number' ? String(abastecimento.valor) : '')
    setShowAbastecimentoForm(true)
  }

  const handleCreateAbastecimento = () => {
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data')
      return
    }
    if (!selectedFuncionarioId) {
      toast.error('Por favor, selecione um funcionário')
      return
    }
    if (!selectedViaturaId) {
      toast.error('Por favor, selecione uma viatura')
      return
    }
    if (!data) {
      toast.error('Por favor, selecione uma data para o abastecimento')
      return
    }

    if (editingAbastecimentoId) {
      const updateData: UpdateAbastecimentoDTO = {
        data: data,
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId,
        kms: kms ? Number(kms) : undefined,
        litros: litros ? Number(litros) : undefined,
        valor: valor ? Number(valor) : undefined,
      }
      updateAbastecimentoMutation.mutate({ id: editingAbastecimentoId, data: updateData })
    } else {
      const createData: CreateAbastecimentoDTO = {
        data: data,
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId,
        kms: kms ? Number(kms) : undefined,
        litros: litros ? Number(litros) : undefined,
        valor: valor ? Number(valor) : undefined,
      }
      createAbastecimentoMutation.mutate(createData)
    }
  }

  const handleAddAbastecimento = () => {
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data')
      return
    }
    if (!selectedFuncionarioId) {
      toast.error('Por favor, selecione um funcionário')
      return
    }
    if (!selectedViaturaId) {
      toast.error('Por favor, selecione uma viatura')
      return
    }
    setData(format(selectedDate, 'yyyy-MM-dd'))
    setShowAbastecimentoForm(true)
  }

  const handleCancelAbastecimento = () => {
    setShowAbastecimentoForm(false)
    setEditingAbastecimentoId(null)
    setData('')
    setKms('')
    setLitros('')
    setValor('')
  }

  const handleDeleteAbastecimento = (abastecimento: AbastecimentoDTO) => {
    setAbastecimentoToDelete(abastecimento)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (abastecimentoToDelete) {
      deleteAbastecimentoMutation.mutate(abastecimentoToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setAbastecimentoToDelete(null)
        },
      })
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setAbastecimentoToDelete(null)
  }

  const CalendarDayButton = useCallback((props: any) => {
    const date: Date = props?.day?.date
    const modifiers = props?.modifiers || {}
    const isSelected = !!modifiers?.selected
    const isOutside = !!modifiers?.outside
    const isToday = !!modifiers?.today
    const isWeekend = date?.getDay?.() === 0 || date?.getDay?.() === 6
    const key = date ? format(date, 'yyyy-MM-dd') : ''
    const count = key ? (calendarDayCounts[key] ?? 0) : 0

    return (
      <button
        {...props}
        type='button'
      >
        <div className='relative h-full w-full flex flex-col items-center justify-center'>
          {(isSelected || isToday) && (
            <div
              className={[
                'pointer-events-none absolute inset-0 rounded-xl',
                isSelected
                  ? 'ring-2 ring-primary/60 shadow-[0_0_0_2px_rgba(0,0,0,0.02),0_0_28px_rgba(99,102,241,0.18)]'
                  : 'ring-1 ring-primary/20',
              ].join(' ')}
            />
          )}

          <div
            className={[
              'leading-none',
              isOutside ? 'opacity-55' : '',
              isWeekend && !isSelected ? 'text-foreground/90' : '',
            ].join(' ')}
          >
            {date?.getDate?.()}
          </div>

          {count > 0 && (
            <div className='mt-1 flex items-center justify-center gap-0.5'>
              {Array.from({ length: Math.min(6, count) }).map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-1 w-1 rounded-full',
                    isSelected ? 'bg-primary-foreground/80' : 'bg-primary/70',
                  ].join(' ')}
                />
              ))}
              {count > 6 && (
                <span className={isSelected ? 'text-[9px] text-primary-foreground/80' : 'text-[9px] text-muted-foreground'}>
                  +{count - 6}
                </span>
              )}
            </div>
          )}
        </div>
      </button>
    )
  }, [calendarDayCounts])

  const calendarComponents = useMemo(() => {
    return { DayButton: CalendarDayButton } as unknown as Record<string, any>
  }, [CalendarDayButton])

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Abastecimentos | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Frotas',
            link: '/frotas',
          },
          {
            title: 'Abastecimentos',
            link: '/frotas/abastecimentos',
          },
        ]}
      />

      <div className='mt-10'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Calendário */}
          <div className='lg:col-span-1'>
            <Card className='shadow-lg border-l-4 border-l-primary/50 overflow-hidden'>
              <CardHeader className='pb-1.5 px-3 pt-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='rounded-lg bg-primary/10 p-1.5'>
                      <CalendarIcon className='h-3.5 w-3.5 text-primary' />
                    </div>
                    <CardTitle className='text-xs font-semibold'>
                      Calendário
                    </CardTitle>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={goToToday}
                    className='text-xs h-6 px-2'
                  >
                    Hoje
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='pt-0 pb-2.5 px-3'>
                <div className='mb-2.5 pb-2.5 border-b border-border/50'>
                  <div className='flex items-center justify-between gap-3'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handlePreviousMonth}
                      className='h-7 w-7 rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow'
                    >
                      <ChevronLeft className='h-3.5 w-3.5' />
                    </Button>

                    <div className='flex items-center gap-1.5 flex-1'>
                      <div className='flex-1'>
                        <Select
                          value={getMonth(currentMonth).toString()}
                          onValueChange={handleMonthChange}
                        >
                          <SelectTrigger className='h-7 w-full text-xs font-semibold border hover:border-primary/50 transition-colors rounded-lg shadow-sm'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='max-h-[300px]'>
                            {monthNames.map((month, index) => (
                              <SelectItem 
                                key={index} 
                                value={index.toString()}
                                className='cursor-pointer hover:bg-accent'
                              >
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='w-20'>
                        <Select
                          value={getYear(currentMonth).toString()}
                          onValueChange={handleYearChange}
                        >
                          <SelectTrigger className='h-7 w-full text-xs font-semibold border hover:border-primary/50 transition-colors rounded-lg shadow-sm'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='max-h-[300px]'>
                            {yearOptions.map((year) => (
                              <SelectItem 
                                key={year} 
                                value={year.toString()}
                                className='cursor-pointer hover:bg-accent'
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handleNextMonth}
                      className='h-7 w-7 rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow'
                    >
                      <ChevronRight className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </div>

                <div className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-background via-background to-muted/30 shadow-[0_10px_40px_-22px_rgba(0,0,0,0.45)]'>
                  <div className='pointer-events-none absolute -top-16 left-1/2 h-28 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0 blur-3xl' />
                  <div className='pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl' />
                  <div
                    className='pointer-events-none absolute inset-0 opacity-[0.07]'
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.6) 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  <div className='p-1.5'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      locale={pt}
                      className='rounded-xl p-2'
                      components={calendarComponents as any}
                      classNames={{
                            months: 'flex flex-col space-y-3',
                            month: 'space-y-3',
                            month_caption: 'hidden',
                            caption_label: 'text-sm font-medium',
                            nav: 'space-x-1 flex items-center',
                            button_previous: 'hidden',
                            button_next: 'hidden',
                            month_grid: 'w-full border-collapse space-y-1.5',
                            weekdays: 'flex w-full -mt-1 px-1',
                            weekday:
                              'text-muted-foreground/80 flex-1 h-7 flex items-center justify-center font-semibold text-[10px] uppercase tracking-wider',
                            week: 'flex w-full mt-1.5 px-1',
                            day: 'group flex-1 h-10 text-center text-xs p-0 relative rounded-xl flex items-center justify-center',
                            day_button:
                              [
                                'relative w-full h-full rounded-xl p-0 font-medium aria-selected:opacity-100',
                                'flex items-center justify-center',
                                'transition-all duration-200',
                                'hover:scale-[1.04] active:scale-[0.98]',
                                'hover:bg-gradient-to-br hover:from-accent/70 hover:to-accent/20',
                                'hover:shadow-[0_10px_20px_-14px_rgba(0,0,0,0.55)]',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                              ].join(' '),
                            selected:
                              [
                                'bg-gradient-to-br from-primary via-primary to-primary/85',
                                'text-primary-foreground',
                                'shadow-[0_14px_26px_-18px_rgba(99,102,241,0.75)]',
                                'hover:from-primary hover:to-primary/80',
                                'font-semibold',
                              ].join(' '),
                            today:
                              [
                                'bg-primary/10 text-foreground',
                                'shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]',
                              ].join(' '),
                            outside:
                              'day-outside text-muted-foreground/50 opacity-60',
                            disabled: 'text-muted-foreground opacity-40',
                          }}
                      />
                    </div>
                </div>

                {selectedDate && (
                  <div className='mt-2 pt-2 border-t'>
                    <div className='text-xs text-muted-foreground'>
                      Data selecionada:
                    </div>
                    <div className='text-xs font-semibold mt-0.5'>
                      {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Viatura */}
            <Card className='shadow-lg mt-2 border-l-4 border-l-primary/50'>
              <CardHeader className='pb-2 px-3 pt-3'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-primary/10 p-1.5'>
                    <Car className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <CardTitle className='text-xs font-semibold'>
                    Viatura
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='pb-3 px-3'>
                <div className='relative'>
                  <Autocomplete
                    options={viaturaOptions}
                    value={selectedViaturaId}
                    onValueChange={setSelectedViaturaId}
                    placeholder='Selecione ou pesquise viatura'
                    emptyText='Nenhuma viatura encontrada.'
                    className='h-11 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2.5 pr-18'
                    defaultVisibleCount={8}
                  />
                  <div className='absolute right-8 top-1/2 -translate-y-1/2 flex gap-1 z-10'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleViewViatura}
                      className='h-7 w-7 p-0 hover:bg-accent'
                      title='Ver Viatura'
                      disabled={!selectedViaturaId}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleCreateViatura}
                      className='h-7 w-7 p-0 hover:bg-accent'
                      title='Criar Viatura'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funcionário */}
            <Card className='shadow-lg mt-2 border-l-4 border-l-primary/50'>
              <CardHeader className='pb-2 px-3 pt-3'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-primary/10 p-1.5'>
                    <User className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <CardTitle className='text-xs font-semibold'>
                    Funcionário
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='pb-3 px-3'>
                <div className='relative'>
                  <Autocomplete
                    options={funcionarioOptions}
                    value={selectedFuncionarioId}
                    onValueChange={setSelectedFuncionarioId}
                    placeholder='Selecione ou pesquise funcionário'
                    emptyText='Nenhum funcionário encontrado.'
                    className='h-11 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2.5 pr-18'
                    defaultVisibleCount={8}
                  />
                  <div className='absolute right-8 top-1/2 -translate-y-1/2 flex gap-1 z-10'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleViewFuncionario}
                      className='h-7 w-7 p-0 hover:bg-accent'
                      title='Ver Funcionário'
                      disabled={!selectedFuncionarioId}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleCreateFuncionario}
                      className='h-7 w-7 p-0 hover:bg-accent'
                      title='Criar Funcionário'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Abastecimento */}
          <div className='lg:col-span-2'>
            <Card className='shadow-lg h-full border-l-4 border-l-primary/50'>
              <CardHeader className='pb-4 border-b'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='rounded-lg bg-primary/10 p-2.5'>
                      <Fuel className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-lg font-semibold mb-1'>Abastecimentos</CardTitle>
                      {selectedDate && (
                        <div className='flex items-center gap-2'>
                          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border/50'>
                            <CalendarDays className='h-3 w-3 text-muted-foreground' />
                            <span className='text-xs font-medium text-foreground'>
                              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: pt })}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {format(selectedDate, 'yyyy', { locale: pt })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedDate && !showAbastecimentoForm && (
                    <Button
                      onClick={handleAddAbastecimento}
                      disabled={!selectedFuncionarioId || !selectedViaturaId}
                      className='h-8 text-xs font-semibold px-4 mt-7'
                      size='sm'
                    >
                      <CalendarPlus className='h-3.5 w-3.5 mr-1.5' />
                      Adicionar Abastecimento
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  !showAbastecimentoForm ? (
                    <div className='space-y-3'>
                      {abastecimentos.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 px-4'>
                          <div className='rounded-full bg-primary/10 p-6 mb-6'>
                            <Fuel className='h-12 w-12 text-primary' />
                          </div>
                          <h3 className='text-lg font-semibold mb-2 text-foreground'>Nenhum abastecimento encontrado</h3>
                          <p className='text-sm text-muted-foreground text-center max-w-md leading-relaxed'>
                            Não existem abastecimentos registados para esta data.
                            {selectedFuncionarioId && selectedViaturaId ? (
                              <> Clique no botão "Adicionar Abastecimento" acima para criar o primeiro abastecimento.</>
                            ) : (
                              <> Selecione um funcionário e uma viatura no painel lateral para começar a adicionar abastecimentos.</>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className='space-y-2.5'>
                          {abastecimentos.map((abastecimento, index) => (
                            <Card
                              key={abastecimento.id}
                              className={`border hover:border-primary/30 hover:shadow-sm transition-all duration-200 ${index === 0 ? 'mt-3' : ''}`}
                            >
                              <CardContent className='p-3.5'>
                                <div className='flex items-center justify-between gap-4'>
                                  <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                                    <div className='rounded-md bg-primary/10 p-1.5 flex-shrink-0'>
                                      <User className='h-4 w-4 text-primary' />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-xs font-medium text-muted-foreground mb-1'>Funcionário</p>
                                      <div className='border-t border-border/50 pt-1'>
                                        <p className='text-sm font-semibold text-foreground truncate'>
                                          {abastecimento.funcionario?.nome || 'Funcionário não encontrado'}
                                        </p>
                                        {abastecimento.funcionario?.cargo?.designacao && (
                                          <p className='text-xs text-muted-foreground truncate mt-0.5'>
                                            {abastecimento.funcionario.cargo.designacao}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {abastecimento.viatura && (
                                    <div className='flex items-start gap-2 min-w-0 flex-shrink-0 w-32'>
                                      <Car className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Viatura</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm font-semibold text-foreground truncate'>
                                            {abastecimento.viatura.matricula}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className='flex items-start gap-2 min-w-0 flex-shrink-0'>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-xs font-medium text-muted-foreground mb-1'>Dados</p>
                                      <div className='border-t border-border/50 pt-1 space-y-1'>
                                        {abastecimento.kms && (
                                          <p className='text-xs text-foreground'>
                                            <Gauge className='h-3 w-3 inline mr-1' />
                                            {abastecimento.kms} km
                                          </p>
                                        )}
                                        {abastecimento.litros && (
                                          <p className='text-xs text-foreground'>
                                            <Fuel className='h-3 w-3 inline mr-1' />
                                            {abastecimento.litros} L
                                          </p>
                                        )}
                                        {abastecimento.valor && (
                                          <p className='text-xs text-foreground'>
                                            <DollarSign className='h-3 w-3 inline mr-1' />
                                            {abastecimento.valor.toFixed(2)} €
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className='flex items-center gap-1.5 flex-shrink-0'>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='h-8 w-8 p-0'
                                      title='Editar Abastecimento'
                                      onClick={() => handleEditAbastecimento(abastecimento)}
                                    >
                                      <Edit className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:border-destructive'
                                      title='Eliminar Abastecimento'
                                      onClick={() => handleDeleteAbastecimento(abastecimento)}
                                      disabled={deleteAbastecimentoMutation.isPending}
                                    >
                                      <Trash2 className='h-4 w-4' />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex items-start justify-center min-h-[400px] pt-10 pb-6'>
                      <div className='w-full max-w-3xl'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                          <div className='space-y-1 col-span-2'>
                            <Label htmlFor='data' className='text-xs font-medium flex items-center gap-1.5'>
                              <CalendarDays className='h-3 w-3' />
                              Data
                            </Label>
                            <Input
                              id='data'
                              type='date'
                              value={data}
                              onChange={(e) => {
                                const newDate = e.target.value
                                setData(newDate)
                                if (newDate) {
                                  const dateObj = new Date(newDate)
                                  setSelectedDate(dateObj)
                                  setCurrentMonth(dateObj)
                                }
                              }}
                              className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>
                        </div>

                        <div className='my-3 h-px bg-border/60' />

                        <div className='grid grid-cols-1 lg:grid-cols-6 gap-2 items-end'>
                          <div className='space-y-1 lg:col-span-4'>
                            <Label htmlFor='viatura-select' className='text-xs font-medium flex items-center gap-1.5'>
                              <Car className='h-3 w-3' />
                              Viatura
                            </Label>
                            <div className='relative'>
                              <div className='absolute left-3 top-1/2 -translate-y-1/2 z-[100] pointer-events-none flex items-center'>
                                <Car className='h-3.5 w-3.5 text-muted-foreground' />
                              </div>
                              <Autocomplete
                                options={viaturaOptions}
                                value={selectedViaturaId}
                                onValueChange={setSelectedViaturaId}
                                placeholder='Selecione ou pesquise viatura'
                                emptyText='Nenhuma viatura encontrada.'
                                className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm pl-10 pr-16 py-2'
                                defaultVisibleCount={8}
                              />
                              <div className='absolute right-9 top-1/2 -translate-y-1/2 flex gap-0.5 z-10'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={handleViewViatura}
                                  className='h-6 w-6 p-0 hover:bg-accent'
                                  title='Ver Viatura'
                                  disabled={!selectedViaturaId}
                                >
                                  <Eye className='h-3 w-3' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={handleCreateViatura}
                                  className='h-6 w-6 p-0 hover:bg-accent'
                                  title='Criar Viatura'
                                >
                                  <Plus className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='my-3 h-px bg-border/60' />

                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                          <div className='space-y-1'>
                            <Label htmlFor='kms' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <Gauge className='h-3 w-3 text-muted-foreground' />
                              Kms
                            </Label>
                            <Input
                              id='kms'
                              type='number'
                              inputMode='numeric'
                              value={kms}
                              onChange={(e) => setKms(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                              className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>

                          <div className='space-y-1'>
                            <Label htmlFor='litros' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <Fuel className='h-3 w-3 text-muted-foreground' />
                              Litros
                            </Label>
                            <Input
                              id='litros'
                              type='number'
                              inputMode='decimal'
                              value={litros}
                              onChange={(e) => setLitros(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                              className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>

                          <div className='space-y-1'>
                            <Label htmlFor='valor' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <DollarSign className='h-3 w-3 text-muted-foreground' />
                              Valor
                            </Label>
                            <Input
                              id='valor'
                              type='number'
                              inputMode='decimal'
                              value={valor}
                              onChange={(e) => setValor(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                              className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>
                        </div>

                        <div className='mt-3 flex gap-2'>
                          <Button
                            onClick={handleCancelAbastecimento}
                            variant='outline'
                            className='flex-1 h-8 text-xs font-semibold'
                            size='sm'
                          >
                            Cancelar
                          </Button>
                          <Button
                            type='button'
                            onClick={handleCreateAbastecimento}
                            disabled={createAbastecimentoMutation.isPending || updateAbastecimentoMutation.isPending}
                            className='flex-1 h-8 text-xs font-semibold'
                            size='sm'
                          >
                            {createAbastecimentoMutation.isPending || updateAbastecimentoMutation.isPending
                              ? (editingAbastecimentoId ? 'A atualizar...' : 'A criar...')
                              : editingAbastecimentoId
                                ? 'Atualizar Abastecimento'
                                : 'Criar Abastecimento'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CalendarIcon className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm font-medium mb-1'>Selecione uma data</p>
                    <p className='text-xs'>no calendário para criar um abastecimento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmação para Eliminar Abastecimento */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Abastecimento</AlertDialogTitle>
            <AlertDialogDescription>
              {abastecimentoToDelete && (
                <>
                  Tem a certeza que deseja eliminar o abastecimento de{' '}
                  <span className='font-semibold text-foreground'>
                    {abastecimentoToDelete.funcionario?.nome || 'este abastecimento'}
                  </span>
                  ?
                  <br />
                  <span className='text-xs text-muted-foreground mt-2 block'>
                    Esta ação não pode ser desfeita.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteAbastecimentoMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteAbastecimentoMutation.isPending ? 'A eliminar...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

