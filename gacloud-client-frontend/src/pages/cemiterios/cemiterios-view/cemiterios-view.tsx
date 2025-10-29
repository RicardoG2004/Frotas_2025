import { useEffect, useState, useCallback, useRef } from 'react'
import { ResponseStatus } from '@/types/api/responses'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useWindowsStore } from '@/stores/use-windows-store'
import { CemiterioError } from '@/lib/services/cemiterios/cemiterios-service/cemiterios-errors'
import { useCemiterioSelection } from '@/hooks/use-cemiterio-selection'
import { ShapeModal } from './components/shape-modal'
import { ShapeTooltip } from './components/shape-tooltip'
import { UnifiedToolbox } from './components/unified-toolbox'
import { cemiteriosViewQueries } from './queries/cemiterios-view-queries'
import { useViewStore } from './store/view-store'
import { ShapeData } from './types'

const CACHE_PREFIX = 'cemiterio_svg_'
const CACHE_VERSION = '1' // Increment this when the SVG format changes

const getCacheKey = (cemiterioId: string) =>
  `${CACHE_PREFIX}${CACHE_VERSION}_${cemiterioId}`

const parseAndEnhanceSvg = (svgContent: string): string => {
  console.log('[parseAndEnhanceSvg] Starting SVG parsing')
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')

  // Add basic quality attributes to the root SVG element
  const svgElement = svgDoc.documentElement
  svgElement.setAttribute('shape-rendering', 'geometricPrecision')
  svgElement.setAttribute('text-rendering', 'optimizeLegibility')
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  const shapes = svgDoc.querySelectorAll('path, rect, circle, ellipse, polygon')
  console.log(`[parseAndEnhanceSvg] Found ${shapes.length} shapes to process`)

  shapes.forEach((shape) => {
    const type = shape.getAttribute('data-shape-type')
    if (type) {
      // Store all data attributes in a data-info attribute
      const dataAttributes: ShapeData = { type }
      shape.getAttributeNames().forEach((attr) => {
        if (attr.startsWith('data-')) {
          const key = attr.replace('data-', '')
          const value = shape.getAttribute(attr)
          if (value) {
            dataAttributes[key] = value
          }
        }
      })
      shape.setAttribute('data-info', JSON.stringify(dataAttributes))
      ;(shape as SVGElement).style.cursor = 'pointer'

      // Store original colors and styles
      const originalFill = shape.getAttribute('fill') || 'none'
      const originalStroke = shape.getAttribute('stroke') || '#000000'
      const originalStrokeWidth = shape.getAttribute('stroke-width') || '1'

      shape.setAttribute('data-original-fill', originalFill)
      shape.setAttribute('data-original-stroke', originalStroke)
      shape.setAttribute('data-original-stroke-width', originalStrokeWidth)

      // Add basic hover effect
      shape.addEventListener('mouseenter', () => {
        const fillColor = originalFill.replace('33', '66')
        shape.setAttribute('fill', fillColor)
        shape.setAttribute('stroke', originalStroke)
        shape.setAttribute(
          'stroke-width',
          (parseFloat(originalStrokeWidth) * 1.5).toString()
        )
      })

      shape.addEventListener('mouseleave', () => {
        shape.setAttribute('fill', originalFill)
        shape.setAttribute('stroke', originalStroke)
        shape.setAttribute('stroke-width', originalStrokeWidth)
      })
    }
  })

  console.log('[parseAndEnhanceSvg] SVG parsing completed')
  return svgDoc.documentElement.outerHTML
}

const getCachedSvg = (cemiterioId: string): string | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(cemiterioId))
    if (cached) {
      console.log('[getCachedSvg] Found cached SVG for cemetery:', cemiterioId)
      return cached
    }
    console.log('[getCachedSvg] No cached SVG found for cemetery:', cemiterioId)
    return null
  } catch (error) {
    console.error('[getCachedSvg] Error reading from cache:', error)
    return null
  }
}

const setCachedSvg = (cemiterioId: string, svgContent: string): void => {
  try {
    localStorage.setItem(getCacheKey(cemiterioId), svgContent)
    console.log('[setCachedSvg] Cached SVG for cemetery:', cemiterioId)
  } catch (error) {
    console.error('[setCachedSvg] Error writing to cache:', error)
  }
}

