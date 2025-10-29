import React from 'react'
import { cemiteriosViewQueries } from '@/pages/cemiterios/cemiterios-view/queries/cemiterios-view-queries'
import { useUploadCemiterioSvg } from '@/pages/cemiterios/cemiterios/queries/cemiterios-mutations'
import { useGetCemiteriosSelect } from '@/pages/cemiterios/cemiterios/queries/cemiterios-queries'
import { ResponseStatus } from '@/types/api/responses'
import {
  OpenWith,
  RotateRight,
  Delete,
  Close,
  Fullscreen,
  FullscreenExit,
  Add,
  Remove,
  CropSquare,
  Gesture,
  VerticalAlignBottom,
  VerticalAlignTop,
  Image,
  ContentCopy,
  ImageNotSupported,
  RotateLeft,
  CenterFocusStrong,
  Undo,
  Download,
  Upload,
  Edit,
  SelectAll,
  Save,
  LinkOff,
} from '@mui/icons-material'
import { HexColorPicker } from 'react-colorful'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Point, Shape, ShapeType, Forma } from '../types'
import { parseSVGPath } from '../utils/svg-utils'

type ToolMode = 'select' | 'move' | 'delete' | 'resize' | 'draw'
type DrawingMode = 'points' | 'rectangle'

interface ToolboxProps {
  toolMode: ToolMode
  setToolMode: (mode: ToolMode) => void
  drawingMode: DrawingMode
  setDrawingMode: (mode: DrawingMode) => void
  selectedShape: {
    id: string
    type: 'forma'
    index: number
    formaId?: string
  } | null
  isAddingPoints: boolean
  isFullscreen: boolean
  mapImage: string | null
  mapOpacity: number
  setMapOpacity: (opacity: number) => void
  currentFillColor: string
  currentBorderColor: string
  onUploadMap: () => void
  onRemoveMap: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onDuplicateShape: () => void
  onSendToBack: () => void
  onBringToFront: () => void
  onCancelPoints: () => void
  onToggleFullscreen: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onPan: (direction: 'up' | 'down' | 'left' | 'right') => void
  onFillColorChange: (color: string) => void
  onBorderColorChange: (color: string) => void
  onCenter: () => void
  onExportSVG: () => void
  onExportShapesOnly: () => void
  onImportSVG: () => void
  onUndo: () => void
  canUndo: boolean
  onEditVertices: () => void
  isEditingVertices: boolean
  svgRef: React.RefObject<SVGSVGElement | null>
  formas: Shape[]
  setFormas: (windowId: string, instanceId: string, formas: Forma[]) => void
  windowId: string
  instanceId: string
  saveToHistory: (formas: Forma[]) => void
  setFormasState: (formas: Forma[]) => void
  setTempPoints: (points: Point[]) => void
  setCurrentPoints: (points: Point[]) => void
  setIsAddingPoints: (isAdding: boolean) => void
  setSelectedShape: (
    shape: { id: string; type: 'forma'; index: number; formaId?: string } | null
  ) => void
  onDeleteRelationId: () => void
}

