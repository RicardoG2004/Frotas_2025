import { Point } from './types'

export const isPointInPolygon = (
  point: Point,
  polygon: Point[],
  rotation?: number,
  center?: Point
): boolean => {
  let inside = false

  // If the shape is rotated, transform the click point coordinates
  let checkPoint = point
  if (rotation && center) {
    // Convert the click point to the shape's coordinate space
    const radians = (-rotation * Math.PI) / 180 // Negative rotation to counter-rotate
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    const dx = point.x - center.x
    const dy = point.y - center.y
    checkPoint = {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos,
    }
  }

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersect =
      yi > checkPoint.y !== yj > checkPoint.y &&
      checkPoint.x < ((xj - xi) * (checkPoint.y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export const getShapeCenter = (points: Point[]): Point => {
  if (points.length === 0) return { x: 0, y: 0 }

  // Calculate the bounding box
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  points.forEach((point) => {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  })

  // Calculate center as the midpoint of the bounding box
  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }
}

export const rotatePoint = (
  point: Point,
  center: Point,
  angle: number
): Point => {
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

export const getPathFromPoints = (
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
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')
    return `${path} Z`
  }

  return ''
}

export const isRectangle = (points: Point[]): boolean => {
  if (points.length !== 5) return false // 4 points + closing point
  const [p1, p2, p3] = points
  const isHorizontal = Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y)
  const isVertical = Math.abs(p2.y - p3.y) > Math.abs(p2.x - p3.x)
  return isHorizontal && isVertical
}

export const getRotationHandlePosition = (points: Point[]): Point => {
  if (points.length < 2) return { x: 0, y: 0 }
  // Use the second point (top-right corner) for rotation handle
  return points[1]
}

export const parseSVGPath = (path: string): Point[] => {
  const points: Point[] = []
  const commands = path.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/)

  let currentX = 0
  let currentY = 0
  let firstPoint: Point | null = null

  commands.forEach((cmd) => {
    const type = cmd[0]
    const params = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)

    switch (type.toUpperCase()) {
      case 'M':
        currentX = params[0]
        currentY = params[1]
        firstPoint = { x: currentX, y: currentY }
        points.push({ x: currentX, y: currentY })
        break
      case 'L':
        currentX = params[0]
        currentY = params[1]
        points.push({ x: currentX, y: currentY })
        break
      case 'Z':
        // Close path by adding the first point only if it's different from the last point
        if (firstPoint && points.length > 0) {
          const lastPoint = points[points.length - 1]
          if (lastPoint.x !== firstPoint.x || lastPoint.y !== firstPoint.y) {
            points.push({ ...firstPoint })
          }
        }
        break
    }
  })

  return points
}

export const transformCoordinates = (
  x: number,
  y: number,
  canvasRotation: number,
  containerWidth: number,
  containerHeight: number
): Point => {
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2

  // Convert to radians
  const radians = (canvasRotation * Math.PI) / 180

  // Translate to origin
  const translatedX = x - centerX
  const translatedY = y - centerY

  // Rotate
  const rotatedX =
    translatedX * Math.cos(-radians) - translatedY * Math.sin(-radians)
  const rotatedY =
    translatedX * Math.sin(-radians) + translatedY * Math.cos(-radians)

  // Translate back
  return {
    x: rotatedX + centerX,
    y: rotatedY + centerY,
  }
}