// Add this function after the parseAndEnhanceSvg function
const addLocationMarker = (
  shapeElement: SVGElement,
  shapeData?: ShapeData,
  onMarkerClick?: (event: Event) => void
) => {
  // Calculate the center of the shape
  const bbox = (shapeElement as SVGGraphicsElement).getBBox()
  const centerX = bbox.x + bbox.width / 2
  const centerY = bbox.y + bbox.height / 2

  // Create location icon
  const locationIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  )
  locationIcon.setAttribute('class', 'location-icon')
  locationIcon.setAttribute('transform', `translate(${centerX}, ${centerY})`)

  // Store the shape data in the marker for click handling
  if (shapeData) {
    locationIcon.setAttribute('data-shape-info', JSON.stringify(shapeData))
  }

  // Add circle background
  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  )
  circle.setAttribute('r', '8')
  circle.setAttribute('fill', '#ffffff')
  circle.setAttribute('stroke', '#ffffff')
  circle.setAttribute('stroke-width', '2')
  locationIcon.appendChild(circle)

  // Add location icon
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  icon.setAttribute(
    'd',
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
  )
  icon.setAttribute('fill', 'hsl(var(--primary))')
  // Scale and center the icon
  icon.setAttribute('transform', 'scale(0.35) translate(-12, -12)')
  locationIcon.appendChild(icon)

  // Add click event listener to the marker
  if (onMarkerClick) {
    locationIcon.addEventListener('click', onMarkerClick)
    locationIcon.style.pointerEvents = 'auto'
    locationIcon.style.cursor = 'pointer'
  }

  // Add the location icon to the shape's parent group
  const parentGroup = shapeElement.parentElement
  if (parentGroup) {
    parentGroup.appendChild(locationIcon)
  }
}