export function Toolbox({
  toolMode,
  setToolMode,
  drawingMode,
  setDrawingMode,
  selectedShape,
  isAddingPoints,
  isFullscreen,
  mapImage,
  mapOpacity,
  setMapOpacity,
  currentFillColor,
  currentBorderColor,
  onUploadMap,
  onRemoveMap,
  onRotateLeft,
  onRotateRight,
  onDuplicateShape,
  onSendToBack,
  onBringToFront,
  onCancelPoints,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onFillColorChange,
  onBorderColorChange,
  onCenter,
  onExportSVG,
  onExportShapesOnly,
  onImportSVG,
  onUndo,
  canUndo,
  onEditVertices,
  isEditingVertices,
  svgRef,
  formas,
  setFormas,
  windowId,
  instanceId,
  saveToHistory,
  setFormasState,
  setTempPoints,
  setCurrentPoints,
  setIsAddingPoints,
  setSelectedShape,
  onDeleteRelationId,
}: ToolboxProps) {
  const [fillColorPickerOpen, setFillColorPickerOpen] = React.useState(false)
  const [borderColorPickerOpen, setBorderColorPickerOpen] =
    React.useState(false)
  const [selectedCemiterio, setSelectedCemiterio] = React.useState<string>('')
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false)
  const { data: cemiterios } = useGetCemiteriosSelect()
  const uploadSvgMutation = useUploadCemiterioSvg()

  const getPathFromPoints = (
    points: Point[],
    type: 'points',
    rotation?: number,
    center?: Point
  ): string => {
    if (points.length === 0) return ''

    if (type === 'points') {
      let rotatedPoints = points
      if (rotation && center) {
        rotatedPoints = points.map((point) =>
          rotatePoint(point, center, rotation)
        )
      }
      const path = rotatedPoints
        .map(
          (point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        )
        .join(' ')
      return `${path} Z`
    }

    return ''
  }

  const rotatePoint = (point: Point, center: Point, angle: number): Point => {
    const radians = (angle * Math.PI) / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    const dx = point.x - center.x
    const dy = point.y - center.y
    return {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos,
    }
  }

  const getShapeBounds = (
    points: Point[]
  ): { minX: number; minY: number; maxX: number; maxY: number } => {
    const xCoords = points.map((p) => p.x)
    const yCoords = points.map((p) => p.y)
    return {
      minX: Math.min(...xCoords),
      minY: Math.min(...yCoords),
      maxX: Math.max(...xCoords),
      maxY: Math.max(...yCoords),
    }
  }

  const getShapeCenter = (points: Point[]): Point => {
    const bounds = getShapeBounds(points)
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    }
  }

  const handleSaveSvg = async () => {
    if (!selectedCemiterio || !svgRef.current) return

    try {
      // Remove cached SVG from localStorage
      const CACHE_PREFIX = 'cemiterio_svg_'
      const CACHE_VERSION = '1'
      const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}_${selectedCemiterio}`
      localStorage.removeItem(cacheKey)

      // Create a new SVG element
      const svgDoc = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      )

      // Calculate the bounds of all shapes to set appropriate viewBox
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      formas.forEach((forma) => {
        forma.points.forEach((point) => {
          minX = Math.min(minX, point.x)
          minY = Math.min(minY, point.y)
          maxX = Math.max(maxX, point.x)
          maxY = Math.max(maxY, point.y)
        })
      })

      // Add some padding to the bounds
      const padding = 50
      const width = maxX - minX + padding * 2
      const height = maxY - minY + padding * 2

      // Set SVG attributes
      svgDoc.setAttribute(
        'viewBox',
        `${minX - padding} ${minY - padding} ${width} ${height}`
      )
      svgDoc.setAttribute('width', width.toString())
      svgDoc.setAttribute('height', height.toString())

      // Add shapes to the SVG
      formas.forEach((forma) => {
        const formaGroup = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'g'
        )

        // Add forma path
        const formaPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        formaPath.setAttribute(
          'd',
          getPathFromPoints(
            forma.points,
            'points',
            forma.rotation,
            getShapeCenter(forma.points)
          )
        )
        formaPath.setAttribute('fill', forma.fillColor)
        formaPath.setAttribute(
          'fill-opacity',
          (forma.fillOpacity ?? 0.2).toString()
        )
        formaPath.setAttribute('stroke', forma.borderColor)
        formaPath.setAttribute(
          'stroke-width',
          (forma.lineHeight || 1).toString()
        )
        formaPath.setAttribute(
          'stroke-dasharray',
          forma.lineType === 'dashed'
            ? '5,5'
            : forma.lineType === 'dotted'
              ? '1,3'
              : 'none'
        )
        formaPath.setAttribute('data-id', forma.id)
        formaPath.setAttribute('data-name', forma.name)
        formaPath.setAttribute('data-type', 'forma')
        formaPath.setAttribute('data-shape-type', forma.shapeType)
        formaPath.setAttribute(
          'data-rotation',
          (forma.rotation || 0).toString()
        )
        formaPath.setAttribute('data-line-type', forma.lineType || 'solid')
        formaPath.setAttribute(
          'data-line-height',
          (forma.lineHeight || 1).toString()
        )
        formaPath.setAttribute('data-relation-id', forma.relationId || '')
        formaPath.setAttribute(
          'data-text-color',
          forma.textColor || forma.fillColor
        )
        formaGroup.appendChild(formaPath)

        // Add forma text
        const formaText = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        )

        // Calculate the center of the shape using bounds
        const center = getShapeCenter(forma.points)
        const rotatedCenter = rotatePoint(center, center, forma.rotation || 0)

        // Set text attributes for centering
        formaText.setAttribute('x', rotatedCenter.x.toString())
        formaText.setAttribute('y', rotatedCenter.y.toString())
        formaText.setAttribute('text-anchor', 'middle')
        formaText.setAttribute('dominant-baseline', 'middle')
        formaText.setAttribute('fill', forma.textColor || forma.borderColor)
        formaText.setAttribute('font-size', '8')
        formaText.setAttribute('font-weight', 'bold')
        formaText.setAttribute(
          'transform',
          `rotate(${forma.rotation || 0}, ${rotatedCenter.x}, ${rotatedCenter.y})`
        )
        formaText.textContent = forma.name
        formaGroup.appendChild(formaText)

        svgDoc.appendChild(formaGroup)
      })

      // Convert the SVG to a string
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgDoc)

      // Create a Blob with the SVG content
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const file = new File([blob], `${selectedCemiterio}.svg`, {
        type: 'image/svg+xml',
      })

      await uploadSvgMutation.mutateAsync({
        svgFile: file,
        fileName: `${selectedCemiterio}.svg`,
      })

      toast.success('SVG guardado com sucesso!')
      setIsSaveDialogOpen(false)
    } catch (error) {
      toast.error('Erro ao guardar SVG')
      console.error('Error saving SVG:', error)
    }
  }

  const handleImportFromApi = async () => {
    if (!selectedCemiterio) return

    try {
      const response =
        await cemiteriosViewQueries.getCemiterioSvg(selectedCemiterio)

      if (
        response.info?.status === ResponseStatus.Failure ||
        !response.info?.data
      ) {
        toast.error('Erro ao importar SVG da API')
        return
      }

      const svgContent = response.info.data
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')

      // Parse paths and create formas
      const paths = svgDoc.getElementsByTagName('path')
      const newFormas: Shape[] = []
      const formaMap = new Map<string, Shape>()

      Array.from(paths).forEach((path) => {
        const d = path.getAttribute('d')
        const fill = path.getAttribute('fill') || '#00000033'
        const stroke = path.getAttribute('stroke') || '#000000'
        const name = path.getAttribute('data-name')
        const type = path.getAttribute('data-type') || 'forma'
        const shapeType = (path.getAttribute('data-shape-type') ||
          'Zona') as ShapeType
        const id =
          path.getAttribute('data-id') ||
          `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const relationId = path.getAttribute('data-relation-id') || ''
        const fillOpacity = parseFloat(
          path.getAttribute('fill-opacity') || '0.2'
        )
        const textColor = path.getAttribute('data-text-color') || fill
        const rotation = parseFloat(path.getAttribute('data-rotation') || '0')
        const lineType = (path.getAttribute('data-line-type') || 'solid') as
          | 'solid'
          | 'dashed'
          | 'dotted'
        const lineHeight = parseFloat(
          path.getAttribute('data-line-height') || '1'
        )

        if (d) {
          // Convert SVG path to points
          const points = parseSVGPath(d)

          if (type === 'forma') {
            // Create a new forma with all attributes
            const newForma: Shape = {
              id,
              name: name || `Forma ${newFormas.length + 1}`,
              type: 'forma',
              shapeType,
              points,
              fillColor: fill,
              borderColor: stroke,
              fillOpacity,
              textColor,
              rotation,
              lineType,
              lineHeight,
              relationId,
            }
            newFormas.push(newForma)
            formaMap.set(id, newForma)
          }
        }
      })

      // Update formas and initialize history with the imported state
      setFormas(windowId, instanceId, newFormas)
      saveToHistory(newFormas)

      // Force a re-render by updating the formas state
      setFormasState(newFormas)

      // Reset any temporary states
      setTempPoints([])
      setCurrentPoints([])
      setIsAddingPoints(false)
      setSelectedShape(null)
      setIsImportDialogOpen(false)
      toast.success('SVG importado com sucesso!')
    } catch (error) {
      toast.error('Erro ao importar SVG da API')
      console.error('Error importing SVG from API:', error)
    }
  }

  return (
    <div className='flex items-center justify-between p-2 bg-background border-b'>
      <div className='flex items-center space-x-2'>
        {!isFullscreen ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-9 w-9'
                      onClick={onUndo}
                      disabled={!canUndo}
                    >
                      <Undo className='h-4 w-4' />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Desfazer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={toolMode}
                      onValueChange={(value) =>
                        value && setToolMode(value as ToolMode)
                      }
                    >
                      <ToggleGroupItem
                        value='select'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <SelectAll className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Selecionar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={toolMode}
                      onValueChange={(value) =>
                        value && setToolMode(value as ToolMode)
                      }
                    >
                      <ToggleGroupItem
                        value='draw'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <Gesture className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Desenhar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={toolMode}
                      onValueChange={(value) =>
                        value && setToolMode(value as ToolMode)
                      }
                    >
                      <ToggleGroupItem
                        value='move'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <OpenWith className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Mover</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={toolMode}
                      onValueChange={(value) =>
                        value && setToolMode(value as ToolMode)
                      }
                    >
                      <ToggleGroupItem
                        value='delete'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <Delete className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Excluir</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='h-6 w-px bg-border mx-2' />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={drawingMode}
                      onValueChange={(value) =>
                        value && setDrawingMode(value as DrawingMode)
                      }
                      disabled={toolMode !== 'draw'}
                    >
                      <ToggleGroupItem
                        value='points'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <Gesture className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Desenhar por Pontos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ToggleGroup
                      type='single'
                      value={drawingMode}
                      onValueChange={(value) =>
                        value && setDrawingMode(value as DrawingMode)
                      }
                      disabled={toolMode !== 'draw'}
                    >
                      <ToggleGroupItem
                        value='rectangle'
                        className='h-9 w-9'
                        variant='outline'
                      >
                        <CropSquare className='h-4 w-4' />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Desenhar Retângulo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='h-6 w-px bg-border mx-2' />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Popover
                      open={fillColorPickerOpen}
                      onOpenChange={setFillColorPickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-9 w-9'
                          style={{ backgroundColor: currentFillColor }}
                        >
                          <div className='h-4 w-4 rounded-full border' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-3'
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <div className='space-y-2'>
                          <Label>Cor</Label>
                          <HexColorPicker
                            color={currentFillColor}
                            onChange={onFillColorChange}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Cor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='h-6 w-px bg-border mx-2' />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Popover
                      open={borderColorPickerOpen}
                      onOpenChange={setBorderColorPickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-9 w-9'
                          style={{ backgroundColor: currentBorderColor }}
                        >
                          <div className='h-4 w-4 rounded-full border' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-3'
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <div className='space-y-2'>
                          <Label>Cor</Label>
                          <HexColorPicker
                            color={currentBorderColor}
                            onChange={onBorderColorChange}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Cor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='h-6 w-px bg-border mx-2' />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-9 w-9'
                      onClick={onRotateLeft}
                    >
                      <RotateLeft className='h-4 w-4' />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Rotacionar à Esquerda</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-9 w-9'
                      onClick={onRotateRight}
                    >
                      <RotateRight className='h-4 w-4' />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Rotacionar à Direita</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className='h-6 w-px bg-border mx-2' />
          </>
        ) : null}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9'
                  onClick={onZoomIn}
                >
                  <Add className='h-4 w-4' />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9'
                  onClick={onZoomOut}
                >
                  <Remove className='h-4 w-4' />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='h-6 w-px bg-border mx-2' />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9'
                  onClick={onCenter}
                >
                  <CenterFocusStrong className='h-4 w-4' />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Centralizar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='h-6 w-px bg-border mx-2' />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9'
                  onClick={onToggleFullscreen}
                >
                  {isFullscreen ? (
                    <FullscreenExit className='h-4 w-4' />
                  ) : (
                    <Fullscreen className='h-4 w-4' />
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>{isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {!isFullscreen && (
        <div className='flex items-center space-x-2'>
          {isAddingPoints && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-9 w-9'
                      onClick={onCancelPoints}
                    >
                      <Close className='h-4 w-4' />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Cancelar Desenho</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {selectedShape && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className={cn('h-9 w-9', {
                          'bg-primary text-primary-foreground':
                            isEditingVertices,
                        })}
                        onClick={onEditVertices}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Editar Vértices</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-9 w-9'
                        onClick={onDuplicateShape}
                      >
                        <ContentCopy className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Duplicar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className={cn('h-9 w-9', {
                          'bg-primary text-primary-foreground':
                            selectedShape &&
                            formas.find((f) => f.id === selectedShape.id)
                              ?.relationId,
                        })}
                        onClick={onDeleteRelationId}
                      >
                        <LinkOff className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Remover Relação</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-9 w-9'
                        onClick={onSendToBack}
                      >
                        <VerticalAlignBottom className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Enviar para Trás</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-9 w-9'
                        onClick={onBringToFront}
                      >
                        <VerticalAlignTop className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Trazer para Frente</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <div className='h-6 w-px bg-border mx-2' />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-9 w-9'
                    onClick={onUploadMap}
                  >
                    <Image className='h-4 w-4' />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>Carregar Mapa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {mapImage && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-9 w-9'
                        onClick={onRemoveMap}
                      >
                        <ImageNotSupported className='h-4 w-4' />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Remover Mapa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className='flex items-center space-x-2'>
                <Label className='text-sm'>Opacidade:</Label>
                <Slider
                  value={[mapOpacity]}
                  onValueChange={(value) => setMapOpacity(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className='w-24'
                />
              </div>
            </>
          )}

          <div className='h-6 w-px bg-border mx-2' />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' size='icon' className='h-9 w-9'>
                        <Download className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-2'>
                      <div className='flex flex-col gap-2'>
                        <Button
                          variant='ghost'
                          className='justify-start'
                          onClick={onImportSVG}
                        >
                          <ContentCopy className='h-4 w-4 mr-2' />
                          Importar do Arquivo
                        </Button>
                        <Button
                          variant='ghost'
                          className='justify-start'
                          onClick={() => setIsImportDialogOpen(true)}
                        >
                          <Download className='h-4 w-4 mr-2' />
                          Importar da API
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </span>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>Importar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' size='icon' className='h-9 w-9'>
                        <Upload className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-2'>
                      <div className='flex flex-col gap-2'>
                        <Button
                          variant='ghost'
                          className='justify-start'
                          onClick={onExportSVG}
                        >
                          <Upload className='h-4 w-4 mr-2' />
                          Exportar SVG Completo
                        </Button>
                        <Button
                          variant='ghost'
                          className='justify-start'
                          onClick={onExportShapesOnly}
                        >
                          <Upload className='h-4 w-4 mr-2' />
                          Exportar Apenas Formas
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </span>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className='h-6 w-px bg-border mx-2' />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Dialog
                    open={isSaveDialogOpen}
                    onOpenChange={setIsSaveDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant='outline' size='icon' className='h-9 w-9'>
                        <Save className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Guardar SVG</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <Label>Cemitério</Label>
                          <Select
                            value={selectedCemiterio}
                            onValueChange={setSelectedCemiterio}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione um cemitério' />
                            </SelectTrigger>
                            <SelectContent>
                              {cemiterios?.map((cemiterio) => (
                                <SelectItem
                                  key={cemiterio.id}
                                  value={cemiterio.id}
                                >
                                  {cemiterio.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className='w-full'
                          onClick={handleSaveSvg}
                          disabled={
                            !selectedCemiterio || uploadSvgMutation.isPending
                          }
                        >
                          {uploadSvgMutation.isPending
                            ? 'A guardar...'
                            : 'Guardar'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </span>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>Guardar SVG</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar SVG da API</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label>Cemitério</Label>
                  <Select
                    value={selectedCemiterio}
                    onValueChange={setSelectedCemiterio}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione um cemitério' />
                    </SelectTrigger>
                    <SelectContent>
                      {cemiterios?.map((cemiterio) => (
                        <SelectItem key={cemiterio.id} value={cemiterio.id}>
                          {cemiterio.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className='w-full'
                  onClick={handleImportFromApi}
                  disabled={!selectedCemiterio}
                >
                  Importar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
