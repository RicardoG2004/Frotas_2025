import React from 'react'
import { Forma, Point, SelectedShape } from '../types'

interface SVGComponentsProps {
  formas: Forma[]
  tempPoints: Point[]
  currentPoints: Point[]
  currentFillColor: string
  currentBorderColor: string
  selectedShape: SelectedShape | null
  isMoving: boolean
  moveOffset: { x: number; y: number } | null
  toolMode: 'select' | 'move' | 'delete' | 'resize' | 'draw'
  onShapeClick: (id: string) => void
  onShapeDoubleClick: (id: string) => void
  onDeleteZone: (e: React.MouseEvent, formaId: string) => void
  onRotationStart: (e: React.MouseEvent, shape: Forma) => void
  isEditingVertices: boolean
  onVertexMouseDown: (e: React.MouseEvent, vertexIndex: number) => void
}

export const SVGComponents: React.FC<SVGComponentsProps> = ({
  formas,
  tempPoints,
  currentPoints,
  currentFillColor,
  selectedShape,
  toolMode,
  onShapeClick,
  onShapeDoubleClick,
  onDeleteZone,
  onRotationStart,
  isEditingVertices,
  onVertexMouseDown,
}) => {
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

  const getShapeCenter = (points: Point[]): Point => {
    const bounds = getShapeBounds(points)
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
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

  return (
    <>
      {formas.map((forma) => {
        const isSelected = selectedShape?.id === forma.id
        const center = getShapeCenter(forma.points)
        const points = forma.points
        const bounds = getShapeBounds(points)
        const rotationHandleDistance = 30 // Distance from the top of the shape to the rotation handle

        return (
          <g key={forma.id}>
            <path
              d={getPathFromPoints(points, 'points', forma.rotation, center)}
              fill={forma.fillColor}
              fillOpacity={forma.fillOpacity ?? 0.2}
              stroke={forma.borderColor}
              strokeWidth={forma.lineHeight || 1}
              strokeDasharray={
                forma.lineType === 'dashed'
                  ? '5,5'
                  : forma.lineType === 'dotted'
                    ? '1,3'
                    : 'none'
              }
              onClick={() => onShapeClick(forma.id)}
              onDoubleClick={() => onShapeDoubleClick(forma.id)}
              style={{ cursor: 'pointer' }}
              data-id={forma.id}
              data-name={forma.name}
              data-type='forma'
            />
            {isSelected && (isEditingVertices || toolMode === 'select') && (
              <>
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={2}
                    fill='white'
                    stroke={forma.borderColor}
                    strokeWidth={1}
                    style={{ cursor: 'move' }}
                    onMouseDown={(e) => onVertexMouseDown(e, index)}
                    transform={`rotate(${forma.rotation || 0}, ${center.x}, ${center.y})`}
                  />
                ))}
                {/* Rotation handle */}
                <g
                  onMouseDown={(e) => onRotationStart(e, forma)}
                  style={{ cursor: 'grab' }}
                >
                  {/* Line from center to rotation handle */}
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={center.x}
                    y2={bounds.minY - rotationHandleDistance - 10}
                    stroke={forma.borderColor}
                    strokeWidth={1}
                    strokeDasharray='2,2'
                  />
                  <circle
                    cx={center.x}
                    cy={bounds.minY - rotationHandleDistance - 10}
                    r={4}
                    fill='white'
                    stroke={forma.borderColor}
                    strokeWidth={1}
                  />
                </g>
              </>
            )}
            <text
              x={center.x}
              y={center.y}
              fill={forma.textColor || forma.fillColor}
              fontSize='8'
              fontWeight='bold'
              textAnchor='middle'
              dominantBaseline='middle'
              transform={`rotate(${forma.rotation || 0}, ${center.x}, ${center.y})`}
              onClick={() => onShapeClick(forma.id)}
              onDoubleClick={() => onShapeDoubleClick(forma.id)}
              style={{ cursor: 'pointer' }}
            >
              {forma.name}
            </text>
            {toolMode === 'delete' && (
              <circle
                cx={points[0].x}
                cy={points[0].y}
                r={8}
                fill='red'
                stroke='white'
                strokeWidth={2}
                onClick={(e) => onDeleteZone(e, forma.id)}
                style={{ cursor: 'pointer' }}
                transform={`rotate(${forma.rotation || 0}, ${center.x}, ${center.y})`}
              />
            )}
          </g>
        )
      })}
      {tempPoints.length > 0 && (
        <g>
          <path
            d={getPathFromPoints(tempPoints, 'points')}
            fill='none'
            stroke={currentFillColor}
            strokeWidth={1}
            strokeDasharray='5,5'
          />
          {tempPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={currentFillColor}
              stroke='white'
              strokeWidth={1}
            />
          ))}
          {tempPoints.length > 0 && (
            <circle
              cx={tempPoints[0].x}
              cy={tempPoints[0].y}
              r={6}
              fill='none'
              stroke={currentFillColor}
              strokeWidth={2}
              strokeDasharray='2,2'
            />
          )}
        </g>
      )}
      {currentPoints.length > 0 && (
        <path
          d={getPathFromPoints(currentPoints, 'points')}
          fill='none'
          stroke={currentFillColor}
          strokeWidth={1}
          strokeDasharray='5,5'
        />
      )}
    </>
  )
}