export default function CemiteriosView() {
  console.log('[CemiteriosView] Component rendering')
  const { selectedCemiterio } = useCemiterioSelection()
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)
  const currentCemiterioId = useRef<string | null>(null)
  const currentlySelectedShapeRef = useRef<SVGElement | null>(null)

  const { activeWindow } = useWindowsStore()
  const { getViewState, setViewState } = useViewStore()
  const viewState = getViewState(activeWindow || 'default')

  const [scale, setScale] = useState(viewState.scale)
  const [isPanning, setIsPanning] = useState(true)
  const [position, setPosition] = useState(viewState.position || { x: 0, y: 0 })
  const [selectedShape, setSelectedShape] = useState<ShapeData | null>(
    viewState.selectedShape
  )
  const [isShapeModalVisible, setIsShapeModalVisible] = useState(true)
  const [modalOpen, setModalOpen] = useState(viewState.modalOpen)
  const [tooltipData] = useState<ShapeData | null>(viewState.tooltipData)
  const [tooltipPosition, setTooltipPosition] = useState(
    viewState.tooltipPosition
  )
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null)
  const [filteredCount, setFilteredCount] = useState(0)
  const [totalSepulturas, setTotalSepulturas] = useState(0)

  const transformRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const dragDistance = useRef(0)
  const CLICK_THRESHOLD = 5 // pixels
  const MOVEMENT_SPEED = 0.5 // Lower value = slower movement (0.5 = half speed)

  // Add animationFrameId ref
  const animationFrameId = useRef<number | undefined>(undefined)

  // Filter handlers
  const handleFilterChange = useCallback(
    (_filteredShapes: SVGElement[]) => {
      // Recalculate filtered count and total count
      if (svgElement) {
        const shapes = svgElement.querySelectorAll(
          'path, rect, circle, ellipse, polygon'
        )
        let filteredCount = 0
        let totalCount = 0

        shapes.forEach((shape) => {
          const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
          if (shapeType === 'sepultura') {
            totalCount++
            // Only count visible sepultura shapes (not hidden by filters)
            if (!shape.classList.contains('hidden')) {
              filteredCount++
            }
          }
        })

        setFilteredCount(filteredCount)
        setTotalSepulturas(totalCount)
      }
    },
    [svgElement]
  )

  const handleShapeHighlight = useCallback((_shapeIds: string[]) => {
    // Handle shape highlighting if needed
  }, [])

  const handleClearHighlights = useCallback(() => {
    // Use requestAnimationFrame to defer DOM updates and improve performance
    requestAnimationFrame(() => {
      if (svgElement) {
        const allShapes = svgElement.querySelectorAll(
          'path, rect, circle, ellipse, polygon'
        )
        allShapes.forEach((shape) => {
          shape.classList.remove('highlighted-shape')
          shape.classList.remove('filtered-shape')
          shape.classList.remove('hidden')
        })

        // Recalculate filtered count and total count after clearing
        let filteredCount = 0
        let totalCount = 0
        allShapes.forEach((shape) => {
          const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
          if (shapeType === 'sepultura') {
            totalCount++
            if (!shape.classList.contains('hidden')) {
              filteredCount++
            }
          }
        })
        setFilteredCount(filteredCount)
        setTotalSepulturas(totalCount)
      }
    })
  }, [svgElement])

  // Update store when state changes
  useEffect(() => {
    if (activeWindow) {
      setViewState(activeWindow, {
        scale,
        position,
        isPanning,
        selectedShape,
        modalOpen,
        tooltipData,
        tooltipPosition,
      })
    }
  }, [
    scale,
    position,
    isPanning,
    selectedShape,
    modalOpen,
    tooltipData,
    tooltipPosition,
    activeWindow,
    setViewState,
  ])

  // Add CSS for hover effects and filtered shapes
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      svg path, svg rect, svg circle, svg ellipse, svg polygon {
        transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      .transform-container {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      .location-icon {
        pointer-events: none;
      }
      .location-icon circle {
        fill: #ffffff !important;
        stroke: #ffffff !important;
      }
      .location-icon path {
        fill: hsl(var(--primary)) !important;
      }
      .filtered-shape {
        stroke: #ff6b35 !important;
        stroke-width: 3px !important;
        stroke-dasharray: 5,5 !important;
        animation: pulse 2s infinite;
        opacity: 1 !important;
        will-change: stroke, stroke-width, opacity;
        transform: translateZ(0);
      }
      .highlighted-shape {
        stroke: #4caf50 !important;
        stroke-width: 4px !important;
        will-change: stroke, stroke-width;
        transform: translateZ(0);
      }
      @keyframes pulse {
        0% { stroke-opacity: 1; }
        50% { stroke-opacity: 0.5; }
        100% { stroke-opacity: 1; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) {
      isDragging.current = true
      startPos.current = { x: e.clientX, y: e.clientY }
      currentPos.current = { ...position }
      dragDistance.current = 0
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  // Add touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      e.preventDefault()
      isDragging.current = true
      const touch = e.touches[0]
      startPos.current = { x: touch.clientX, y: touch.clientY }
      currentPos.current = { ...position }
      dragDistance.current = 0
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)
    }
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        e.preventDefault()
        const touch = e.touches[0]

        // Calculate drag distance with improved precision
        const dx = (touch.clientX - startPos.current.x) * MOVEMENT_SPEED
        const dy = (touch.clientY - startPos.current.y) * MOVEMENT_SPEED
        dragDistance.current = Math.sqrt(dx * dx + dy * dy)

        // Optimize animation frame handling
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }

        // Use requestAnimationFrame with optimized transform
        animationFrameId.current = requestAnimationFrame(() => {
          const newX = currentPos.current.x + dx
          const newY = currentPos.current.y + dy

          if (transformRef.current) {
            // Use matrix3d for better performance
            const matrix = new DOMMatrix()
              .translateSelf(newX, newY, 0)
              .scaleSelf(scale, scale, 1)
            transformRef.current.style.transform = matrix.toString()
          }
        })
      }
    },
    [scale]
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return

      isDragging.current = false
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)

      // Cancel any pending animation frame
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }

      // Update the position state after the drag is complete
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0]
        const dx = (touch.clientX - startPos.current.x) * MOVEMENT_SPEED
        const dy = (touch.clientY - startPos.current.y) * MOVEMENT_SPEED
        setPosition({
          x: currentPos.current.x + dx,
          y: currentPos.current.y + dy,
        })
      }
    },
    [handleTouchMove]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging.current) {
        // Calculate drag distance with improved precision
        const dx = (e.clientX - startPos.current.x) * MOVEMENT_SPEED
        const dy = (e.clientY - startPos.current.y) * MOVEMENT_SPEED
        dragDistance.current = Math.sqrt(dx * dx + dy * dy)

        // Optimize animation frame handling
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }

        // Use requestAnimationFrame with optimized transform
        animationFrameId.current = requestAnimationFrame(() => {
          const newX = currentPos.current.x + dx
          const newY = currentPos.current.y + dy

          if (transformRef.current) {
            // Use matrix3d for better performance
            const matrix = new DOMMatrix()
              .translateSelf(newX, newY, 0)
              .scaleSelf(scale, scale, 1)
            transformRef.current.style.transform = matrix.toString()
          }
        })
      }

      // Optimize tooltip updates - only update if tooltip is actually visible
      if (tooltipData && tooltipPosition) {
        const newPos = { x: e.clientX, y: e.clientY }
        // Only update if position changed significantly to reduce re-renders
        if (
          Math.abs(newPos.x - tooltipPosition.x) > 5 ||
          Math.abs(newPos.y - tooltipPosition.y) > 5
        ) {
          requestAnimationFrame(() => {
            setTooltipPosition(newPos)
          })
        }
      }
    },
    [scale, tooltipData, tooltipPosition]
  )

  // Add this new function to handle shape selection
  const handleShapeSelect = useCallback((shapeData: ShapeData) => {
    console.log('Selected shape data:', shapeData)
    requestAnimationFrame(() => {
      // Only show modal for sepultura type
      if (shapeData['shape-type']?.toLowerCase() === 'sepultura') {
        setSelectedShape(shapeData)
        setIsShapeModalVisible(true)
        setModalOpen(true)
      } else {
        // For other types, just update the selected shape without showing modal
        setSelectedShape(shapeData)
        setIsShapeModalVisible(false)
        setModalOpen(false)
      }
    })
  }, [])

  // Update the shape click handler to use the new function
  const handleShapeClick = useCallback(
    (event: Event) => {
      // Prevent event propagation
      event.stopPropagation()
      event.preventDefault()

      // Only check drag distance, not isDragging
      if (dragDistance.current > CLICK_THRESHOLD) return

      const target = event.target as SVGElement
      let shapeElement = target

      // If clicking on text, find the associated shape
      if (target.tagName.toLowerCase() === 'text') {
        // Try to find the closest shape element
        const parentGroup = target.closest('g')
        if (parentGroup) {
          const shape = parentGroup.querySelector(
            'path, rect, circle, ellipse, polygon'
          )
          if (shape) {
            shapeElement = shape as SVGElement
          }
        }
      }

      const dataInfo = shapeElement.getAttribute('data-info')
      if (dataInfo) {
        try {
          const shapeData = JSON.parse(dataInfo) as ShapeData

          // Handle shape selection
          handleShapeSelect(shapeData)

          // Remove all existing location icons first
          const svgElement = transformRef.current?.querySelector('svg')
          if (svgElement) {
            const existingIcons = svgElement.querySelectorAll('.location-icon')
            existingIcons.forEach((icon) => icon.remove())
          }

          // Reset previous highlight if there was a previously selected shape
          if (currentlySelectedShapeRef.current) {
            const prevShape = currentlySelectedShapeRef.current
            requestAnimationFrame(() => {
              prevShape.setAttribute(
                'fill',
                prevShape.getAttribute('data-original-fill') || 'none'
              )
              prevShape.setAttribute(
                'stroke',
                prevShape.getAttribute('data-original-stroke') || '#000000'
              )
              prevShape.setAttribute(
                'stroke-width',
                prevShape.getAttribute('data-original-stroke-width') || '1'
              )
            })
          }

          // Add location marker and highlight in the same frame
          requestAnimationFrame(() => {
            addLocationMarker(
              shapeElement,
              shapeData,
              handleLocationMarkerClick
            )

            // Get original colors and styles
            const originalFill =
              shapeElement.getAttribute('data-original-fill') || 'none'
            const originalStroke =
              shapeElement.getAttribute('data-original-stroke') || '#000000'
            const originalStrokeWidth =
              shapeElement.getAttribute('data-original-stroke-width') || '1'

            // Create a darker highlight effect
            let fillColor = originalFill
            if (originalFill !== 'none') {
              // If the fill is a hex color
              if (originalFill.startsWith('#')) {
                // Convert hex to RGB
                const r = parseInt(originalFill.slice(1, 3), 16)
                const g = parseInt(originalFill.slice(3, 5), 16)
                const b = parseInt(originalFill.slice(5, 7), 16)
                // Darken by 60%
                const darkenFactor = 0.4
                const newR = Math.floor(r * darkenFactor)
                const newG = Math.floor(g * darkenFactor)
                const newB = Math.floor(b * darkenFactor)
                fillColor = `rgb(${newR}, ${newG}, ${newB})`
              } else if (originalFill.startsWith('rgba')) {
                // If the fill is rgba, darken the RGB components
                const rgbaMatch = originalFill.match(
                  /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
                )
                if (rgbaMatch) {
                  const r = parseInt(rgbaMatch[1])
                  const g = parseInt(rgbaMatch[2])
                  const b = parseInt(rgbaMatch[3])
                  const a = parseFloat(rgbaMatch[4])
                  // Darken by 60%
                  const darkenFactor = 0.4
                  const newR = Math.floor(r * darkenFactor)
                  const newG = Math.floor(g * darkenFactor)
                  const newB = Math.floor(b * darkenFactor)
                  fillColor = `rgba(${newR}, ${newG}, ${newB}, ${a})`
                }
              }
            }

            // Apply the darker highlight
            shapeElement.setAttribute('fill', fillColor)
            shapeElement.setAttribute('stroke', originalStroke)
            shapeElement.setAttribute(
              'stroke-width',
              (parseFloat(originalStrokeWidth) * 2).toString()
            )

            // Store reference to currently selected shape
            currentlySelectedShapeRef.current = shapeElement
          })
        } catch (error) {
          console.error('[handleShapeClick] Error parsing shape data:', error)
        }
      }
    },
    [handleShapeSelect]
  )

  // Handle location marker clicks
  const handleLocationMarkerClick = useCallback((event: Event) => {
    // Prevent event propagation
    event.stopPropagation()
    event.preventDefault()

    const target = event.target as SVGElement
    const locationMarker = target.closest('.location-icon') as SVGElement

    if (locationMarker) {
      const shapeInfo = locationMarker.getAttribute('data-shape-info')
      if (shapeInfo) {
        try {
          const shapeData = JSON.parse(shapeInfo) as ShapeData

          // Only show modal for sepultura type
          if (shapeData['shape-type']?.toLowerCase() === 'sepultura') {
            setSelectedShape(shapeData)
            setIsShapeModalVisible(true)
            setModalOpen(true)
          }
        } catch (error) {
          console.error(
            '[handleLocationMarkerClick] Error parsing shape data:',
            error
          )
        }
      }
    }
  }, [])

  // Optimize modal state updates
  const handleModalClose = useCallback(() => {
    requestAnimationFrame(() => {
      setIsShapeModalVisible(false)
      setModalOpen(false)
      // Remove this line to keep the selectedShape state
      // setSelectedShape(null)

      // Reset the highlight but keep the location icon
      if (currentlySelectedShapeRef.current) {
        const shape = currentlySelectedShapeRef.current
        shape.setAttribute(
          'fill',
          shape.getAttribute('data-original-fill') || 'none'
        )
        shape.setAttribute(
          'stroke',
          shape.getAttribute('data-original-stroke') || '#000000'
        )
        shape.setAttribute(
          'stroke-width',
          shape.getAttribute('data-original-stroke-width') || '1'
        )
        shape.removeAttribute('filter')
      }
    })
  }, [])

  // Add event listeners for shape clicks
  useEffect(() => {
    if (!transformRef.current) return

    const svgElement = transformRef.current.querySelector('svg')
    if (!svgElement) return

    // Add click event listener to the SVG element
    const handleSvgClick = (event: MouseEvent) => {
      const target = event.target as SVGElement
      if (target.tagName.toLowerCase() === 'svg') {
        // Clicked on empty space, close modal
        handleModalClose()
      }
    }
    svgElement.addEventListener('click', handleSvgClick)

    // Add click event listeners to all shapes and text elements
    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon, text'
    )
    shapes.forEach((shape) => {
      // Remove any existing click listeners
      shape.removeEventListener('click', handleShapeClick)
      // Add new click listener
      shape.addEventListener('click', handleShapeClick)
      // Make sure the shape is clickable
      ;(shape as SVGElement).style.pointerEvents = 'auto'
      ;(shape as SVGElement).style.cursor = 'pointer'
    })

    // Also add click listeners to all groups that might contain text
    const groups = svgElement.querySelectorAll('g')
    groups.forEach((group) => {
      group.addEventListener('click', (event) => {
        // If the click is directly on the group (not a child element)
        if (event.target === group) {
          const shape = group.querySelector(
            'path, rect, circle, ellipse, polygon'
          )
          if (shape) {
            handleShapeClick(new MouseEvent('click', { bubbles: true }))
          }
        }
      })
      ;(group as SVGElement).style.pointerEvents = 'auto'
      ;(group as SVGElement).style.cursor = 'pointer'
    })

    // Add click event listeners to location markers
    const locationMarkers = svgElement.querySelectorAll('.location-icon')
    locationMarkers.forEach((marker) => {
      // Remove any existing click listeners
      marker.removeEventListener('click', handleLocationMarkerClick)
      // Add new click listener
      marker.addEventListener('click', handleLocationMarkerClick)
      // Make sure the marker is clickable
      ;(marker as SVGElement).style.pointerEvents = 'auto'
      ;(marker as SVGElement).style.cursor = 'pointer'
    })

    return () => {
      svgElement.removeEventListener('click', handleSvgClick)
      shapes.forEach((shape) => {
        shape.removeEventListener('click', handleShapeClick)
      })
      groups.forEach((group) => {
        group.removeEventListener('click', handleShapeClick)
      })
      locationMarkers.forEach((marker) => {
        marker.removeEventListener('click', handleLocationMarkerClick)
      })
    }
  }, [
    handleShapeClick,
    handleLocationMarkerClick,
    handleModalClose,
    svgContent,
  ])

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return

      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      // Cancel any pending animation frame
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }

      // Update the position state after the drag is complete
      const dx = (e.clientX - startPos.current.x) * MOVEMENT_SPEED
      const dy = (e.clientY - startPos.current.y) * MOVEMENT_SPEED
      setPosition({
        x: currentPos.current.x + dx,
        y: currentPos.current.y + dy,
      })
    },
    [handleMouseMove]
  )

  // Add this new effect for performance optimization
  useEffect(() => {
    if (!transformRef.current) return

    const style = document.createElement('style')
    style.textContent = `
      .transform-container {
        transform-origin: center center;
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        contain: layout paint;
        isolation: isolate;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .transform-container svg {
        shape-rendering: geometricPrecision;
        text-rendering: optimizeLegibility;
        contain: layout paint;
        isolation: isolate;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        pointer-events: all;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .transform-container svg path,
      .transform-container svg rect,
      .transform-container svg circle,
      .transform-container svg ellipse,
      .transform-container svg polygon,
      .transform-container svg text,
      .transform-container svg g {
        will-change: transform, fill, stroke, stroke-width;
        transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        pointer-events: auto;
        cursor: pointer;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .transform-container svg text {
        pointer-events: auto;
        cursor: pointer;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .transform-container svg g {
        pointer-events: all;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .transform-container svg path.hidden,
      .transform-container svg rect.hidden,
      .transform-container svg circle.hidden,
      .transform-container svg ellipse.hidden,
      .transform-container svg polygon.hidden {
        display: none !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Update transform with optimized matrix
  useEffect(() => {
    if (transformRef.current) {
      const matrix = new DOMMatrix()
        .translateSelf(position.x, position.y, 0)
        .scaleSelf(scale, scale, 1)
      transformRef.current.style.transform = matrix.toString()
    }
  }, [scale, position])

  // Optimize SVG parsing
  const fetchSvg = useCallback(async () => {
    if (!selectedCemiterio) {
      console.log('[fetchSvg] No cemetery selected')
      setError('Nenhum cemitério selecionado')
      setLoading(false)
      return
    }

    // Prevent duplicate fetches for the same cemetery
    if (currentCemiterioId.current === selectedCemiterio.id) {
      console.log('[fetchSvg] Skipping duplicate fetch for same cemetery')
      return
    }

    console.log(
      '[fetchSvg] Starting fetch with selectedCemiterio:',
      selectedCemiterio.id
    )
    currentCemiterioId.current = selectedCemiterio.id

    try {
      console.log('[fetchSvg] Setting loading state')
      setLoading(true)
      setError(null)

      // Check cache first
      const cachedSvg = getCachedSvg(selectedCemiterio.id)
      if (cachedSvg) {
        console.log('[fetchSvg] Using cached SVG')
        if (isMounted.current) {
          setSvgContent(cachedSvg)
          setLoading(false)
        }
        return
      }

      // If not in cache, fetch from API
      console.log('[fetchSvg] Fetching from API')
      const response = await cemiteriosViewQueries.getCemiterioSvg(
        selectedCemiterio.id
      )
      console.log('[fetchSvg] Received API response:', response.info?.status)

      if (!isMounted.current) return

      if (!response.info) {
        console.log('[fetchSvg] Invalid API response')
        setError('Resposta inválida da API')
        return
      }

      if (response.info.status === ResponseStatus.Failure) {
        // Check for specific error messages from the API
        const errorMessage =
          response.info.messages?.['$']?.[0] ||
          Object.values(response.info.messages || {})[0]?.[0]
        if (errorMessage) {
          console.log('[fetchSvg] API error:', errorMessage)
          setError(errorMessage)
        } else if (response.status === 404) {
          setError('Este cemitério não possui um mapa SVG')
        } else if (response.status === 403) {
          setError('Você não tem permissão para acessar o mapa deste cemitério')
        } else if (response.status === 401) {
          setError('Sua sessão expirou. Por favor, faça login novamente')
        } else {
          setError('Não foi possível carregar o mapa do cemitério')
        }
        return
      }

      if (!response.info.data) {
        console.log('[fetchSvg] No data in response')
        setError('O mapa do cemitério não está disponível')
        return
      }

      console.log('[fetchSvg] Processing SVG data')
      const enhancedSvg = parseAndEnhanceSvg(response.info.data)

      // Cache the enhanced SVG
      setCachedSvg(selectedCemiterio.id, enhancedSvg)

      if (isMounted.current) {
        setSvgContent(enhancedSvg)
        console.log('[fetchSvg] SVG content updated')
      }
    } catch (err) {
      console.error('[fetchSvg] Error occurred:', err)
      if (isMounted.current) {
        if (err instanceof CemiterioError) {
          setError(err.message)
        } else if (err instanceof Error) {
          if (err.message.includes('Network Error')) {
            setError(
              'Erro de conexão. Verifique sua internet e tente novamente'
            )
          } else if (err.message.includes('timeout')) {
            setError('A requisição demorou muito tempo. Tente novamente')
          } else {
            setError(`Erro ao carregar o mapa: ${err.message}`)
          }
        } else {
          setError('Ocorreu um erro inesperado ao carregar o mapa')
        }
      }
    } finally {
      if (isMounted.current) {
        console.log('[fetchSvg] Setting loading to false')
        setLoading(false)
      }
    }
  }, [selectedCemiterio])

  useEffect(() => {
    console.log(
      '[useEffect] Effect triggered, selectedCemiterio:',
      selectedCemiterio?.id
    )
    fetchSvg()
    return () => {
      console.log(
        '[useEffect] Cleanup - component unmounting or cemetery changed'
      )
    }
  }, [fetchSvg])

  // Add this new effect to handle initial state restoration
  useEffect(() => {
    if (!svgContent || !transformRef.current) return

    const svgElement = transformRef.current.querySelector('svg')
    if (!svgElement) return

    // Set the SVG element for the filter
    console.log('[CemiteriosView] Setting SVG element for filter:', svgElement)
    setSvgElement(svgElement as SVGElement)

    // Initialize filtered count and total sepulturas
    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    let filteredCount = 0
    let totalCount = 0

    shapes.forEach((shape) => {
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
      if (shapeType === 'sepultura') {
        totalCount++
        // Only count visible sepultura shapes (not hidden by filters)
        if (!shape.classList.contains('hidden')) {
          filteredCount++
        }
      }
    })

    setFilteredCount(filteredCount)
    setTotalSepulturas(totalCount)

    // If we have a selected shape in the view state, restore its marker
    if (selectedShape) {
      const shapes = svgElement.querySelectorAll(
        'path, rect, circle, ellipse, polygon'
      )
      shapes.forEach((shape) => {
        const dataInfo = shape.getAttribute('data-info')
        if (dataInfo) {
          try {
            const shapeData = JSON.parse(dataInfo) as ShapeData
            if (JSON.stringify(shapeData) === JSON.stringify(selectedShape)) {
              // Remove any existing location icons first
              const existingIcons =
                svgElement.querySelectorAll('.location-icon')
              existingIcons.forEach((icon) => icon.remove())

              // Add location marker
              addLocationMarker(shape as SVGElement)

              // Store reference to currently selected shape
              currentlySelectedShapeRef.current = shape as SVGElement

              // Get original colors and styles
              const originalFill =
                shape.getAttribute('data-original-fill') || 'none'
              const originalStroke =
                shape.getAttribute('data-original-stroke') || '#000000'
              const originalStrokeWidth =
                shape.getAttribute('data-original-stroke-width') || '1'

              // Create a darker highlight effect
              let fillColor = originalFill
              if (originalFill !== 'none') {
                // If the fill is a hex color
                if (originalFill.startsWith('#')) {
                  // Convert hex to RGB
                  const r = parseInt(originalFill.slice(1, 3), 16)
                  const g = parseInt(originalFill.slice(3, 5), 16)
                  const b = parseInt(originalFill.slice(5, 7), 16)
                  // Darken by 60%
                  const darkenFactor = 0.4
                  const newR = Math.floor(r * darkenFactor)
                  const newG = Math.floor(g * darkenFactor)
                  const newB = Math.floor(b * darkenFactor)
                  fillColor = `rgb(${newR}, ${newG}, ${newB})`
                } else if (originalFill.startsWith('rgba')) {
                  // If the fill is rgba, darken the RGB components
                  const rgbaMatch = originalFill.match(
                    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
                  )
                  if (rgbaMatch) {
                    const r = parseInt(rgbaMatch[1])
                    const g = parseInt(rgbaMatch[2])
                    const b = parseInt(rgbaMatch[3])
                    const a = parseFloat(rgbaMatch[4])
                    // Darken by 60%
                    const darkenFactor = 0.4
                    const newR = Math.floor(r * darkenFactor)
                    const newG = Math.floor(g * darkenFactor)
                    const newB = Math.floor(b * darkenFactor)
                    fillColor = `rgba(${newR}, ${newG}, ${newB}, ${a})`
                  }
                }
              }

              // Apply the darker highlight
              shape.setAttribute('fill', fillColor)
              shape.setAttribute('stroke', originalStroke)
              shape.setAttribute(
                'stroke-width',
                (parseFloat(originalStrokeWidth) * 2).toString()
              )
            }
          } catch (error) {
            console.error('[useEffect] Error parsing shape data:', error)
          }
        }
      })
    }

    // Apply the saved scale and position
    if (transformRef.current) {
      transformRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`
    }
  }, [svgContent, selectedShape, scale, position])

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.2, 3)
      return newScale
    })
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.2, 0.5)
      return newScale
    })
  }

  const handleReset = () => {
    setScale(1.4)
    setPosition({ x: 0, y: 0 })
  }

  if (loading) {
    console.log('[CemiteriosView] Rendering loading state')
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    console.log('[CemiteriosView] Rendering error state:', error)
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <Typography
          sx={{
            color: 'hsl(var(--primary))',
            fontWeight: 500,
          }}
          variant='h6'
        >
          {error}
        </Typography>
      </Box>
    )
  }

  console.log('[CemiteriosView] Rendering SVG content')
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'transparent',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          bgcolor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          isolation: 'isolate',
          contain: 'layout paint',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          ref={transformRef}
          className='transform-container'
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            cursor: isPanning ? 'grabbing' : 'default',
            willChange: 'transform',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitBackfaceVisibility: 'hidden',
            WebkitPerspective: '1000px',
            WebkitTransform: 'translate3d(0,0,0)',
            contain: 'layout paint',
            isolation: 'isolate',
            zIndex: 1,
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            imageRendering: 'crisp-edges',
            shapeRendering: 'geometricPrecision',
            textRendering: 'optimizeLegibility',
          }}
        />
      </Box>

      {/* Unified Toolbox - Bottom Center */}
      <UnifiedToolbox
        // Control props
        scale={scale}
        isPanning={isPanning}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onTogglePanning={() => setIsPanning(!isPanning)}
        onReset={handleReset}
        // Filter props
        svgElement={svgElement}
        onFilterChange={handleFilterChange}
        onShapeHighlight={handleShapeHighlight}
        onClearHighlights={handleClearHighlights}
        filteredCount={filteredCount}
        totalSepulturas={totalSepulturas}
      />

      {tooltipData && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            zIndex: 1000,
            pointerEvents: 'none',
            contain: 'layout paint',
            isolation: 'isolate',
          }}
        >
          <ShapeTooltip data={tooltipData} />
        </Box>
      )}

      {selectedShape && isShapeModalVisible && (
        <ShapeModal data={selectedShape} onClose={handleModalClose} />
      )}
    </Box>
  )
}
