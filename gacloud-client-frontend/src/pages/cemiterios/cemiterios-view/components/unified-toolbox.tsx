import { useState, useEffect, useCallback } from 'react'
import { SepulturaEstado } from '@/types/enums/sepultura-estado.enum'
import FilterListIcon from '@mui/icons-material/FilterList'
import PanToolIcon from '@mui/icons-material/PanTool'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { IconButton, Tooltip, Collapse } from '@mui/material'
import { cn } from '@/lib/utils'
import { Button as ShadcnButton } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useGetSepulturasTiposSelect } from '../../sepulturas-tipos/queries/sepulturas-tipos-queries'
import { useGetSepulturasSelect } from '../../sepulturas/queries/sepulturas-queries'

interface FilterState {
  showWithRelationId: boolean
  showWithoutRelationId: boolean
  selectedRelationIds: string[]
  // Advanced filters
  nome: string
  sepulturaTipoId: string
  sepulturaEstadoId: string
}

interface UnifiedToolboxProps {
  // Control props
  scale: number
  isPanning: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onTogglePanning: () => void
  onReset: () => void

  // Filter props
  svgElement: SVGElement | null
  onFilterChange: (filteredShapes: SVGElement[]) => void
  onShapeHighlight: (shapeIds: string[]) => void
  onClearHighlights: () => void
  filteredCount: number
  totalSepulturas: number
}

