import { useState, useEffect, useRef, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, getYear, getMonth } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Eye, Plus, Clock, Car, FileText } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGetViaturasSelect } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { ReservasOficinasService } from '@/lib/services/frotas/reservas-oficinas-service'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CreateReservaOficinaDTO, ReservaOficinaDTO, UpdateReservaOficinaDTO } from '@/types/dtos/frotas/reservas-oficinas.dtos'
import { CalendarDays, Trash2, Edit, CalendarPlus } from 'lucide-react'
import { handleApiResponse } from '@/utils/response-handlers'
import { ResponseStatus } from '@/types/api/responses'
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
            className='h-10 border hover:border-primary/50 transition-colors rounded-md shadow-inner text-xs px-3 py-2.5 pl-10 cursor-pointer'
            readOnly
            onClick={() => setOpen(true)}
          />
          <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
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

export function ReservasOficinasPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string>('')
  const [selectedViaturaId, setSelectedViaturaId] = useState<string>('')
  const [horaInicio, setHoraInicio] = useState<string>('')
  const [horaFim, setHoraFim] = useState<string>('')
  const [causa, setCausa] = useState<string>('')
  const [showReservaForm, setShowReservaForm] = useState<boolean>(false)
  const [editingReservaId, setEditingReservaId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [reservaToDelete, setReservaToDelete] = useState<ReservaOficinaDTO | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Get funcionarios
  const { data: funcionariosData, isLoading: isLoadingFuncionarios } = useGetFuncionarios()
  const funcionarios = funcionariosData?.info?.data || []

  // Get viaturas
  const { data: viaturasData, isLoading: isLoadingViaturas } = useGetViaturasSelect()
  const viaturas = viaturasData || []

  // Get reservas by date
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: reservasData, isLoading: isLoadingReservas, refetch: refetchReservas } = useQuery({
    queryKey: ['reservas-oficinas-by-date', formattedDate],
    queryFn: async () => {
      if (!formattedDate) return null
      const response = await ReservasOficinasService('reserva-oficina').getReservasOficinasByDate(formattedDate)
      return response.info?.data || []
    },
    enabled: !!formattedDate,
    staleTime: 30000,
  })
  const reservas = reservasData || []

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

  // Reset form when date or funcionario changes (only if not editing)
  useEffect(() => {
    if (!editingReservaId) {
      setShowReservaForm(false)
      setSelectedViaturaId('')
      setHoraInicio('')
      setHoraFim('')
      setCausa('')
    }
  }, [selectedDate, selectedFuncionarioId, editingReservaId])

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

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

  // Delete reserva mutation
  const deleteReservaMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Eliminando reserva:', id)
      try {
        const response = await ReservasOficinasService('reserva-oficina').deleteReservaOficina(id)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao eliminar reserva:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Reserva de oficina eliminada com sucesso',
        'Erro ao eliminar reserva de oficina',
        'Reserva de oficina eliminada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['reservas-oficinas-by-date'] })
        refetchReservas()
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation de eliminação:', error)
      let errorMessage = 'Erro ao eliminar reserva de oficina'
      
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

  // Update reserva mutation
  const updateReservaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReservaOficinaDTO }) => {
      console.log('Atualizando reserva:', id, data)
      try {
        const response = await ReservasOficinasService('reserva-oficina').updateReservaOficina(id, data)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao atualizar reserva:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      const result = handleApiResponse(
        response,
        'Reserva de oficina atualizada com sucesso',
        'Erro ao atualizar reserva de oficina',
        'Reserva de oficina atualizada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['reservas-oficinas-by-date'] })
        refetchReservas()
        // Reset form
        setShowReservaForm(false)
        setEditingReservaId(null)
        setSelectedViaturaId('')
        setHoraInicio('')
        setHoraFim('')
        setCausa('')
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation de atualização:', error)
      let errorMessage = 'Erro ao atualizar reserva de oficina'
      
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

  // Create reserva mutation
  const createReservaMutation = useMutation({
    mutationFn: async (data: CreateReservaOficinaDTO) => {
      console.log('Enviando dados para API:', data)
      try {
        const response = await ReservasOficinasService('reserva-oficina').createReservaOficina(data)
        console.log('Resposta da API:', response)
        return response
      } catch (error) {
        console.error('Erro ao criar reserva:', error)
        throw error
      }
    },
    onSuccess: (response) => {
      console.log('Resposta completa:', response)
      const result = handleApiResponse(
        response,
        'Reserva de oficina criada com sucesso',
        'Erro ao criar reserva de oficina',
        'Reserva de oficina criada com avisos'
      )
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['reservas-oficinas-by-date'] })
        refetchReservas()
        // Reset form
        setShowReservaForm(false)
        setEditingReservaId(null)
        setSelectedViaturaId('')
        setHoraInicio('')
        setHoraFim('')
        setCausa('')
      }
    },
    onError: (error: any) => {
      console.error('Erro na mutation:', error)
      console.error('Erro completo:', JSON.stringify(error, null, 2))
      
      // Try to extract error message from different possible structures
      let errorMessage = 'Erro ao criar reserva de oficina'
      
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

  const handleEditReserva = (reserva: ReservaOficinaDTO) => {
    // Definir o ID de edição primeiro para evitar que o useEffect feche o formulário
    setEditingReservaId(reserva.id)
    
    // Preencher o formulário com os dados da reserva
    // A data vem como string no formato 'yyyy-MM-dd', converter para Date
    const reservaDate = reserva.dataReserva ? new Date(reserva.dataReserva) : new Date()
    setSelectedDate(reservaDate)
    setCurrentMonth(reservaDate) // Atualizar o mês do calendário também
    setSelectedFuncionarioId(reserva.funcionarioId)
    setSelectedViaturaId(reserva.viaturaId || '')
    setHoraInicio(reserva.horaInicio || '')
    setHoraFim(reserva.horaFim || '')
    setCausa(reserva.causa || '')
    
    // Abrir o formulário por último
    setShowReservaForm(true)
  }

  const handleCreateReserva = () => {
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data')
      return
    }
    if (!selectedFuncionarioId) {
      toast.error('Por favor, selecione um funcionário')
      return
    }

    if (editingReservaId) {
      // Atualizar reserva existente
      const data: UpdateReservaOficinaDTO = {
        dataReserva: format(selectedDate, 'yyyy-MM-dd'),
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId || undefined,
        horaInicio: horaInicio || undefined,
        horaFim: horaFim || undefined,
        causa: causa || undefined,
      }
      console.log('Atualizando reserva com dados:', data)
      updateReservaMutation.mutate({ id: editingReservaId, data })
    } else {
      // Criar nova reserva
      const data: CreateReservaOficinaDTO = {
        dataReserva: format(selectedDate, 'yyyy-MM-dd'),
        funcionarioId: selectedFuncionarioId,
        viaturaId: selectedViaturaId || undefined,
        horaInicio: horaInicio || undefined,
        horaFim: horaFim || undefined,
        causa: causa || undefined,
      }
      console.log('Criando reserva com dados:', data)
      createReservaMutation.mutate(data)
    }
  }

  const handleAddReserva = () => {
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data')
      return
    }
    if (!selectedFuncionarioId) {
      toast.error('Por favor, selecione um funcionário')
      return
    }
    setShowReservaForm(true)
  }

  const handleCancelReserva = () => {
    setShowReservaForm(false)
    setEditingReservaId(null)
    setSelectedViaturaId('')
    setHoraInicio('')
    setHoraFim('')
    setCausa('')
  }

  const handleDeleteReserva = (reserva: ReservaOficinaDTO) => {
    setReservaToDelete(reserva)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (reservaToDelete) {
      deleteReservaMutation.mutate(reservaToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setReservaToDelete(null)
        },
      })
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setReservaToDelete(null)
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Reservas de Oficinas | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Frotas',
            link: '/frotas',
          },
          {
            title: 'Reservas de Oficinas',
            link: '/frotas/reservas-oficinas',
          },
        ]}
      />

      <div className='mt-10'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Calendário Profissional do lado esquerdo */}
          <div className='lg:col-span-1'>
            <Card className='shadow-lg border-l-4 border-l-primary/50'>
              <CardHeader className='pb-1.5'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2.5'>
                    <div className='rounded-lg bg-primary/10 p-2'>
                      <CalendarIcon className='h-4 w-4 text-primary' />
                    </div>
                    <CardTitle className='text-sm font-semibold'>
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
              <CardContent className='pt-0 pb-3'>
                {/* Navegação de Mês e Ano - Design Moderno */}
                <div className='mb-3 pb-3 border-b border-border/50'>
                  <div className='flex items-center justify-between gap-3'>
                    {/* Botão Anterior */}
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handlePreviousMonth}
                      className='h-8 w-8 rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow'
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
                          <SelectTrigger className='h-8 w-full text-xs font-semibold border-2 hover:border-primary/50 transition-colors rounded-lg shadow-sm'>
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
                          <SelectTrigger className='h-8 w-full text-xs font-semibold border-2 hover:border-primary/50 transition-colors rounded-lg shadow-sm'>
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
                      className='h-8 w-8 rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow'
                    >
                      <ChevronRight className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </div>

                {/* Calendário */}
                <div className='bg-background rounded-lg'>
                  <Calendar
                    mode='single'
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    locale={pt}
                    className='rounded-md'
                    classNames={{
                      months: 'flex flex-col space-y-4',
                      month: 'space-y-4',
                      month_caption: 'hidden',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      button_previous: 'hidden',
                      button_next: 'hidden',
                      month_grid: 'w-full border-collapse space-y-1',
                      weekdays: 'flex w-full -mt-2',
                      weekday:
                        'text-muted-foreground rounded-md flex-1 h-9 flex items-center justify-center font-semibold text-sm',
                      week: 'flex w-full mt-1',
                      day: 'flex-1 h-9 text-center text-sm p-0 relative rounded-md hover:bg-accent transition-colors flex items-center justify-center',
                      day_button:
                        'w-full h-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center',
                      selected:
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold',
                      today: 'bg-accent/20 text-foreground',
                      outside:
                        'day-outside text-muted-foreground opacity-50',
                      disabled: 'text-muted-foreground opacity-50',
                    }}
                  />
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

            {/* Mini Secção - Funcionário */}
            <Card className='shadow-lg mt-2 border-l-4 border-l-primary/50'>
              <CardHeader className='pb-2'>
                <div className='flex items-center gap-2.5'>
                  <div className='rounded-lg bg-primary/10 p-2'>
                    <User className='h-4 w-4 text-primary' />
                  </div>
                  <CardTitle className='text-sm font-semibold'>
                    Funcionário
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='pb-3'>
                <div className='relative'>
                  <Autocomplete
                    options={funcionarioOptions}
                    value={selectedFuncionarioId}
                    onValueChange={setSelectedFuncionarioId}
                    placeholder='Selecione ou pesquise funcionário'
                    emptyText='Nenhum funcionário encontrado.'
                    className='h-10 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-xs px-3 py-2.5 pr-20'
                    defaultVisibleCount={8}
                  />
                  <div className='absolute right-9 top-1/2 -translate-y-1/2 flex gap-0.5 z-10'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleViewFuncionario}
                      className='h-6 w-6 p-0 hover:bg-accent'
                      title='Ver Funcionário'
                      disabled={!selectedFuncionarioId}
                    >
                      <Eye className='h-3 w-3' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleCreateFuncionario}
                      className='h-6 w-6 p-0 hover:bg-accent'
                      title='Criar Funcionário'
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Espaço do lado direito - Formulário de Reserva */}
          <div className='lg:col-span-2'>
            <Card className='shadow-lg h-full border-l-4 border-l-primary/50'>
              <CardHeader className='pb-4 border-b'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='rounded-lg bg-primary/10 p-2.5'>
                      <CalendarDays className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-lg font-semibold mb-1'>Reservas de Oficina</CardTitle>
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
                  {selectedDate && !showReservaForm && (
                    <Button
                      onClick={handleAddReserva}
                      disabled={!selectedFuncionarioId}
                      className='h-8 text-xs font-semibold px-4 mt-7'
                      size='sm'
                    >
                      <CalendarPlus className='h-3.5 w-3.5 mr-1.5' />
                      Adicionar Reserva
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  !showReservaForm ? (
                    <div className='space-y-3'>
                      {reservas.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 px-4'>
                          <div className='rounded-full bg-primary/10 p-6 mb-6'>
                            <CalendarDays className='h-12 w-12 text-primary' />
                          </div>
                          <h3 className='text-lg font-semibold mb-2 text-foreground'>Nenhuma reserva encontrada</h3>
                          <p className='text-sm text-muted-foreground text-center max-w-md leading-relaxed'>
                            Não existem reservas de oficina registadas para esta data.
                            {selectedFuncionarioId ? (
                              <> Clique no botão "Adicionar Reserva" acima para criar a primeira reserva.</>
                            ) : (
                              <> Selecione um funcionário no painel lateral para começar a adicionar reservas.</>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className='space-y-2.5'>
                          {reservas.map((reserva, index) => (
                            <Card
                              key={reserva.id}
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
                                          {reserva.funcionario?.nome || 'Funcionário não encontrado'}
                                        </p>
                                        {reserva.funcionario?.cargo?.designacao && (
                                          <p className='text-xs text-muted-foreground truncate mt-0.5'>
                                            {reserva.funcionario.cargo.designacao}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Viatura */}
                                  {reserva.viatura && (
                                    <div className='flex items-start gap-2 min-w-0 flex-shrink-0 w-32'>
                                      <Car className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Viatura</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm font-semibold text-foreground truncate'>
                                            {reserva.viatura.matricula}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Horário */}
                                  {(reserva.horaInicio || reserva.horaFim) && (
                                    <div className='flex items-start gap-2 min-w-0 flex-shrink-0 w-28'>
                                      <Clock className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Horário</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm font-semibold text-foreground whitespace-nowrap'>
                                            {reserva.horaInicio && reserva.horaFim
                                              ? `${reserva.horaInicio} - ${reserva.horaFim}`
                                              : reserva.horaInicio || reserva.horaFim}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Causa */}
                                  {reserva.causa && (
                                    <div className='flex items-start gap-2 min-w-0 flex-1 max-w-xs'>
                                      <FileText className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1' />
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-medium text-muted-foreground mb-1'>Causa</p>
                                        <div className='border-t border-border/50 pt-1'>
                                          <p className='text-sm text-foreground truncate' title={reserva.causa}>
                                            {reserva.causa}
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
                                      title='Editar Reserva'
                                      onClick={() => handleEditReserva(reserva)}
                                    >
                                      <Edit className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:border-destructive'
                                      title='Eliminar Reserva'
                                      onClick={() => handleDeleteReserva(reserva)}
                                      disabled={deleteReservaMutation.isPending}
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
                    <div className='flex items-center justify-center min-h-[400px] py-8'>
                      <div className='w-full max-w-2xl space-y-4'>
                        {/* Campo Viatura */}
                        <div className='space-y-1.5'>
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
                              placeholder={isLoadingViaturas ? 'A carregar...' : 'Selecione ou pesquise viatura'}
                              emptyText='Nenhuma viatura encontrada.'
                              disabled={isLoadingViaturas}
                              className='h-10 border hover:border-primary/50 transition-colors rounded-md shadow-sm text-xs pl-10 pr-20 py-2.5'
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

                        {/* Campos de Hora - Grid */}
                        <div className='grid grid-cols-2 gap-3'>
                          {/* Campo Hora Inicio */}
                          <div className='space-y-1.5'>
                            <Label htmlFor='hora-inicio' className='text-xs font-medium flex items-center gap-1.5'>
                              <Clock className='h-3 w-3' />
                              Hora Início
                            </Label>
                            <TimePicker value={horaInicio} onChange={setHoraInicio} />
                          </div>

                          {/* Campo Hora Fim */}
                          <div className='space-y-1.5'>
                            <Label htmlFor='hora-fim' className='text-xs font-medium flex items-center gap-1.5'>
                              <Clock className='h-3 w-3' />
                              Hora Fim
                            </Label>
                            <TimePicker value={horaFim} onChange={setHoraFim} />
                          </div>
                        </div>

                      {/* Campo Causa */}
                      <div className='space-y-1.5'>
                        <Label htmlFor='causa' className='text-xs font-medium flex items-center gap-1.5'>
                          <FileText className='h-3 w-3' />
                          Causa
                        </Label>
                        <Textarea
                          id='causa'
                          value={causa}
                          onChange={(e) => setCausa(e.target.value)}
                          placeholder='Descreva a causa da reserva'
                          rows={5}
                          className='shadow-inner drop-shadow-xl resize-none pr-3 text-xs border hover:border-primary/50 transition-colors rounded-md'
                        />
                      </div>

                        {/* Botões Criar/Cancelar Reserva */}
                        <div className='pt-1 flex gap-2'>
                          <Button
                            onClick={handleCancelReserva}
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
                              handleCreateReserva()
                            }}
                            disabled={createReservaMutation.isPending || updateReservaMutation.isPending}
                            className='flex-1 h-8 text-xs font-semibold'
                            size='sm'
                          >
                            {createReservaMutation.isPending || updateReservaMutation.isPending
                              ? (editingReservaId ? 'A atualizar...' : 'A criar...')
                              : editingReservaId
                                ? 'Atualizar Reserva'
                                : 'Criar Reserva'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CalendarIcon className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm font-medium mb-1'>Selecione uma data</p>
                    <p className='text-xs'>no calendário para criar uma reserva</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmação para Eliminar Reserva */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Reserva de Oficina</AlertDialogTitle>
            <AlertDialogDescription>
              {reservaToDelete && (
                <>
                  Tem a certeza que deseja eliminar a reserva de{' '}
                  <span className='font-semibold text-foreground'>
                    {reservaToDelete.funcionario?.nome || 'esta reserva'}
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
              disabled={deleteReservaMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteReservaMutation.isPending ? 'A eliminar...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
