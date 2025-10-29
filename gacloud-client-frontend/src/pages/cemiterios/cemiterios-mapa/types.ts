export type Point = {
  x: number
  y: number
}

export type ShapeType = 'Zona' | 'Talhão' | 'Sepultura'

export type LineType = 'solid' | 'dashed' | 'dotted'

export type Shape = {
  id: string
  name: string
  type: 'forma'
  shapeType: ShapeType
  points: Point[]
  fillColor: string
  borderColor: string
  fillOpacity?: number
  textColor?: string
  rotation?: number
  lineType?: LineType
  lineHeight?: number
  relationId?: string
}

export type Forma = Shape

export type SelectedShape = {
  id: string
  type: 'forma'
  index: number
  formaId?: string
}

export type ToolMode = 'select' | 'move' | 'delete' | 'resize' | 'draw'

export type DrawingMode = 'points' | 'rectangle'
