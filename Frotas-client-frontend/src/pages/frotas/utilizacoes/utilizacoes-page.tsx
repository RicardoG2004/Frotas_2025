import { useState, useEffect, useRef, useCallback } from 'react'
import { format, addMonths, subMonths, getYear, getMonth } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Eye, Plus, Clock, Car } from 'lucide-react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGetViaturasSelect } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { UtilizacoesService } from '@/lib/services/frotas/utilizacoes-service'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CreateUtilizacaoDTO, UtilizacaoDTO, UpdateUtilizacaoDTO } from '@/types/dtos/frotas/utilizacoes.dtos'
import { CalendarDays, Trash2, Edit, CalendarPlus, Route, Fuel, Gauge } from 'lucide-react'
import { handleApiResponse } from '@/utils/response-handlers'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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

// Helper component for time picker
function TimePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const currentValue = value || ''
  const [hours, minutes] = currentValue ? currentValue.split(':').map(Number) : [0, 0]
  const displayHours = isNaN(hours) ? 0 : hours
  const displayMinutes = isNaN(minutes) ? 0 : minutes
  const formattedTime = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`

  const updateTime = useCallback((newHours: number, newMinutes: number) => {
    const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
    onChange(formatted)
  }, [onChange])

  const [isSelectingHours, setIsSelectingHours] = useState(true)
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
  const [open, setOpen] = useState(false)
  const clockRef = useRef<HTMLDivElement>(null)
  const startHour24Ref = useRef<number | null>(null)
  const startAngleRef = useRef<number | null>(null)
  const lastAngleRef = useRef<number | null>(null)
  const unwrappedAngleRef = useRef<number>(0)
  
  const hour12 = displayHours % 12 || 12
  const hourPosition = hour12 === 12 ? 0 : hour12
  const hourAngle = (hourPosition * 30) + (displayMinutes * 0.5) - 90
  const minuteAngle = (displayMinutes * 6) - 90

  const calculateAngleFromMouse = (clientX: number, clientY: number) => {
    if (!clockRef.current) return 0
    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const clickX = clientX - centerX
    const clickY = clientY - centerY
    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360
    return angle
  }

  const handlePointerMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(type)
    setIsSelectingHours(type === 'hour')
    
    const angle = calculateAngleFromMouse(e.clientX, e.clientY)
    
    if (type === 'hour') {
      startHour24Ref.current = displayHours
      startAngleRef.current = angle
    } else {
      let newMinute = Math.round(angle / 6)
      if (newMinute >= 60) newMinute = 0
      if (newMinute < 0) newMinute = 0
      updateTime(displayHours, newMinute)
    }
  }

  useEffect(() => {
    if (!isDragging) {
      startHour24Ref.current = null
      startAngleRef.current = null
      lastAngleRef.current = null
      unwrappedAngleRef.current = 0
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const angle = calculateAngleFromMouse(e.clientX, e.clientY)
      
      if (isDragging === 'hour') {
        const startHour24 = startHour24Ref.current
        const startAngle = startAngleRef.current
        
        if (startAngle !== null && startHour24 !== null) {
          if (lastAngleRef.current === null) {
            lastAngleRef.current = angle
            unwrappedAngleRef.current = startAngle
          } else {
            let delta = angle - lastAngleRef.current
            if (delta > 180) {
              delta -= 360
            } else if (delta < -180) {
              delta += 360
            }
            unwrappedAngleRef.current += delta
            lastAngleRef.current = angle
          }
          
          const totalRotation = unwrappedAngleRef.current - startAngle
          const hoursDelta = totalRotation / 15
          let newHour24 = startHour24 + hoursDelta
          newHour24 = ((newHour24 % 24) + 24) % 24
          const finalHour = Math.round(newHour24)
          
          if (finalHour >= 0 && finalHour <= 23) {
            updateTime(finalHour, displayMinutes)
          }
        }
      } else {
        let newMinute = Math.round(angle / 6)
        if (newMinute >= 60) newMinute = 0
        if (newMinute < 0) newMinute = 0
        updateTime(displayHours, newMinute)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
      startHour24Ref.current = null
      startAngleRef.current = null
      lastAngleRef.current = null
      unwrappedAngleRef.current = 0
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, displayHours, displayMinutes, updateTime])

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const clickX = e.clientX - centerX
    const clickY = e.clientY - centerY
    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360

    if (isSelectingHours) {
      let newHour12 = Math.round(angle / 30)
      if (newHour12 === 0 || newHour12 === 12) newHour12 = 12
      const isPM = displayHours >= 12
      const hour24 = newHour12 === 12 
        ? (isPM ? 12 : 0)
        : (isPM ? newHour12 + 12 : newHour12)
      updateTime(hour24, displayMinutes)
    } else {
      let newMinute = Math.round(angle / 6)
      if (newMinute >= 60) newMinute = 0
      if (newMinute < 0) newMinute = 0
      updateTime(displayHours, newMinute)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='relative cursor-pointer'>
          <Input
            type='time'
            placeholder='HH:mm'
            value={formattedTime}
            onChange={(e) => onChange(e.target.value)}
            className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-inner text-sm px-3 py-2 pl-10 cursor-pointer'
            readOnly
            onClick={() => setOpen(true)}
          />
          <Clock className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-6' align='start'>
        <div className='space-y-4'>
          <div className='relative w-48 h-48 mx-auto'>
            <div
              ref={clockRef}
              className='relative w-full h-full rounded-full border-4 border-border bg-gradient-to-br from-background to-muted/20 shadow-lg cursor-pointer hover:border-primary/50 transition-colors'
              onClick={handleClockClick}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const hourNumber = i === 0 ? 12 : i
                const angle = (i * 30) - 90
                const rad = (angle * Math.PI) / 180
                const radius = 75
                const centerX = 92
                const centerY = 92
                const x = centerX + radius * Math.cos(rad)
                const y = centerY + radius * Math.sin(rad)
                
                return (
                  <div
                    key={i}
                    className='absolute text-base font-bold text-foreground select-none'
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {hourNumber}
                  </div>
                )
              })}

              {Array.from({ length: 60 }).map((_, i) => {
                if (i % 5 === 0) return null
                const angle = (i * 6) - 90
                const rad = (angle * Math.PI) / 180
                const radius = 90
                const centerX = 92
                const centerY = 92
                const x = centerX + radius * Math.cos(rad)
                const y = centerY + radius * Math.sin(rad)
                
                return (
                  <div
                    key={i}
                    className='absolute w-1 h-1 rounded-full bg-muted-foreground/30'
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )
              })}

              <div
                className='absolute bg-foreground transition-transform duration-300 ease-out z-20 cursor-grab active:cursor-grabbing'
                style={{
                  left: '50%',
                  top: '50%',
                  width: isSelectingHours ? '4px' : '2px',
                  height: '45px',
                  transform: `translate(-50%, -100%) rotate(${hourAngle + 90}deg)`,
                  transformOrigin: '50% 100%',
                  opacity: isSelectingHours ? 1 : 0.5,
                  borderRadius: '2px 2px 0 0',
                }}
                onMouseDown={(e) => handlePointerMouseDown(e, 'hour')}
              />

              <div
                className='absolute bg-foreground transition-transform duration-300 ease-out z-30 cursor-grab active:cursor-grabbing'
                style={{
                  left: '50%',
                  top: '50%',
                  width: !isSelectingHours ? '3px' : '2px',
                  height: '64px',
                  transform: `translate(-50%, -100%) rotate(${minuteAngle + 90}deg)`,
                  transformOrigin: '50% 100%',
                  opacity: !isSelectingHours ? 1 : 0.5,
                  borderRadius: '2px 2px 0 0',
                }}
                onMouseDown={(e) => handlePointerMouseDown(e, 'minute')}
              />

              <div className='absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground border-4 border-background shadow-md z-10' />
            </div>
          </div>

          <div className='flex items-center justify-center gap-2 pt-2 border-t'>
            <Input
              type='number'
              min={0}
              max={23}
              value={displayHours}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                const clamped = Math.max(0, Math.min(23, val))
                updateTime(clamped, displayMinutes)
              }}
              className='w-16 text-center'
              placeholder='00'
            />
            <span className='text-lg font-medium'>:</span>
            <Input
              type='number'
              min={0}
              max={59}
              value={displayMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                const clamped = Math.max(0, Math.min(59, val))
                updateTime(displayHours, clamped)
              }}
              className='w-16 text-center'
              placeholder='00'
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const STORAGE_KEY = 'utilizacoes-page-state'

interface SavedState {
  selectedDate?: string // ISO string
  currentMonth?: string // ISO string
  selectedFuncionarioId?: string
  selectedViaturaId?: string
  dataUltimaConferencia?: string
  valorCombustivel?: string
  kmPartida?: string
  kmChegada?: string
  totalKmEfectuados?: string
  totalKmConferidos?: string
  totalKmAConferir?: string
  horaInicio?: string
  horaFim?: string
  showUtilizacaoForm?: boolean
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

export function UtilizacoesPage() {
  // Carregar estado inicial do localStorage
  const savedState = loadStateFromStorage()
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    savedState?.selectedDate ? new Date(savedState.selectedDate) : new Date()
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    savedState?.currentMonth ? new Date(savedState.currentMonth) : new Date()
  )
  const [calendarDayCounts, setCalendarDayCounts] = useState<Record<string, number>>({})
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined)
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string>(savedState?.selectedFuncionarioId || '')
  const [selectedViaturaId, setSelectedViaturaId] = useState<string>(savedState?.selectedViaturaId || '')
  const [dataUltimaConferencia, setDataUltimaConferencia] = useState<string>(savedState?.dataUltimaConferencia || '') // yyyy-MM-dd
  const [valorCombustivel, setValorCombustivel] = useState<string>(savedState?.valorCombustivel || '') // number as string
  const [kmPartida, setKmPartida] = useState<string>(savedState?.kmPartida || '') // number as string
  const [kmChegada, setKmChegada] = useState<string>(savedState?.kmChegada || '') // number as string
  const [totalKmEfectuados, setTotalKmEfectuados] = useState<string>(savedState?.totalKmEfectuados || '') // number as string
  const [totalKmConferidos, setTotalKmConferidos] = useState<string>(savedState?.totalKmConferidos || '') // number as string
  const [totalKmAConferir, setTotalKmAConferir] = useState<string>(savedState?.totalKmAConferir || '') // number as string
  const [horaInicio, setHoraInicio] = useState<string>(savedState?.horaInicio || '')
  const [horaFim, setHoraFim] = useState<string>(savedState?.horaFim || '')
  const [showUtilizacaoForm, setShowUtilizacaoForm] = useState<boolean>(savedState?.showUtilizacaoForm || false)
  const [editingUtilizacaoId, setEditingUtilizacaoId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [utilizacaoToDelete, setUtilizacaoToDelete] = useState<UtilizacaoDTO | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Marcar que o carregamento inicial foi concluído após o primeiro render
  // Usar um timeout para garantir que todos os estados iniciais foram carregados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Get funcionarios
  const { data: funcionariosData } = useGetFuncionarios()
  const funcionarios = funcionariosData?.info?.data || []

  // Get viaturas
  const { data: viaturasData } = useGetViaturasSelect()
  const viaturas = viaturasData || []

  // Get utilizacoes by date
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: utilizacoesData, refetch: refetchUtilizacoes } = useQuery<UtilizacaoDTO[] | null>({
    queryKey: ['utilizacoes-by-date', formattedDate],
    queryFn: async () => {
      if (!formattedDate) return null
      const response = await UtilizacoesService('utilizacao').getUtilizacoesByDate(formattedDate)
      return response.info?.data || []
    },
    enabled: !!formattedDate,
    staleTime: 30000,
  })
  const utilizacoes: UtilizacaoDTO[] = utilizacoesData || []

  // Hover fetch só para obter a contagem por dia (tooltip)
  const hoveredDateKey = hoveredDate ? format(hoveredDate, 'yyyy-MM-dd') : ''
  const { data: hoveredUtilizacoesData } = useQuery<UtilizacaoDTO[] | null>({
    queryKey: ['utilizacoes-by-date', hoveredDateKey],
    queryFn: async () => {
      if (!hoveredDateKey) return null
      const response = await UtilizacoesService('utilizacao').getUtilizacoesByDate(hoveredDateKey)
      return response.info?.data || []
    },
    enabled: !!hoveredDateKey && hoveredDateKey !== formattedDate,
    staleTime: 30000,
  })

  // Atualizar “heat counts” quando os dados chegam (TanStack v5 sem callbacks no hook)
  useEffect(() => {
    if (!formattedDate) return
    setCalendarDayCounts((prev) => {
      const count = utilizacoes.length
      return prev[formattedDate] === count ? prev : { ...prev, [formattedDate]: count }
    })
  }, [formattedDate, utilizacoes.length])

  // Atualizar contagem quando os dados do hover chegam
  useEffect(() => {
    if (!hoveredDateKey || hoveredDateKey === formattedDate) return
    const count = Array.isArray(hoveredUtilizacoesData) ? hoveredUtilizacoesData.length : 0
    setCalendarDayCounts((prev) => (prev[hoveredDateKey] === count ? prev : { ...prev, [hoveredDateKey]: count }))
  }, [hoveredDateKey, formattedDate, hoveredUtilizacoesData])

  // Prepare funcionarios options for Autocomplete with name and cargo
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

  // Salvar estado no localStorage quando mudar (exceto quando estiver editando)
  useEffect(() => {
    if (!editingUtilizacaoId) {
      const stateToSave: SavedState = {
        selectedDate: selectedDate?.toISOString(),
        currentMonth: currentMonth.toISOString(),
        selectedFuncionarioId,
        selectedViaturaId,
        dataUltimaConferencia,
        valorCombustivel,
        kmPartida,
        kmChegada,
        totalKmEfectuados,
        totalKmConferidos,
        totalKmAConferir,
        horaInicio,
        horaFim,
        showUtilizacaoForm,
      }
      saveStateToStorage(stateToSave)
    }
  }, [
    selectedDate,
    currentMonth,
    selectedFuncionarioId,
    selectedViaturaId,
    dataUltimaConferencia,
    valorCombustivel,
    kmPartida,
    kmChegada,
    totalKmEfectuados,
    totalKmConferidos,
    totalKmAConferir,
    horaInicio,
    horaFim,
    showUtilizacaoForm,
    editingUtilizacaoId,
  ])

  // Não resetar formulário - manter todos os campos após refresh
  // O formulário só será limpo manualmente pelo usuário ou ao cancelar

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  // Generate year options
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

  // Delete utilizacao mutation
  const deleteUtilizacaoMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Eliminando utilização:', id)
      try {
        const response = await UtilizacoesService('utilizacao').deleteUtilizacao(id)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao eliminar utilização:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Utilização eliminada com sucesso',
        'Erro ao eliminar utilização',
        'Utilização eliminada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['utilizacoes-by-date'] })
        refetchUtilizacoes()
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation de eliminação:', error)
      let errorMessage = 'Erro ao eliminar utilização'
      
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

  // Update utilizacao mutation
  const updateUtilizacaoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUtilizacaoDTO }) => {
      console.log('Atualizando utilização:', id, data)
      try {
        const response = await UtilizacoesService('utilizacao').updateUtilizacao(id, data)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao atualizar utilização:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Utilização atualizada com sucesso',
        'Erro ao atualizar utilização',
        'Utilização atualizada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['utilizacoes-by-date'] })
        refetchUtilizacoes()
        // Manter todos os campos - não limpar nada
        setShowUtilizacaoForm(false)
        setEditingUtilizacaoId(null)
        // Todos os campos permanecem preenchidos para facilitar criação de nova utilização
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation de atualização:', error)
      let errorMessage = 'Erro ao atualizar utilização'
      
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

  // Create utilizacao mutation
  const createUtilizacaoMutation = useMutation({
    mutationFn: async (data: CreateUtilizacaoDTO) => {
      console.log('Enviando dados para API:', data)
      try {
        const response = await UtilizacoesService('utilizacao').createUtilizacao(data)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao criar utilização:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      console.log('Resposta completa:', response)
      const result = handleApiResponse(
        response,
        'Utilização criada com sucesso',
        'Erro ao criar utilização',
        'Utilização criada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['utilizacoes-by-date'] })
        refetchUtilizacoes()
        // Manter todos os campos - não limpar nada
        setShowUtilizacaoForm(false)
        setEditingUtilizacaoId(null)
        // Todos os campos permanecem preenchidos para facilitar criação de nova utilização
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation:', error)
      console.error('Erro completo:', JSON.stringify(error, null, 2))
      
      // Try to extract error message from different possible structures
      let errorMessage = 'Erro ao criar utilização'
      
      if (error?.data?.info?.messages) {
        // Backend Response structure
        const messages = error.data.info.messages
        if (typeof messages === 'object') {
          const messageArray = Object.values(messages).flat()
          errorMessage = messageArray.join(', ') || errorMessage
        } else if (Array.isArray(messages)) {
          errorMessage = messages.join(', ') || errorMessage
        }
      } else if (error?.data?.info?.message) {
        errorMessage = error.data.info.message
      } else if (error?.data?.messages) {
        const messages = error.data.messages
        if (typeof messages === 'object') {
          const messageArray = Object.values(messages).flat()
          errorMessage = messageArray.join(', ') || errorMessage
        } else if (Array.isArray(messages)) {
          errorMessage = messages.join(', ') || errorMessage
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    },
  })

  const handleEditUtilizacao = (utilizacao: UtilizacaoDTO) => {
    // Definir o ID de edição primeiro para evitar que o useEffect feche o formulário
    setEditingUtilizacaoId(utilizacao.id)
    
    // Preencher o formulário com os dados da utilização
    // A data vem como string no formato 'yyyy-MM-dd', converter para Date
    const utilizacaoDate = utilizacao.dataUtilizacao ? new Date(utilizacao.dataUtilizacao) : new Date()
    setSelectedDate(utilizacaoDate)
    setCurrentMonth(utilizacaoDate) // Atualizar o mês do calendário também
    setSelectedFuncionarioId(utilizacao.funcionarioId)
    setSelectedViaturaId(utilizacao.viaturaId || '')
    setDataUltimaConferencia(
      utilizacao.dataUltimaConferencia ? utilizacao.dataUltimaConferencia.slice(0, 10) : ''
    )
    setValorCombustivel(
      typeof utilizacao.valorCombustivel === 'number' ? String(utilizacao.valorCombustivel) : ''
    )
    setKmPartida(typeof utilizacao.kmPartida === 'number' ? String(utilizacao.kmPartida) : '')
    setKmChegada(typeof utilizacao.kmChegada === 'number' ? String(utilizacao.kmChegada) : '')
    setTotalKmEfectuados(
      typeof utilizacao.totalKmEfectuados === 'number' ? String(utilizacao.totalKmEfectuados) : ''
    )
    setTotalKmConferidos(
      typeof utilizacao.totalKmConferidos === 'number' ? String(utilizacao.totalKmConferidos) : ''
    )
    setTotalKmAConferir(
      typeof utilizacao.totalKmAConferir === 'number' ? String(utilizacao.totalKmAConferir) : ''
    )
    setHoraInicio(utilizacao.horaInicio || '')
    setHoraFim(utilizacao.horaFim || '')
    
    // Abrir o formulário por último
    setShowUtilizacaoForm(true)
  }

  const handleCreateUtilizacao = () => {
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

    if (editingUtilizacaoId) {
      // Atualizar utilização existente
      const data: UpdateUtilizacaoDTO = {
        dataUtilizacao: format(selectedDate, 'yyyy-MM-dd'),
        dataUltimaConferencia: dataUltimaConferencia || undefined,
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId || undefined,
        horaInicio: horaInicio || undefined,
        horaFim: horaFim || undefined,
        valorCombustivel: valorCombustivel ? Number(valorCombustivel) : undefined,
        kmPartida: kmPartida ? Number(kmPartida) : undefined,
        kmChegada: kmChegada ? Number(kmChegada) : undefined,
        totalKmEfectuados: totalKmEfectuados ? Number(totalKmEfectuados) : undefined,
        totalKmConferidos: totalKmConferidos ? Number(totalKmConferidos) : undefined,
        totalKmAConferir: totalKmAConferir ? Number(totalKmAConferir) : undefined,
      }
      console.log('Atualizando utilização com dados:', data)
      updateUtilizacaoMutation.mutate({ id: editingUtilizacaoId, data })
    } else {
      // Criar nova utilização
      const data: CreateUtilizacaoDTO = {
        dataUtilizacao: format(selectedDate, 'yyyy-MM-dd'),
        dataUltimaConferencia: dataUltimaConferencia || undefined,
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId || undefined,
        horaInicio: horaInicio || undefined,
        horaFim: horaFim || undefined,
        valorCombustivel: valorCombustivel ? Number(valorCombustivel) : undefined,
        kmPartida: kmPartida ? Number(kmPartida) : undefined,
        kmChegada: kmChegada ? Number(kmChegada) : undefined,
        totalKmEfectuados: totalKmEfectuados ? Number(totalKmEfectuados) : undefined,
        totalKmConferidos: totalKmConferidos ? Number(totalKmConferidos) : undefined,
        totalKmAConferir: totalKmAConferir ? Number(totalKmAConferir) : undefined,
      }
      console.log('Criando utilização com dados:', data)
      createUtilizacaoMutation.mutate(data)
    }
  }

  const handleAddUtilizacao = () => {
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
    setShowUtilizacaoForm(true)
  }

  const handleCancelUtilizacao = () => {
    setShowUtilizacaoForm(false)
    setEditingUtilizacaoId(null)
    setSelectedViaturaId('')
    setDataUltimaConferencia('')
    setValorCombustivel('')
    setKmPartida('')
    setKmChegada('')
    setTotalKmEfectuados('')
    setTotalKmConferidos('')
    setTotalKmAConferir('')
    setHoraInicio('')
    setHoraFim('')
    // Não limpar localStorage ao cancelar, para manter os campos principais (funcionário, viatura, data)
  }

  const handleDeleteUtilizacao = (utilizacao: UtilizacaoDTO) => {
    setUtilizacaoToDelete(utilizacao)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (utilizacaoToDelete) {
      deleteUtilizacaoMutation.mutate(utilizacaoToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setUtilizacaoToDelete(null)
        },
      })
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setUtilizacaoToDelete(null)
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
    const isThisHovered = !!hoveredDateKey && key === hoveredDateKey
    const tooltipDateLabel = date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: pt }) : ''

    return (
      <Tooltip open={isThisHovered}>
        <TooltipTrigger asChild>
          <button
            {...props}
            type='button'
            onMouseEnter={(e) => {
              props?.onMouseEnter?.(e)
              if (date) setHoveredDate(date)
            }}
            onMouseLeave={(e) => {
              props?.onMouseLeave?.(e)
              setHoveredDate(undefined)
            }}
            onPointerEnter={(e) => {
              props?.onPointerEnter?.(e)
              if (date) setHoveredDate(date)
            }}
            onPointerLeave={(e) => {
              props?.onPointerLeave?.(e)
              setHoveredDate(undefined)
            }}
            onBlur={(e) => {
              props?.onBlur?.(e)
              setHoveredDate(undefined)
            }}
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

              {/* Dots/heat (quando já existe contagem no cache) */}
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
        </TooltipTrigger>
        <TooltipContent side='bottom' className='border bg-popover text-popover-foreground shadow-md'>
          <div className='font-semibold text-xs'>{tooltipDateLabel}</div>
          <div className='text-[11px] opacity-90'>
            {`${count} utilização(ões) neste dia`}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }, [calendarDayCounts, hoveredDateKey, formattedDate])

  const calendarComponents = useMemo(() => {
    // Tipagem do react-day-picker varia entre versões; mantemos isto flexível.
    return { DayButton: CalendarDayButton } as unknown as Record<string, any>
  }, [CalendarDayButton])

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Utilizações | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Frotas',
            link: '/frotas',
          },
          {
            title: 'Utilizações',
            link: '/frotas/utilizacoes',
          },
        ]}
      />

      <div className='mt-10'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Calendário Profissional do lado esquerdo */}
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
                {/* Navegação de Mês e Ano - Design Moderno */}
                <div className='mb-2.5 pb-2.5 border-b border-border/50'>
                  <div className='flex items-center justify-between gap-3'>
                    {/* Botão Anterior */}
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handlePreviousMonth}
                      className='h-7 w-7 rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow'
                    >
                      <ChevronLeft className='h-3.5 w-3.5' />
                    </Button>

                    {/* Seletores de Mês e Ano */}
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

                    {/* Botão Próximo */}
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

                {/* Calendário */}
                <div className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-background via-background to-muted/30 shadow-[0_10px_40px_-22px_rgba(0,0,0,0.45)]'>
                  {/* assinatura visual (auras + pattern subtil) */}
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

                  <TooltipProvider delayDuration={40}>
                    <div className='p-1.5' onMouseLeave={() => setHoveredDate(undefined)} onPointerLeave={() => setHoveredDate(undefined)}>
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
                  </TooltipProvider>
                </div>

                {/* Informação da data selecionada */}
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

            {/* Mini Secção - Viatura */}
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

            {/* Mini Secção - Funcionário */}
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

          {/* Espaço do lado direito - Formulário de Utilização */}
          <div className='lg:col-span-2'>
            <Card className='shadow-lg h-full border-l-4 border-l-primary/50'>
              <CardHeader className='pb-4 border-b'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='rounded-lg bg-primary/10 p-2.5'>
                      <CalendarDays className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-lg font-semibold mb-1'>Utilizações</CardTitle>
                      {selectedDate && (
                        <div className='flex items-center gap-2'>
                          <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border/50'>
                            <Clock className='h-3 w-3 text-muted-foreground' />
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
                  {selectedDate && !showUtilizacaoForm && (
                    <Button
                      onClick={handleAddUtilizacao}
                      disabled={!selectedFuncionarioId || !selectedViaturaId}
                      className='h-8 text-xs font-semibold px-4 mt-7'
                      size='sm'
                    >
                      <CalendarPlus className='h-3.5 w-3.5 mr-1.5' />
                      Adicionar Utilização
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  !showUtilizacaoForm ? (
                    <div className='space-y-3'>
                      {utilizacoes.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 px-4'>
                          <div className='rounded-full bg-primary/10 p-6 mb-6'>
                            <CalendarDays className='h-12 w-12 text-primary' />
                          </div>
                          <h3 className='text-lg font-semibold mb-2 text-foreground'>Nenhuma utilização encontrada</h3>
                          <p className='text-sm text-muted-foreground text-center max-w-md leading-relaxed'>
                            Não existem utilizações registadas para esta data.
                            {selectedFuncionarioId && selectedViaturaId ? (
                              <> Clique no botão "Adicionar Utilização" acima para criar a primeira utilização.</>
                            ) : (
                              <> Selecione um funcionário e uma viatura no painel lateral para começar a adicionar utilizações.</>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className='space-y-2.5'>
                          {utilizacoes.map((utilizacao, index) => (
                            <Card
                              key={utilizacao.id}
                              className={`border hover:border-primary/30 hover:shadow-sm transition-all duration-200 ${index === 0 ? 'mt-3' : ''}`}
                            >
                              <CardContent className='p-3.5'>
                                <div className='flex items-center justify-between gap-4'>
                                  {/* Funcionário */}
                                  <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                                    <div className='rounded-md bg-primary/10 p-1.5 flex-shrink-0'>
                                      <User className='h-4 w-4 text-primary' />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-xs font-medium text-muted-foreground mb-1'>Funcionário</p>
                                      <div className='border-t border-border/50 pt-1'>
                                        <p className='text-sm font-semibold text-foreground truncate'>
                                          {utilizacao.funcionario?.nome || 'Funcionário não encontrado'}
                                        </p>
                                        {utilizacao.funcionario?.cargo?.designacao && (
                                          <p className='text-xs text-muted-foreground truncate mt-0.5'>
                                            {utilizacao.funcionario.cargo.designacao}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Viatura */}
                                  {utilizacao.viatura && (
                                    <div className='flex items-start gap-2 min-w-0 flex-shrink-0 w-32'>
                                      <Car className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Viatura</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm font-semibold text-foreground truncate'>
                                            {utilizacao.viatura.matricula}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Horário */}
                                  {(utilizacao.horaInicio || utilizacao.horaFim) && (
                                    <div className='flex items-start gap-2 min-w-0 flex-shrink-0 w-28'>
                                      <Clock className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Horário</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm font-semibold text-foreground whitespace-nowrap'>
                                            {utilizacao.horaInicio && utilizacao.horaFim
                                              ? `${utilizacao.horaInicio} - ${utilizacao.horaFim}`
                                              : utilizacao.horaInicio || utilizacao.horaFim}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Botões de Ação */}
                                  <div className='flex items-center gap-1.5 flex-shrink-0'>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='h-8 w-8 p-0'
                                      title='Editar Utilização'
                                      onClick={() => handleEditUtilizacao(utilizacao)}
                                    >
                                      <Edit className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:border-destructive'
                                      title='Eliminar Utilização'
                                      onClick={() => handleDeleteUtilizacao(utilizacao)}
                                      disabled={deleteUtilizacaoMutation.isPending}
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
                        {/* Primeira linha: Data da Última Conferência (primeiro campo) */}
                        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                          <div className='space-y-1 col-span-2 md:col-span-2'>
                            <Label htmlFor='data-ultima-conferencia' className='text-xs font-medium flex items-center gap-1.5'>
                              <CalendarDays className='h-3 w-3' />
                              Últ. Conferência
                            </Label>
                            <Input
                              id='data-ultima-conferencia'
                              type='date'
                              value={dataUltimaConferencia}
                              onChange={(e) => setDataUltimaConferencia(e.target.value)}
                              className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>
                        </div>

                        {/* Separador */}
                        <div className='my-3 h-px bg-border/60' />

                        {/* Linha seguinte: Viatura + Horas (lado a lado) */}
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

                          <div className='space-y-1 lg:col-span-1'>
                            <Label htmlFor='hora-inicio' className='text-xs font-medium flex items-center gap-1.5'>
                              <Clock className='h-3 w-3' />
                              Início
                            </Label>
                            <TimePicker value={horaInicio} onChange={setHoraInicio} />
                          </div>

                          <div className='space-y-1 lg:col-span-1'>
                            <Label htmlFor='hora-fim' className='text-xs font-medium flex items-center gap-1.5'>
                              <Clock className='h-3 w-3' />
                              Fim
                            </Label>
                            <TimePicker value={horaFim} onChange={setHoraFim} />
                          </div>
                        </div>

                        {/* Separador */}
                        <div className='my-3 h-px bg-border/60' />

                        {/* Grid denso: tudo em 2-5 colunas consoante largura */}
                        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>

                          <div className='space-y-1 col-span-2 md:col-span-2 lg:col-span-2'>
                            <Label htmlFor='valor-combustivel' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <Fuel className='h-3 w-3 text-muted-foreground' />
                              Combustível
                            </Label>
                            <Input
                              id='valor-combustivel'
                              type='number'
                              inputMode='decimal'
                              value={valorCombustivel}
                              onChange={(e) => setValorCombustivel(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                                className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>

                          <div className='space-y-1 col-span-1 md:col-span-1'>
                            <Label htmlFor='km-partida' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <Gauge className='h-3 w-3 text-muted-foreground' />
                              Km Partida
                            </Label>
                            <Input
                              id='km-partida'
                              type='number'
                              inputMode='numeric'
                              value={kmPartida}
                              onChange={(e) => setKmPartida(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                                className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>

                          <div className='space-y-1 col-span-1 md:col-span-1'>
                            <Label htmlFor='km-chegada' className='text-xs font-medium inline-flex items-center gap-1.5'>
                              <Gauge className='h-3 w-3 text-muted-foreground' />
                              Km Chegada
                            </Label>
                            <Input
                              id='km-chegada'
                              type='number'
                              inputMode='numeric'
                              value={kmChegada}
                              onChange={(e) => setKmChegada(parseNumberOrEmpty(e.target.value))}
                              placeholder='0'
                                className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                            />
                          </div>

                          {/* Separador */}
                          <div className='col-span-2 md:col-span-4 lg:col-span-6 h-px bg-border/60 my-1' />

                          <div className='col-span-2 md:col-span-4 lg:col-span-6'>
                            <div className='text-xs font-semibold text-muted-foreground mb-1 inline-flex items-center gap-1.5'>
                              <Route className='h-3 w-3 opacity-70' />
                              Total Km
                            </div>
                            <div className='grid grid-cols-3 gap-2'>
                              <div className='space-y-1'>
                                <Label htmlFor='total-km-efectuados' className='text-xs font-medium'>
                                  Efectuados
                                </Label>
                                <Input
                                  id='total-km-efectuados'
                                  type='number'
                                  inputMode='numeric'
                                  value={totalKmEfectuados}
                                  onChange={(e) => setTotalKmEfectuados(parseNumberOrEmpty(e.target.value))}
                                  placeholder='0'
                                  className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                                />
                              </div>

                              <div className='space-y-1'>
                                <Label htmlFor='total-km-conferidos' className='text-xs font-medium'>
                                  Conferidos
                                </Label>
                                <Input
                                  id='total-km-conferidos'
                                  type='number'
                                  inputMode='numeric'
                                  value={totalKmConferidos}
                                  onChange={(e) => setTotalKmConferidos(parseNumberOrEmpty(e.target.value))}
                                  placeholder='0'
                                  className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                                />
                              </div>

                              <div className='space-y-1'>
                                <Label htmlFor='total-km-a-conferir' className='text-xs font-medium'>
                                  A conferir
                                </Label>
                                <Input
                                  id='total-km-a-conferir'
                                  type='number'
                                  inputMode='numeric'
                                  value={totalKmAConferir}
                                  onChange={(e) => setTotalKmAConferir(parseNumberOrEmpty(e.target.value))}
                                  placeholder='0'
                                  className='h-9 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-sm px-3 py-2'
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className='mt-3 flex gap-2'>
                          <Button
                            onClick={handleCancelUtilizacao}
                            variant='outline'
                            className='flex-1 h-8 text-xs font-semibold'
                            size='sm'
                          >
                            Cancelar
                          </Button>
                          <Button
                            type='button'
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Botão clicado!')
                              handleCreateUtilizacao()
                            }}
                            disabled={createUtilizacaoMutation.isPending || updateUtilizacaoMutation.isPending}
                            className='flex-1 h-8 text-xs font-semibold'
                            size='sm'
                          >
                            {createUtilizacaoMutation.isPending || updateUtilizacaoMutation.isPending
                              ? (editingUtilizacaoId ? 'A atualizar...' : 'A criar...')
                              : editingUtilizacaoId
                                ? 'Atualizar Utilização'
                                : 'Criar Utilização'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CalendarIcon className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm font-medium mb-1'>Selecione uma data</p>
                    <p className='text-xs'>no calendário para criar uma utilização</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmação para Eliminar Utilização */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Utilização</AlertDialogTitle>
            <AlertDialogDescription>
              {utilizacaoToDelete && (
                <>
                  Tem a certeza que deseja eliminar a utilização de{' '}
                  <span className='font-semibold text-foreground'>
                    {utilizacaoToDelete.funcionario?.nome || 'esta utilização'}
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
              disabled={deleteUtilizacaoMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteUtilizacaoMutation.isPending ? 'A eliminar...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

