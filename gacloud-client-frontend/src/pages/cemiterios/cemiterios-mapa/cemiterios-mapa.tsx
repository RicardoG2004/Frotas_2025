import React, { useState, useRef, useEffect } from 'react'
import { useUpdateSepulturaSvg } from '@/pages/cemiterios/sepulturas/queries/sepulturas-mutations'
import { useUpdateTalhaoSvg } from '@/pages/cemiterios/talhoes/queries/talhoes-mutations'
import { useUpdateZonaSvg } from '@/pages/cemiterios/zonas/queries/zonas-mutations'
import { useLocation } from 'react-router-dom'
import { useMapStore } from '@/stores/use-map-store'
import { cn } from '@/lib/utils'
import { toast } from '@/utils/toast-utils'
import { useCurrentWindowId } from '@/utils/window-utils'
import { SVGComponents } from './components/SVGComponents'
import { NamingDialog } from './components/naming-dialog'
import { Toolbox } from './components/toolbox'
import { useHistory, usePanAndZoom, useFullscreen } from './hooks'
import {
  DrawingMode,
  Forma,
  Point,
  SelectedShape,
  ShapeType,
  ToolMode,
  Shape,
} from './types'
import {
  isPointInPolygon,
  parseSVGPath,
  transformCoordinates,
  getShapeCenter,
  rotatePoint,
} from './utils'