export function UnifiedToolbox({
  // Control props
  isPanning,
  onZoomIn,
  onZoomOut,
  onTogglePanning,
  onReset,

  // Filter props
  svgElement,
  onFilterChange,
  onClearHighlights,
  filteredCount,
  totalSepulturas,
}: UnifiedToolboxProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    showWithRelationId: false,
    showWithoutRelationId: false,
    selectedRelationIds: [],
    nome: '',
    sepulturaTipoId: '',
    sepulturaEstadoId: '',
  })
  const [availableRelationIds, setAvailableRelationIds] = useState<string[]>([])

  const { data: sepulturasResponse } = useGetSepulturasSelect()
  const { data: sepulturaTipos } = useGetSepulturasTiposSelect()

  // Extract all relation IDs from the SVG (only from sepulturas)
  const extractRelationIds = useCallback(() => {
    if (!svgElement) return []

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    const relationIds = new Set<string>()

    shapes.forEach((shape) => {
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
      // Only consider sepulturas
      if (shapeType === 'sepultura') {
        const relationId = shape.getAttribute('data-relation-id')
        if (relationId && relationId.trim() !== '') {
          relationIds.add(relationId)
        }
      }
    })

    return Array.from(relationIds).sort()
  }, [svgElement])

  // Apply filters to SVG elements
  const applyFilters = useCallback(() => {
    if (!svgElement) return

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    const filteredShapes: SVGElement[] = []

    // Get all sepulturas for advanced filtering
    const allSepulturas = sepulturasResponse || []

    // Apply advanced filters to sepulturas
    const filteredSepulturas = allSepulturas.filter((sepultura) => {
      // Nome filter
      if (
        filterState.nome &&
        !sepultura.nome.toLowerCase().includes(filterState.nome.toLowerCase())
      ) {
        return false
      }

      // Tipo filter
      if (
        filterState.sepulturaTipoId &&
        sepultura.sepulturaTipoId !== filterState.sepulturaTipoId
      ) {
        return false
      }

      // Estado filter
      if (
        filterState.sepulturaEstadoId &&
        sepultura.sepulturaEstadoId !== parseInt(filterState.sepulturaEstadoId)
      ) {
        return false
      }

      return true
    })

    // Create a set of filtered sepultura IDs for faster lookup
    const filteredSepulturaIds = new Set(filteredSepulturas.map((s) => s.id))
    const filteredSepulturaShapeIds = new Set(
      filteredSepulturas
        .filter((s) => s.shapeId && s.shapeId.trim() !== '')
        .map((s) => s.shapeId!)
    )

    shapes.forEach((shape) => {
      const relationId = shape.getAttribute('data-relation-id')
      const shapeId = shape.getAttribute('data-id')
      const hasRelationId = relationId && relationId.trim() !== ''
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()

      // Only filter sepulturas - other shapes always show
      if (shapeType !== 'sepultura') {
        filteredShapes.push(shape as SVGElement)
        return
      }

      let shouldShow = false

      // Check if this shape corresponds to a filtered sepultura
      const hasMatchingSepultura =
        (relationId && filteredSepulturaIds.has(relationId)) ||
        (shapeId && filteredSepulturaShapeIds.has(shapeId))

      // If we have advanced filters active, only show shapes that match
      if (
        filterState.nome ||
        filterState.sepulturaTipoId ||
        filterState.sepulturaEstadoId
      ) {
        shouldShow = !!hasMatchingSepultura
      } else {
        // Apply relation ID filters only if no advanced filters
        if (hasRelationId) {
          // Show sepulturas with relation ID only if that option is enabled
          if (
            filterState.showWithRelationId &&
            !filterState.showWithoutRelationId
          ) {
            // If specific relation IDs are selected, only show those
            if (filterState.selectedRelationIds.length > 0) {
              shouldShow = filterState.selectedRelationIds.includes(relationId)
            } else {
              shouldShow = true
            }
          } else if (
            !filterState.showWithRelationId &&
            !filterState.showWithoutRelationId
          ) {
            // If both options are disabled, show all sepulturas (initial state)
            shouldShow = true
          }
        } else {
          // Show sepulturas without relation ID only if that option is enabled
          if (
            filterState.showWithoutRelationId &&
            !filterState.showWithRelationId
          ) {
            shouldShow = true
          } else if (
            !filterState.showWithRelationId &&
            !filterState.showWithoutRelationId
          ) {
            // If both options are disabled, show all sepulturas (initial state)
            shouldShow = true
          }
        }
      }

      if (shouldShow) {
        filteredShapes.push(shape as SVGElement)
      }
    })

    // Apply the filtering to the SVG
    const allShapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )

    // First, show all shapes
    allShapes.forEach((shape) => {
      shape.classList.remove('hidden')
    })

    // Then hide shapes that are not in the filtered list (only sepulturas)
    allShapes.forEach((shape) => {
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()

      // Only filter sepulturas - leave talhões and zonas untouched
      if (shapeType === 'sepultura') {
        const isInFilteredList = filteredShapes.some(
          (filteredShape) => filteredShape === shape
        )

        if (!isInFilteredList) {
          shape.classList.add('hidden')
        }
      }
      // Talhões and zonas are always visible (no filtering applied)
    })

    onFilterChange(filteredShapes)
  }, [svgElement, filterState, sepulturasResponse, onFilterChange])

  // Update available relation IDs when SVG changes
  useEffect(() => {
    const relationIds = extractRelationIds()
    setAvailableRelationIds(relationIds)
  }, [extractRelationIds])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleToggleWithRelationId = () => {
    setFilterState((prev) => ({
      ...prev,
      showWithRelationId: !prev.showWithRelationId,
      showWithoutRelationId: false, // Turn off the other option
      selectedRelationIds: [], // Clear specific selections when toggling
    }))
  }

  const handleToggleWithoutRelationId = () => {
    setFilterState((prev) => ({
      ...prev,
      showWithoutRelationId: !prev.showWithoutRelationId,
      showWithRelationId: false, // Turn off the other option
      selectedRelationIds: [], // Clear specific selections when toggling
    }))
  }

  const handleClearFilters = () => {
    setFilterState({
      showWithRelationId: false,
      showWithoutRelationId: false,
      selectedRelationIds: [],
      nome: '',
      sepulturaTipoId: '',
      sepulturaEstadoId: '',
    })
    onClearHighlights()
  }

  const hasActiveFilters =
    filterState.showWithRelationId ||
    filterState.showWithoutRelationId ||
    filterState.nome ||
    filterState.sepulturaTipoId ||
    filterState.sepulturaEstadoId

  return (
    <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col items-center gap-2'>
      {/* Filter Panel */}
      <Collapse
        in={isFilterExpanded}
        orientation='vertical'
        sx={{
          position: 'relative',
          zIndex: 1001,
        }}
      >
        <Card className='w-80 shadow-lg border bg-card/95 backdrop-blur-sm mb-2'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold text-card-foreground'>
              <Icons.list className='w-5 h-5' /> Filtros Sepulturas
            </CardTitle>
            <div className='text-xs text-muted-foreground'>
              {filteredCount} de {totalSepulturas} sepulturas
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='uppercase text-xs font-semibold text-muted-foreground mb-2 tracking-wide'>
                Filtros Avançados
              </div>
              <div className='flex flex-col gap-4'>
                <div>
                  <Label
                    htmlFor='nome-sepultura'
                    className='flex items-center gap-2 mb-2 text-foreground'
                  >
                    <Icons.list className='h-4 w-4' />
                    Nome da Sepultura
                  </Label>
                  <Input
                    id='nome-sepultura'
                    value={filterState.nome}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }))
                    }
                    placeholder='Pesquisar por nome...'
                    className='px-4 py-6 shadow-inner drop-shadow-xl bg-background border-input text-foreground placeholder:text-muted-foreground'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='tipo-sepultura'
                    className='flex items-center gap-2 mb-2 text-foreground'
                  >
                    <Icons.folder className='h-4 w-4' />
                    Tipo de Sepultura
                  </Label>
                  <ShadcnSelect
                    value={filterState.sepulturaTipoId || 'all'}
                    onValueChange={(value) =>
                      setFilterState((prev) => ({
                        ...prev,
                        sepulturaTipoId: value === 'all' ? '' : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id='tipo-sepultura'
                      className='px-4 py-6 shadow-inner drop-shadow-xl bg-background border-input text-foreground'
                    >
                      <SelectValue placeholder='Todos os Tipos' />
                    </SelectTrigger>
                    <SelectContent className='bg-popover border-border text-popover-foreground'>
                      <SelectItem
                        value='all'
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Todos os Tipos
                      </SelectItem>
                      {sepulturaTipos?.map((tipo) => (
                        <SelectItem
                          key={tipo.id}
                          value={tipo.id}
                          className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                        >
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                </div>
                <div>
                  <Label
                    htmlFor='estado-sepultura'
                    className='flex items-center gap-2 mb-2 text-foreground'
                  >
                    <Icons.check className='h-4 w-4' />
                    Estado da Sepultura
                  </Label>
                  <ShadcnSelect
                    value={filterState.sepulturaEstadoId || 'all'}
                    onValueChange={(value) =>
                      setFilterState((prev) => ({
                        ...prev,
                        sepulturaEstadoId: value === 'all' ? '' : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id='estado-sepultura'
                      className='px-4 py-6 shadow-inner drop-shadow-xl bg-background border-input text-foreground'
                    >
                      <SelectValue placeholder='Todos os Estados' />
                    </SelectTrigger>
                    <SelectContent className='bg-popover border-border text-popover-foreground'>
                      <SelectItem
                        value='all'
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Todos os Estados
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.ABANDONO)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Abandono
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.BOM_ESTADO)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Bom Estado
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.DANIFICADA)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Danificada
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.EM_OBRAS)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Em Obras
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.INTERDITADO)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Interditado
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.MANUTENCAO_LEVE)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Manutenção Leve
                      </SelectItem>
                      <SelectItem
                        value={String(SepulturaEstado.RECUPERADA)}
                        className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      >
                        Recuperada
                      </SelectItem>
                    </SelectContent>
                  </ShadcnSelect>
                </div>
              </div>
            </div>
            <div>
              <div className='uppercase text-xs font-semibold text-muted-foreground mb-2 tracking-wide'>
                Tipo de Relacionamento
              </div>
              <div className='flex gap-2 flex-wrap'>
                <ShadcnButton
                  variant={
                    filterState.showWithRelationId ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={handleToggleWithRelationId}
                  className='flex items-center gap-1'
                >
                  <Icons.link className='w-4 h-4' /> Com Relation ID
                </ShadcnButton>
                <ShadcnButton
                  variant={
                    filterState.showWithoutRelationId ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={handleToggleWithoutRelationId}
                  className='flex items-center gap-1'
                >
                  <Icons.link className='w-4 h-4 rotate-45' /> Sem Relation ID
                </ShadcnButton>
              </div>
            </div>
            {availableRelationIds.length > 0 &&
              filterState.showWithRelationId && (
                <div>
                  <div className='uppercase text-xs font-semibold text-muted-foreground mb-2 tracking-wide'>
                    Relation IDs Específicos
                  </div>
                  <div className='max-h-32 overflow-y-auto rounded-md border border-border bg-muted p-2 space-y-1'>
                    {availableRelationIds.map((relationId) => {
                      const isSelected =
                        filterState.selectedRelationIds.includes(relationId)
                      return (
                        <div
                          key={relationId}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'hover:bg-accent text-foreground'
                          )}
                          onClick={() => {
                            setFilterState((prev) => ({
                              ...prev,
                              selectedRelationIds: isSelected
                                ? prev.selectedRelationIds.filter(
                                    (id) => id !== relationId
                                  )
                                : [...prev.selectedRelationIds, relationId],
                            }))
                          }}
                        >
                          <span
                            className={cn(
                              'w-3 h-3 rounded-full border',
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'bg-muted border-muted-foreground'
                            )}
                          />
                          <span
                            className={cn(
                              'text-xs',
                              isSelected
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )}
                          >
                            {relationId}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
          </CardContent>
          <CardFooter className='flex justify-between items-center border-t border-border pt-2'>
            <span className='text-xs text-muted-foreground'>
              {filteredCount} de {totalSepulturas} sepulturas
            </span>
            <ShadcnButton
              size='sm'
              variant='destructive'
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar Filtros
            </ShadcnButton>
          </CardFooter>
        </Card>
      </Collapse>

      {/* Control Buttons */}
      <div className='flex flex-row gap-1 bg-background border border-border rounded-md p-1 shadow-sm'>
        <Tooltip title='Zoom In'>
          <IconButton
            onClick={onZoomIn}
            size='small'
            sx={{
              color: 'hsl(var(--foreground))',
              '&:hover': {
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
              },
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Zoom Out'>
          <IconButton
            onClick={onZoomOut}
            size='small'
            sx={{
              color: 'hsl(var(--foreground))',
              '&:hover': {
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
              },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isPanning ? 'Disable Panning' : 'Enable Panning'}>
          <IconButton
            onClick={onTogglePanning}
            size='small'
            sx={{
              color: isPanning
                ? 'hsl(var(--primary))'
                : 'hsl(var(--foreground))',
              backgroundColor: isPanning
                ? 'hsl(var(--primary) / 0.1)'
                : 'transparent',
              '&:hover': {
                backgroundColor: isPanning
                  ? 'hsl(var(--primary) / 0.2)'
                  : 'hsl(var(--accent))',
                color: isPanning
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--accent-foreground))',
              },
            }}
          >
            <PanToolIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Reset View'>
          <IconButton
            onClick={onReset}
            size='small'
            sx={{
              color: 'hsl(var(--foreground))',
              '&:hover': {
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
              },
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`Filtros Sepulturas (${filteredCount}/${totalSepulturas})`}
        >
          <IconButton
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            size='small'
            sx={{
              color: hasActiveFilters
                ? 'hsl(var(--primary))'
                : 'hsl(var(--foreground))',
              backgroundColor: hasActiveFilters
                ? 'hsl(var(--primary) / 0.1)'
                : 'transparent',
              '&:hover': {
                backgroundColor: hasActiveFilters
                  ? 'hsl(var(--primary) / 0.2)'
                  : 'hsl(var(--accent))',
                color: hasActiveFilters
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--accent-foreground))',
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