// Add debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const CemiteriosMapa: React.FC = () => {
  const windowId = useCurrentWindowId()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'

  const {
    getMapState,
    setFormas,
    setMapImage,
    setMapDimensions,
    setMapOpacity,
  } = useMapStore()

  const mapState = getMapState(windowId, instanceId)

  const [formas, setFormasState] = useState<Forma[]>(mapState.formas)
  const { saveToHistory, undo, canUndo } = useHistory(formas)
  const [toolMode, setToolMode] = useState<ToolMode>('draw')
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [currentFillColor, setCurrentFillColor] = useState('#000000')
  const [currentBorderColor, setCurrentBorderColor] = useState('#000000')
  const [selectedShape, setSelectedShape] = useState<SelectedShape | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [isEditingVertices, setIsEditingVertices] = useState(false)
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null)
  const moveOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const startPoint = useRef<Point | null>(null)
  const originalPoints = useRef<Point[]>([])
  const clickTimeout = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0))

  const [isAddingPoints, setIsAddingPoints] = useState(false)
  const [tempPoints, setTempPoints] = useState<Point[]>([])
  const COLLISION_THRESHOLD = 10 // pixels
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)
  const {
    zoom,
    pan,
    isPanning,
    lastPanPoint,
    lastPan,
    handleZoom,
    handlePan,
    setPan,
    setZoom,
  } = usePanAndZoom()
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('points')
  const [isDrawingRect, setIsDrawingRect] = useState(false)
  const rectStartPoint = useRef<Point | null>(null)
  const [mapImage, setMapImageState] = useState<string | null>(
    mapState.mapImage
  )
  const [mapOpacity, setMapOpacityState] = useState(mapState.mapOpacity)
  const [mapDimensions, setMapDimensionsState] = useState<{
    width: number
    height: number
  } | null>(mapState.mapDimensions)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const canvasRotation = useRef(0)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const prevDimensions = useRef({ width: 0, height: 0 })
  const isResizing = useRef(false)
  const [isRotating, setIsRotating] = useState(false)
  const rotationStartAngle = useRef<number>(0)
  const rotationCenter = useRef<Point | null>(null)
  const animationFrameId = useRef<number | undefined>(undefined)
  const lastRotation = useRef<number>(0)
  const [copiedShape, setCopiedShape] = useState<Forma | null>(null)
  const [lineType, setLineType] = useState<'solid' | 'dashed' | 'dotted'>(
    'solid'
  )
  const [lineHeight, setLineHeight] = useState<number>(1)
  const [shapeType, setShapeType] = useState<ShapeType>('Zona')
  const [relationId, setRelationId] = useState<string>('')
  const [scale, setScale] = useState<number>(1)
  const [currentFillOpacity, setCurrentFillOpacity] = useState<number>(0.2)
  const [currentTextColor, setCurrentTextColor] = useState<string>('')
  const [showBorderColor, setShowBorderColor] = useState(false)

  const updateZonaSvg = useUpdateZonaSvg()
  const updateTalhaoSvg = useUpdateTalhaoSvg()
  const updateSepulturaSvg = useUpdateSepulturaSvg()

  // Add debounced store update
  const debouncedStoreUpdate = useRef(
    debounce((newFormas: Forma[]) => {
      if (windowId) {
        setFormas(windowId, instanceId, newFormas)
      }
    }, 300)
  ).current

  // Add animation frame ref
  const movementAnimationFrameId = useRef<number | undefined>(undefined)
  const lastMovementTime = useRef<number>(0)
  const movementFrameRate = 1000 / 60 // Target 60fps

  // Optimize updateFormas to handle movement differently
  const updateFormas = (newFormas: Forma[], skipHistory = false) => {
    setFormasState(newFormas)

    if (!skipHistory) {
      saveToHistory(newFormas)
      // Only update store if we're not in the middle of a movement
      if (!isMovingRef.current) {
        debouncedStoreUpdate(newFormas)
      }
    }
  }

  // Add optimized movement update function
  const updateMovement = (dx: number, dy: number) => {
    const now = performance.now()
    if (now - lastMovementTime.current < movementFrameRate) {
      return
    }
    lastMovementTime.current = now

    if (selectedShape && isMoving) {
      if (selectedVertex !== null && isEditingVertices) {
        // Update only the selected vertex position
        const forma = formas.find((f) => f.id === selectedShape.id)
        if (forma) {
          const newPoints = [...forma.points]
          // Move only the selected vertex
          newPoints[selectedVertex] = {
            x: newPoints[selectedVertex].x + dx,
            y: newPoints[selectedVertex].y + dy,
          }
          // Update the shape with the new points
          updateFormas(
            formas.map((f) =>
              f.id === selectedShape.id ? { ...f, points: newPoints } : f
            ),
            true
          )
        }
      } else {
        // Move entire shape
        if (selectedShape.type === 'forma') {
          const forma = formas.find((f) => f.id === selectedShape.id)
          if (forma) {
            const newPoints = forma.points.map((point) => ({
              x: point.x + dx,
              y: point.y + dy,
            }))
            updateFormas(
              formas.map((f) =>
                f.id === selectedShape.id ? { ...f, points: newPoints } : f
              ),
              true
            )
          }
        }
      }
    }
  }

  // Update store when local state changes
  useEffect(() => {
    if (windowId && !isMovingRef.current) {
      setFormas(windowId, instanceId, formas)
    }
  }, [formas, windowId, instanceId])

  useEffect(() => {
    if (windowId) {
      setMapImage(windowId, instanceId, mapImage)
    }
  }, [mapImage, windowId, instanceId])

  useEffect(() => {
    if (windowId) {
      setMapDimensions(windowId, instanceId, mapDimensions)
    }
  }, [mapDimensions, windowId, instanceId])

  useEffect(() => {
    if (windowId) {
      setMapOpacity(windowId, instanceId, mapOpacity)
    }
  }, [mapOpacity, windowId, instanceId])

  // Add movement tracking ref
  const isMovingRef = useRef(false)
  const movementStartState = useRef<Forma[]>([])

  // Modify handleMouseDown to track movement start
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Don't start drawing if clicking on a button or UI element
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[role="tooltip"]') ||
      (e.target as HTMLElement).closest('[role="dialog"]')
    ) {
      return
    }

    // Don't start drawing if in delete mode
    if (toolMode === 'delete') {
      return
    }

    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    // Get base coordinates
    const baseX =
      (e.clientX -
        rect.left -
        pan.x -
        (svgContainerRef.current?.clientWidth || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientWidth || 0) / 2
    const baseY =
      (e.clientY -
        rect.top -
        pan.y -
        (svgContainerRef.current?.clientHeight || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientHeight || 0) / 2

    // Transform coordinates based on rotation
    const { x, y } = transformCoordinates(
      baseX,
      baseY,
      canvasRotation.current,
      svgContainerRef.current?.clientWidth || 0,
      svgContainerRef.current?.clientHeight || 0
    )

    // Start panning if middle mouse button or space + left click
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
      return
    }

    // Handle move mode
    if (toolMode === 'move') {
      // Find all shapes that contain the clicked point
      const clickedShapes: SelectedShape[] = []

      // Check all formas
      formas.forEach((forma) => {
        if (
          isPointInPolygon(
            { x, y },
            forma.points,
            forma.rotation,
            getShapeCenter(forma.points)
          )
        ) {
          clickedShapes.push({
            id: forma.id,
            type: 'forma',
            index: 0,
          })
        }
      })

      // Select the last shape in the array (topmost layer)
      if (clickedShapes.length > 0) {
        const topShape = clickedShapes[clickedShapes.length - 1]
        setSelectedShape(topShape)
        setIsMoving(true)
        isMovingRef.current = true
        startPoint.current = { x, y }
        movementStartState.current = [...formas] // Save initial state when movement starts
        setIsEditingVertices(false)
        return
      }

      // If no shape was clicked, deselect current shape
      setSelectedShape(null)
      setIsMoving(false)
      isMovingRef.current = false
      setIsEditingVertices(false)
      startPoint.current = null
      moveOffset.current = { x: 0, y: 0 }
      return
    }

    // Handle select mode
    if (toolMode === 'select') {
      // Find all shapes that contain the clicked point
      const clickedShapes: SelectedShape[] = []

      // Check all formas
      formas.forEach((forma) => {
        if (
          isPointInPolygon(
            { x, y },
            forma.points,
            forma.rotation,
            getShapeCenter(forma.points)
          )
        ) {
          clickedShapes.push({
            id: forma.id,
            type: 'forma',
            index: 0,
          })
        }
      })

      // Select the last shape in the array (topmost layer)
      if (clickedShapes.length > 0) {
        const topShape = clickedShapes[clickedShapes.length - 1]
        setSelectedShape(topShape)
        const shape = formas.find((f) => f.id === topShape.id)
        if (shape) {
          originalPoints.current = [...shape.points]
          setCurrentFillColor(shape.fillColor)
          setCurrentBorderColor(shape.borderColor)
          setIsEditingVertices(true)
        }
      } else {
        setSelectedShape(null)
        setIsEditingVertices(false)
      }
      return
    }

    // Handle drawing modes
    if (toolMode === 'draw') {
      if (drawingMode === 'rectangle') {
        setIsDrawingRect(true)
        rectStartPoint.current = { x, y }
        setTempPoints([{ x, y }])
        return
      }

      const newPoint = { x, y }

      // Check for collision with existing points
      if (tempPoints.length > 0) {
        const firstPoint = tempPoints[0]
        const distance = Math.sqrt(
          Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2)
        )

        if (distance < COLLISION_THRESHOLD && tempPoints.length >= 2) {
          // Close the shape without adding the first point again
          setCurrentPoints([...tempPoints])
          setSelectedShape(null)
          setIsNamingDialogOpen(true)
          setTempPoints([])
          setIsAddingPoints(false)
          return
        }
      }

      setIsAddingPoints(true)
      setTempPoints([...tempPoints, newPoint])
    }
  }

  // Modify handleMouseMove to use requestAnimationFrame
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning.current && lastPanPoint.current) {
      const dx = e.clientX - lastPanPoint.current.x
      const dy = e.clientY - lastPanPoint.current.y
      setPan((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }))
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
      return
    }

    if (isDrawingRect && rectStartPoint.current) {
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      // Get base coordinates
      const baseX =
        (e.clientX -
          rect.left -
          pan.x -
          (svgContainerRef.current?.clientWidth || 0) / 2) /
          zoom +
        (svgContainerRef.current?.clientWidth || 0) / 2
      const baseY =
        (e.clientY -
          rect.top -
          pan.y -
          (svgContainerRef.current?.clientHeight || 0) / 2) /
          zoom +
        (svgContainerRef.current?.clientHeight || 0) / 2

      // Transform coordinates based on rotation
      const { x, y } = transformCoordinates(
        baseX,
        baseY,
        canvasRotation.current,
        svgContainerRef.current?.clientWidth || 0,
        svgContainerRef.current?.clientHeight || 0
      )

      // Create rectangle points
      const points = [
        rectStartPoint.current,
        { x, y: rectStartPoint.current.y },
        { x, y },
        { x: rectStartPoint.current.x, y },
      ]
      setTempPoints(points)
      return
    }

    if (isMoving && selectedShape && startPoint.current) {
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      // Get base coordinates
      const baseX =
        (e.clientX -
          rect.left -
          pan.x -
          (svgContainerRef.current?.clientWidth || 0) / 2) /
          zoom +
        (svgContainerRef.current?.clientWidth || 0) / 2
      const baseY =
        (e.clientY -
          rect.top -
          pan.y -
          (svgContainerRef.current?.clientHeight || 0) / 2) /
          zoom +
        (svgContainerRef.current?.clientHeight || 0) / 2

      // Transform coordinates based on rotation
      const { x, y } = transformCoordinates(
        baseX,
        baseY,
        canvasRotation.current,
        svgContainerRef.current?.clientWidth || 0,
        svgContainerRef.current?.clientHeight || 0
      )

      const dx = x - startPoint.current.x
      const dy = y - startPoint.current.y

      startPoint.current = { x, y }

      // Cancel any pending animation frame
      if (movementAnimationFrameId.current) {
        cancelAnimationFrame(movementAnimationFrameId.current)
      }

      // Use requestAnimationFrame for smooth updates
      movementAnimationFrameId.current = requestAnimationFrame(() => {
        updateMovement(dx, dy)
      })
    }
  }

  // Modify handleMouseUp to clean up animation frame
  const handleMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false
      lastPanPoint.current = null
      return
    }

    if (isDrawingRect && rectStartPoint.current) {
      setIsDrawingRect(false)
      setCurrentPoints([...tempPoints])
      setSelectedShape(null)
      setIsNamingDialogOpen(true)
      setTempPoints([])
      rectStartPoint.current = null
      return
    }

    if (isMoving && selectedShape) {
      if (selectedVertex !== null && isEditingVertices) {
        // Update vertex position
        const forma = formas.find((f) => f.id === selectedShape.id)
        if (forma) {
          const newPoints = [...forma.points]
          newPoints[selectedVertex] = {
            x: newPoints[selectedVertex].x + moveOffset.current.x,
            y: newPoints[selectedVertex].y + moveOffset.current.y,
          }
          updateFormas(
            formas.map((f) =>
              f.id === selectedShape.id ? { ...f, points: newPoints } : f
            )
          )
        }
      } else {
        // Move entire shape
        if (selectedShape.type === 'forma') {
          const forma = formas.find((f) => f.id === selectedShape.id)
          if (forma) {
            const newPoints = forma.points.map((point) => ({
              x: point.x + moveOffset.current.x,
              y: point.y + moveOffset.current.y,
            }))
            updateFormas(
              formas.map((f) =>
                f.id === selectedShape.id ? { ...f, points: newPoints } : f
              )
            )
          }
        }
      }
      moveOffset.current = { x: 0, y: 0 }
    }
    setIsMoving(false)
    isMovingRef.current = false
    startPoint.current = null
    setSelectedVertex(null)
    movementStartState.current = [] // Clear movement start state

    // Cancel any pending animation frame
    if (movementAnimationFrameId.current) {
      cancelAnimationFrame(movementAnimationFrameId.current)
    }

    // Update store with final state after movement is complete
    if (windowId) {
      setFormas(windowId, instanceId, formas)
    }
  }

  const handleShapeClick = (id: string) => {
    if (toolMode !== 'select') return

    // Clear any existing timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }

    // Set a new timeout to handle single click
    clickTimeout.current = setTimeout(() => {
      const shape = formas.find((f) => f.id === id)

      if (shape) {
        setSelectedShape({
          id: shape.id,
          type: 'forma',
          index: 0,
        })
        originalPoints.current = [...shape.points]
        setCurrentFillColor(shape.fillColor)
        setCurrentBorderColor(shape.borderColor)
        setIsEditingVertices(true) // Automatically activate vertex editing mode
      } else {
        setSelectedShape(null)
        setIsEditingVertices(false) // Deactivate vertex editing mode when deselecting
      }
    }, 200) // 200ms delay to distinguish between click and double-click
  }

  const handleShapeDoubleClick = (id: string) => {
    // Clear the click timeout to prevent single click from firing
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }

    const shape = formas.find((f) => f.id === id)

    if (shape) {
      setSelectedShape({ id, type: 'forma', index: 0 })
      setNewName(shape.name)
      setCurrentFillColor(shape.fillColor)
      setCurrentBorderColor(shape.borderColor)
      setCurrentFillOpacity(shape.fillOpacity ?? 0.2)
      setCurrentTextColor(shape.textColor || shape.fillColor)
      setShapeType(shape.shapeType)
      setLineType(shape.lineType || 'solid')
      setLineHeight(shape.lineHeight || 1)
      setRelationId(shape.relationId || '')
      setScale(1)
      setIsEditing(true)
      setIsNamingDialogOpen(true)
      // Check if border color is different from fill color
      if (shape.borderColor !== shape.fillColor) {
        setShowBorderColor(true)
      }
    }
  }

  const handleCloseNamingDialog = () => {
    setIsNamingDialogOpen(false)
    setNewName('')
    setTempPoints([])
    setCurrentPoints([])
    setIsAddingPoints(false)
    setRelationId('')
    setShowBorderColor(false)
  }

  const handleFillColorChange = (color: string) => {
    setCurrentFillColor(color)

    // Only update existing shape color if one is selected
    if (selectedShape && !isNamingDialogOpen) {
      updateFormas(
        formas.map((forma) => {
          if (forma.id === selectedShape.id) {
            return { ...forma, fillColor: color }
          }
          return forma
        })
      )
    }
  }

  const handleBorderColorChange = (color: string) => {
    setCurrentBorderColor(color)

    // Only update existing shape color if one is selected
    if (selectedShape && !isNamingDialogOpen) {
      updateFormas(
        formas.map((forma) => {
          if (forma.id === selectedShape.id) {
            return { ...forma, borderColor: color }
          }
          return forma
        })
      )
    }
  }

  const handleFillOpacityChange = (opacity: number) => {
    setCurrentFillOpacity(opacity)

    // Only update existing shape opacity if one is selected
    if (selectedShape && !isNamingDialogOpen) {
      updateFormas(
        formas.map((forma) => {
          if (forma.id === selectedShape.id) {
            return { ...forma, fillOpacity: opacity }
          }
          return forma
        })
      )
    }
  }

  const handleTextColorChange = (color: string) => {
    setCurrentTextColor(color)

    // Only update existing shape text color if one is selected
    if (selectedShape && !isNamingDialogOpen) {
      updateFormas(
        formas.map((forma) => {
          if (forma.id === selectedShape.id) {
            return { ...forma, textColor: color }
          }
          return forma
        })
      )
    }
  }

  const handleSaveShape = async () => {
    if (!newName.trim()) return

    if (isEditing && selectedShape) {
      // Update existing shape
      updateFormas(
        formas.map((forma) => {
          if (forma.id === selectedShape.id) {
            const center = getShapeCenter(forma.points)
            const scaledPoints = forma.points.map((point) => ({
              x: center.x + (point.x - center.x) * scale,
              y: center.y + (point.y - center.y) * scale,
            }))
            return {
              ...forma,
              name: newName,
              fillColor: currentFillColor,
              borderColor: currentBorderColor,
              fillOpacity: currentFillOpacity,
              textColor: currentTextColor || currentFillColor,
              lineType: lineType,
              lineHeight: lineHeight,
              shapeType: shapeType,
              relationId: relationId,
              points: scaledPoints,
            }
          }
          return forma
        })
      )

      // Update the entity with the shape ID
      if (relationId && relationId !== '') {
        const shapeId = selectedShape.id
        if (shapeType === 'Zona') {
          await updateZonaSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        } else if (shapeType === 'Talhão') {
          await updateTalhaoSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        } else if (shapeType === 'Sepultura') {
          await updateSepulturaSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        }
      }

      // Reset editing state
      setIsEditing(false)
      setSelectedShape(null)
    } else if (currentPoints.length > 0) {
      // Only create new shape if we have points and we're not editing
      const shapeId = Date.now().toString()
      const newForma: Forma = {
        id: shapeId,
        name: newName,
        type: 'forma',
        shapeType: shapeType,
        points: currentPoints,
        fillColor: currentFillColor,
        borderColor: currentBorderColor,
        fillOpacity: currentFillOpacity,
        textColor: currentTextColor || currentFillColor,
        lineType: lineType,
        lineHeight: lineHeight,
        relationId: relationId,
      }
      updateFormas([...formas, newForma])

      // Update the entity with the shape ID
      if (relationId && relationId !== '') {
        if (shapeType === 'Zona') {
          await updateZonaSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        } else if (shapeType === 'Talhão') {
          await updateTalhaoSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        } else if (shapeType === 'Sepultura') {
          await updateSepulturaSvg.mutateAsync({
            id: relationId,
            data: { temSvgShape: true, shapeId },
          })
        }
      }
    }

    // Reset state
    setTempPoints([])
    setCurrentPoints([])
    setIsAddingPoints(false)
    handleCloseNamingDialog()
  }

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

  // Delete shape by id
  const handleDeleteZone = async (e: React.MouseEvent, formaId: string) => {
    e.stopPropagation() // Prevent event from bubbling up to SVG

    // Find the shape being deleted
    const deletedShape = formas.find((forma) => forma.id === formaId)

    // Update temSvgShape and clear shapeId if we have a relationId
    if (deletedShape?.relationId) {
      if (deletedShape.shapeType === 'Zona') {
        await updateZonaSvg.mutateAsync({
          id: deletedShape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      } else if (deletedShape.shapeType === 'Talhão') {
        await updateTalhaoSvg.mutateAsync({
          id: deletedShape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      } else if (deletedShape.shapeType === 'Sepultura') {
        await updateSepulturaSvg.mutateAsync({
          id: deletedShape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      }
    }

    updateFormas(formas.filter((forma) => forma.id !== formaId))
  }

  const handleDeleteRelationId = async () => {
    if (!selectedShape) return

    const shape = formas.find((forma) => forma.id === selectedShape.id)
    if (!shape || !shape.relationId) return

    try {
      // Update API based on shape type - clear shapeId when temSvgShape is false
      if (shape.shapeType === 'Zona') {
        await updateZonaSvg.mutateAsync({
          id: shape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      } else if (shape.shapeType === 'Talhão') {
        await updateTalhaoSvg.mutateAsync({
          id: shape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      } else if (shape.shapeType === 'Sepultura') {
        await updateSepulturaSvg.mutateAsync({
          id: shape.relationId,
          data: { temSvgShape: false, shapeId: null },
        })
      }

      // Update the shape in the local state
      updateFormas(
        formas.map((forma) =>
          forma.id === selectedShape.id ? { ...forma, relationId: '' } : forma
        )
      )

      toast.success('Relação removida com sucesso!')
    } catch (error: any) {
      // Always update the local state to remove the relation, even if API call fails
      updateFormas(
        formas.map((forma) =>
          forma.id === selectedShape.id ? { ...forma, relationId: '' } : forma
        )
      )

      // Check if it's our custom error type
      if (
        error?.name === 'SepulturaError' ||
        error?.name === 'ZonaError' ||
        error?.name === 'TalhaoError'
      ) {
        // The entity probably doesn't exist anymore
        toast.warning(
          `A relação parece ser inválida ou não existe mais. O mapa foi atualizado.`
        )
      } else {
        toast.error('Erro ao remover relação')
      }
    }
  }

  const handleCancelPoints = () => {
    setTempPoints([])
    setIsAddingPoints(false)
  }

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1

      // Get the center of the viewport
      const viewportWidth = svgContainerRef.current?.clientWidth || 0
      const viewportHeight = svgContainerRef.current?.clientHeight || 0
      const centerX = viewportWidth / 2
      const centerY = viewportHeight / 2

      // Calculate the mouse position relative to the viewport
      const mouseX =
        e.clientX - (svgContainerRef.current?.getBoundingClientRect().left || 0)
      const mouseY =
        e.clientY - (svgContainerRef.current?.getBoundingClientRect().top || 0)

      // Calculate the offset from the center
      const offsetX = mouseX - centerX
      const offsetY = mouseY - centerY

      // Calculate the new zoom level
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta))

      // Calculate the zoom factor
      const zoomFactor = newZoom / zoom

      // Update pan to keep the point under the mouse cursor in the same position
      setPan((prev) => ({
        x: prev.x - offsetX * (zoomFactor - 1),
        y: prev.y - offsetY * (zoomFactor - 1),
      }))

      // Update zoom
      setZoom(newZoom)
    }
  }

  const handleSendToBack = () => {
    if (!selectedShape) return
    const newFormas = [...formas]
    const index = newFormas.findIndex((f) => f.id === selectedShape.id)
    if (index > 0) {
      const [shape] = newFormas.splice(index, 1)
      newFormas.unshift(shape)
    }
    updateFormas(newFormas)
  }

  const handleBringToFront = () => {
    if (!selectedShape) return
    const newFormas = [...formas]
    const index = newFormas.findIndex((f) => f.id === selectedShape.id)
    if (index < newFormas.length - 1) {
      const [shape] = newFormas.splice(index, 1)
      newFormas.push(shape)
    }
    updateFormas(newFormas)
  }

  const handleDuplicateShape = () => {
    if (!selectedShape) return

    const newId = Date.now().toString()
    const shapeToDuplicate = formas.find((f) => f.id === selectedShape.id)

    if (!shapeToDuplicate) return

    const newName = `${shapeToDuplicate.name} (cópia)`

    const newForma: Forma = {
      ...shapeToDuplicate,
      id: newId,
      name: newName,
    }
    updateFormas([...formas, newForma])
  }

  const handleRotateCanvas = (direction: 'left' | 'right') => {
    const angle = direction === 'left' ? -90 : 90
    const newRotation = (canvasRotation.current + angle) % 360
    canvasRotation.current = newRotation
    const containerWidth = svgContainerRef.current?.clientWidth || 0
    const containerHeight = svgContainerRef.current?.clientHeight || 0
    updateFormas(
      formas.map((forma) => ({
        ...forma,
        points: forma.points.map((point) =>
          rotatePoint(
            point,
            { x: containerWidth / 2, y: containerHeight / 2 },
            angle
          )
        ),
      }))
    )
  }

  const handleRotateShape = (direction: 'left' | 'right') => {
    if (!selectedShape) return
    const angle = direction === 'left' ? -90 : 90
    const forma = formas.find((f) => f.id === selectedShape.id)
    if (!forma) return
    updateFormas(
      formas.map((f) =>
        f.id === selectedShape.id
          ? {
              ...f,
              rotation: (f.rotation || 0) + angle,
            }
          : f
      )
    )
  }

  const handleCenter = () => {
    if (formas.length === 0) {
      // If no shapes exist, just reset to center
      setPan({ x: 0, y: 0 })
      setZoom(1)
      return
    }

    // Get the visible canvas dimensions
    const canvasWidth = svgContainerRef.current?.clientWidth || 0
    const canvasHeight = svgContainerRef.current?.clientHeight || 0

    // Collect all points from formas
    const allPoints: Point[] = []
    formas.forEach((forma) => {
      allPoints.push(...forma.points)
    })

    // Calculate the bounds of all shapes
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    allPoints.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    // Calculate the center of all shapes
    const shapesCenterX = (minX + maxX) / 2
    const shapesCenterY = (minY + maxY) / 2

    // Calculate the center of the visible canvas
    const canvasCenterX = canvasWidth / 2
    const canvasCenterY = canvasHeight / 2

    // Calculate the pan offset needed to center the shapes
    const newPanX = canvasCenterX - shapesCenterX
    const newPanY = canvasCenterY - shapesCenterY

    // Calculate the zoom level needed to fit all shapes with some padding
    const shapesWidth = maxX - minX
    const shapesHeight = maxY - minY
    const padding = 50 // Add some padding around the shapes
    const zoomX = (canvasWidth - padding * 2) / shapesWidth
    const zoomY = (canvasHeight - padding * 2) / shapesHeight
    const newZoom = Math.min(zoomX, zoomY, 1) // Don't zoom in more than 1x

    // Update pan and zoom
    setPan({ x: newPanX, y: newPanY })
    setZoom(newZoom)
  }

  const handleExportSVG = () => {
    if (!svgRef.current) return

    // Create a clone of the SVG element
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement

    // Add metadata to paths
    formas.forEach((forma) => {
      const path = svgClone.querySelector(`path[data-id="${forma.id}"]`)
      if (path) {
        path.setAttribute('data-name', forma.name)
        path.setAttribute('data-type', 'forma')
        path.setAttribute('data-id', forma.id)
        path.setAttribute('data-shape-type', forma.shapeType)
        path.setAttribute('data-relation-id', forma.relationId || '')
        path.setAttribute('fill', forma.fillColor)
        path.setAttribute('fill-opacity', (forma.fillOpacity ?? 0.2).toString())
        path.setAttribute('stroke', forma.borderColor)
        path.setAttribute('stroke-width', (forma.lineHeight || 1).toString())
        path.setAttribute(
          'stroke-dasharray',
          forma.lineType === 'dashed'
            ? '5,5'
            : forma.lineType === 'dotted'
              ? '1,3'
              : 'none'
        )
        // Add text color attribute
        path.setAttribute('data-text-color', forma.textColor || forma.fillColor)
      }
    })

    // Remove any temporary elements or UI elements that shouldn't be in the export
    const foreignObjects = svgClone.querySelectorAll('foreignObject')
    foreignObjects.forEach((obj) => obj.remove())

    // Set the viewBox to match the current view
    const width = svgContainerRef.current?.clientWidth || 0
    const height = svgContainerRef.current?.clientHeight || 0
    svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svgClone.setAttribute('width', width.toString())
    svgClone.setAttribute('height', height.toString())

    // Convert the SVG to a string
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgClone)

    // Create a Blob with the SVG content
    const blob = new Blob([svgString], { type: 'image/svg+xml' })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cemiterio-mapa.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportShapesOnly = () => {
    if (!svgRef.current) return

    // Create a new SVG element
    const svgDoc = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

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
      formaPath.setAttribute('stroke-width', (forma.lineHeight || 1).toString())
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
      formaPath.setAttribute('data-rotation', (forma.rotation || 0).toString())
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

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cemiterio-shapes.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportSVG = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.svg'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const svgContent = event.target?.result as string
          const parser = new DOMParser()
          const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')

          // Parse paths and create formas
          const paths = svgDoc.getElementsByTagName('path')
          const newFormas: Forma[] = []
          const formaMap = new Map<string, Forma>()

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
            const rotation = parseFloat(
              path.getAttribute('data-rotation') || '0'
            )
            const lineType = (path.getAttribute('data-line-type') ||
              'solid') as 'solid' | 'dashed' | 'dotted'
            const lineHeight = parseFloat(
              path.getAttribute('data-line-height') || '1'
            )

            if (d) {
              // Convert SVG path to points
              const points = parseSVGPath(d)

              if (type === 'forma') {
                // Create a new forma with all attributes
                const newForma: Forma = {
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
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement
      if (isFullscreenNow) {
        // Reset pan position when entering fullscreen
        setPan({ x: 0, y: 0 })
        setZoom(1)
      } else {
        // Store current dimensions
        const oldWidth = svgContainerRef.current?.clientWidth || 0
        const oldHeight = svgContainerRef.current?.clientHeight || 0
        prevDimensions.current = { width: oldWidth, height: oldHeight }

        // Store current pan position
        lastPan.current = { ...pan }

        // Use requestAnimationFrame to ensure we get the new dimensions
        requestAnimationFrame(() => {
          const newWidth = svgContainerRef.current?.clientWidth || oldWidth
          const newHeight = svgContainerRef.current?.clientHeight || oldHeight

          // Calculate the scale factor
          const scaleX = newWidth / oldWidth
          const scaleY = newHeight / oldHeight

          // Calculate the center point of the viewport
          const centerX = oldWidth / 2
          const centerY = oldHeight / 2

          // Calculate the offset from center using the stored pan position
          const offsetX = lastPan.current.x + centerX
          const offsetY = lastPan.current.y + centerY

          // Scale the offset
          const newOffsetX = offsetX * scaleX
          const newOffsetY = offsetY * scaleY

          // Calculate new pan position to maintain the same relative position
          const newPanX = newOffsetX - newWidth / 2
          const newPanY = newOffsetY - newHeight / 2

          // Update pan position
          setPan({
            x: newPanX,
            y: newPanY,
          })
        })
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (isResizing.current) return
      isResizing.current = true

      if (svgContainerRef.current) {
        const oldWidth =
          prevDimensions.current.width || svgContainerRef.current.clientWidth
        const oldHeight =
          prevDimensions.current.height || svgContainerRef.current.clientHeight

        // Store current pan position
        lastPan.current = { ...pan }

        requestAnimationFrame(() => {
          const newWidth = svgContainerRef.current?.clientWidth || oldWidth
          const newHeight = svgContainerRef.current?.clientHeight || oldHeight

          // Only update if dimensions actually changed
          if (newWidth !== oldWidth || newHeight !== oldHeight) {
            // Update stored dimensions
            prevDimensions.current = { width: newWidth, height: newHeight }

            // Calculate the scale factor
            const scaleX = newWidth / oldWidth
            const scaleY = newHeight / oldHeight

            // Calculate the center point of the viewport
            const centerX = oldWidth / 2
            const centerY = oldHeight / 2

            // Calculate the offset from center using the stored pan position
            const offsetX = lastPan.current.x + centerX
            const offsetY = lastPan.current.y + centerY

            // Scale the offset
            const newOffsetX = offsetX * scaleX
            const newOffsetY = offsetY * scaleY

            // Calculate new pan position to maintain the same relative position
            const newPanX = newOffsetX - newWidth / 2
            const newPanY = newOffsetY - newHeight / 2

            // Update pan position
            setPan({
              x: newPanX,
              y: newPanY,
            })
          }
          isResizing.current = false
        })
      }
    })

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    if (svgContainerRef.current) {
      resizeObserver.observe(svgContainerRef.current)
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      resizeObserver.disconnect()
    }
  }, []) // Keep empty dependencies array

  // Update lastPan when pan changes
  useEffect(() => {
    lastPan.current = { ...pan }
  }, [pan])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current)
      }
    }
  }, [])

  const handleRotationStart = (e: React.MouseEvent, shape: Shape) => {
    e.stopPropagation()
    // Remove the rectangle check to allow rotation for all shapes
    // if (!isRectangle(shape.points)) return

    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const center = getShapeCenter(shape.points)

    // Convert mouse coordinates to SVG coordinates
    const mouseX =
      (e.clientX -
        rect.left -
        pan.x -
        (svgContainerRef.current?.clientWidth || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientWidth || 0) / 2
    const mouseY =
      (e.clientY -
        rect.top -
        pan.y -
        (svgContainerRef.current?.clientHeight || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientHeight || 0) / 2

    rotationCenter.current = center
    rotationStartAngle.current = Math.atan2(
      mouseY - center.y,
      mouseX - center.x
    )
    lastRotation.current = shape.rotation || 0
    setIsRotating(true)
    setIsMoving(false) // Prevent moving while rotating
    setIsEditingVertices(false) // Prevent vertex editing while rotating
  }

  const handleRotationMove = (e: React.MouseEvent) => {
    if (!isRotating || !rotationCenter.current || !selectedShape) return

    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const center = rotationCenter.current

    // Convert mouse coordinates to SVG coordinates
    const mouseX =
      (e.clientX -
        rect.left -
        pan.x -
        (svgContainerRef.current?.clientWidth || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientWidth || 0) / 2
    const mouseY =
      (e.clientY -
        rect.top -
        pan.y -
        (svgContainerRef.current?.clientHeight || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientHeight || 0) / 2

    const currentAngle = Math.atan2(mouseY - center.y, mouseX - center.x)
    const angleDiff =
      (currentAngle - rotationStartAngle.current) * (180 / Math.PI)

    const newRotation = (lastRotation.current + angleDiff) % 360

    // Cancel any pending animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameId.current = requestAnimationFrame(() => {
      if (selectedShape.type === 'forma') {
        updateFormas(
          formas.map((f) =>
            f.id === selectedShape.id ? { ...f, rotation: newRotation } : f
          )
        )
      }
    })
  }

  const handleRotationEnd = () => {
    setIsRotating(false)
    rotationCenter.current = null
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
  }

  // Update the useEffect for mouse events
  useEffect(() => {
    if (isRotating) {
      window.addEventListener('mousemove', handleRotationMove as any)
      window.addEventListener('mouseup', handleRotationEnd)
      return () => {
        window.removeEventListener('mousemove', handleRotationMove as any)
        window.removeEventListener('mouseup', handleRotationEnd)
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
      }
    }
  }, [isRotating, pan, zoom, selectedShape, formas])

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle copy/paste for shapes if we're not in a text input
      const isTextInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement

      if (!isTextInput) {
        // Check if Ctrl+C is pressed and a shape is selected
        if (e.ctrlKey && e.key === 'c' && selectedShape) {
          const shapeToCopy = formas.find((f) => f.id === selectedShape.id)
          if (shapeToCopy) {
            setCopiedShape(shapeToCopy)
          }
        }

        // Check if Ctrl+V is pressed and we have a copied shape
        if (e.ctrlKey && e.key === 'v' && copiedShape) {
          handleDuplicateShape()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedShape, copiedShape, formas])

  const handleEditVertices = () => {
    setIsEditingVertices(!isEditingVertices)
    setSelectedVertex(null)
  }

  const handleVertexMouseDown = (e: React.MouseEvent, vertexIndex: number) => {
    if (!isEditingVertices || !selectedShape) return

    e.stopPropagation()
    setSelectedVertex(vertexIndex)
    setIsMoving(true)
    isMovingRef.current = true

    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const baseX =
      (e.clientX -
        rect.left -
        pan.x -
        (svgContainerRef.current?.clientWidth || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientWidth || 0) / 2
    const baseY =
      (e.clientY -
        rect.top -
        pan.y -
        (svgContainerRef.current?.clientHeight || 0) / 2) /
        zoom +
      (svgContainerRef.current?.clientHeight || 0) / 2

    const { x, y } = transformCoordinates(
      baseX,
      baseY,
      canvasRotation.current,
      svgContainerRef.current?.clientWidth || 0,
      svgContainerRef.current?.clientHeight || 0
    )

    startPoint.current = { x, y }
  }

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // When switching to select tool, if there's a selected shape, activate vertex editing
    if (toolMode === 'select' && selectedShape) {
      setIsEditingVertices(true)
    } else {
      // When switching to any other tool, deactivate vertex editing
      setIsEditingVertices(false)
      setSelectedVertex(null)
    }
  }, [toolMode, selectedShape])

  const handleZoomWithCenter = (delta: number) => {
    if (formas.length === 0) {
      // If no shapes exist, just zoom normally
      handleZoom(delta)
      return
    }

    // Collect all points from formas
    const allPoints: Point[] = []
    formas.forEach((forma) => {
      allPoints.push(...forma.points)
    })

    // Calculate the bounds of all shapes
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    allPoints.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    // Calculate the center of all shapes
    const shapesCenterX = (minX + maxX) / 2
    const shapesCenterY = (minY + maxY) / 2

    // Get the center of the viewport
    const viewportWidth = svgContainerRef.current?.clientWidth || 0
    const viewportHeight = svgContainerRef.current?.clientHeight || 0
    const viewportCenterX = viewportWidth / 2
    const viewportCenterY = viewportHeight / 2

    // Calculate the offset from the center
    const offsetX = shapesCenterX - viewportCenterX
    const offsetY = shapesCenterY - viewportCenterY

    // Calculate the new zoom level
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta))

    // Calculate the zoom factor
    const zoomFactor = newZoom / zoom

    // Update pan to keep the center of shapes in the same position
    setPan((prev) => ({
      x: prev.x - offsetX * (zoomFactor - 1),
      y: prev.y - offsetY * (zoomFactor - 1),
    }))

    // Update zoom
    setZoom(newZoom)
  }

  // Handle undo operation
  const handleUndo = () => {
    if (isMovingRef.current) {
      // If we're in the middle of a movement, restore to the initial state
      setFormasState(movementStartState.current)
      if (windowId) {
        setFormas(windowId, instanceId, movementStartState.current)
      }
      setIsMoving(false)
      isMovingRef.current = false
      setSelectedShape(null)
      return
    }

    // Normal undo behavior when not moving
    const previousState = undo()
    if (previousState) {
      setFormasState(previousState)
      if (windowId) {
        setFormas(windowId, instanceId, previousState)
      }
    }
  }

  // Update map image state setter
  const handleMapImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const img = new window.Image()
        img.onload = () => {
          setMapImageState(imageUrl)
          setMapDimensionsState({
            width: img.width,
            height: img.height,
          })
        }
        img.src = imageUrl
      }
      reader.onerror = () => {
        alert('Erro ao ler o arquivo. Por favor, tente novamente.')
      }
      reader.readAsDataURL(file)
    }
  }

  // Update map opacity state setter
  const handleMapOpacityChange = (opacity: number) => {
    setMapOpacityState(opacity)
  }

  // Update map remove handler
  const handleRemoveMapImage = () => {
    setMapImageState(null)
    setMapOpacityState(0.5)
  }

  return (
    <div className='relative'>
      <div
        ref={containerRef}
        className={cn('h-screen flex flex-col bg-background relative', {
          'fixed inset-0 z-[9998] w-screen m-0 p-2': isFullscreen,
        })}
      >
        <Toolbox
          toolMode={toolMode}
          setToolMode={setToolMode}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          selectedShape={selectedShape}
          isAddingPoints={isAddingPoints}
          isFullscreen={isFullscreen}
          mapImage={mapImage}
          mapOpacity={mapOpacity}
          setMapOpacity={handleMapOpacityChange}
          currentFillColor={currentFillColor}
          currentBorderColor={currentBorderColor}
          onUploadMap={() => fileInputRef.current?.click()}
          onRemoveMap={handleRemoveMapImage}
          onRotateLeft={() =>
            selectedShape
              ? handleRotateShape('left')
              : handleRotateCanvas('left')
          }
          onRotateRight={() =>
            selectedShape
              ? handleRotateShape('right')
              : handleRotateCanvas('right')
          }
          onDuplicateShape={handleDuplicateShape}
          onSendToBack={handleSendToBack}
          onBringToFront={handleBringToFront}
          onCancelPoints={handleCancelPoints}
          onToggleFullscreen={toggleFullscreen}
          onZoomIn={() => handleZoomWithCenter(0.1)}
          onZoomOut={() => handleZoomWithCenter(-0.1)}
          onPan={handlePan}
          onFillColorChange={handleFillColorChange}
          onBorderColorChange={handleBorderColorChange}
          onCenter={handleCenter}
          onExportSVG={handleExportSVG}
          onExportShapesOnly={handleExportShapesOnly}
          onImportSVG={handleImportSVG}
          onUndo={handleUndo}
          canUndo={canUndo}
          onEditVertices={handleEditVertices}
          isEditingVertices={isEditingVertices}
          svgRef={svgRef}
          formas={formas}
          setFormas={setFormas}
          windowId={windowId}
          instanceId={instanceId}
          saveToHistory={saveToHistory}
          setFormasState={setFormasState}
          setTempPoints={setTempPoints}
          setCurrentPoints={setCurrentPoints}
          setIsAddingPoints={setIsAddingPoints}
          setSelectedShape={setSelectedShape}
          onDeleteRelationId={handleDeleteRelationId}
        />

        <div
          ref={svgContainerRef}
          className={cn(
            'flex-grow relative overflow-hidden transition-all duration-300 bg-background',
            {
              'h-[calc(100vh-100px)] m-0 w-full': isFullscreen,
              'm-2 mb-24 sm:mb-20': !isFullscreen,
            }
          )}
          style={{
            aspectRatio: '16/9',
            maxHeight: isFullscreen ? 'calc(100vh - 100px)' : 'none',
            minHeight: isFullscreen ? 'calc(100vh - 100px)' : '600px',
          }}
        >
          <input
            type='file'
            accept='image/*'
            onChange={handleMapImageUpload}
            className='hidden'
            ref={fileInputRef}
          />
          <svg
            ref={svgRef}
            width='100%'
            height='100%'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className={cn('absolute inset-0', {
              'cursor-crosshair': isAddingPoints,
              'cursor-default': !isAddingPoints,
              'border-2 border-dashed border-gray-400': !isFullscreen,
            })}
          >
            <g
              transform={`translate(${pan.x + (svgContainerRef.current?.clientWidth || 0) / 2}, ${
                pan.y + (svgContainerRef.current?.clientHeight || 0) / 2
              }) scale(${zoom}) rotate(${canvasRotation.current}) translate(${
                -(svgContainerRef.current?.clientWidth || 0) / 2
              }, ${-(svgContainerRef.current?.clientHeight || 0) / 2})`}
            >
              {mapImage && mapDimensions && (
                <image
                  href={mapImage}
                  width={mapDimensions.width}
                  height={mapDimensions.height}
                  opacity={mapOpacity}
                  preserveAspectRatio='xMidYMid meet'
                  style={{
                    pointerEvents: 'none',
                  }}
                />
              )}
              <SVGComponents
                formas={formas}
                tempPoints={tempPoints}
                currentPoints={currentPoints}
                currentFillColor={currentFillColor}
                currentBorderColor={currentBorderColor}
                selectedShape={selectedShape}
                isMoving={isMoving}
                moveOffset={isMoving ? moveOffset.current : null}
                toolMode={toolMode}
                onShapeClick={handleShapeClick}
                onShapeDoubleClick={handleShapeDoubleClick}
                onDeleteZone={handleDeleteZone}
                onRotationStart={handleRotationStart}
                isEditingVertices={isEditingVertices}
                onVertexMouseDown={handleVertexMouseDown}
              />
            </g>
          </svg>
        </div>
      </div>

      <NamingDialog
        isOpen={isNamingDialogOpen}
        onClose={handleCloseNamingDialog}
        onSave={handleSaveShape}
        isEditing={isEditing}
        newName={newName}
        setNewName={setNewName}
        currentFillColor={currentFillColor}
        currentBorderColor={currentBorderColor}
        onFillColorChange={handleFillColorChange}
        onBorderColorChange={handleBorderColorChange}
        lineType={lineType}
        setLineType={setLineType}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        shapeType={shapeType}
        setShapeType={setShapeType}
        relationId={relationId}
        setRelationId={setRelationId}
        scale={scale}
        setScale={setScale}
        fillOpacity={currentFillOpacity}
        onFillOpacityChange={handleFillOpacityChange}
        textColor={currentTextColor}
        onTextColorChange={handleTextColorChange}
        showBorderColor={showBorderColor}
        setShowBorderColor={setShowBorderColor}
      />
    </div>
  )
}

export default CemiteriosMapa
