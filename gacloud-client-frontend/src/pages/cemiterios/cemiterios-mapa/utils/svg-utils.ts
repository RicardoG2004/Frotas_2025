import { Point } from '../types'

export function parseSVGPath(d: string): Point[] {
  const commands = d.match(/[MLHVCSQTAZmlhvcsqtaz]|[+-]?\d*\.?\d+/g) || []
  const points: Point[] = []
  let currentX = 0
  let currentY = 0

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]
    if (cmd === 'M' || cmd === 'm') {
      currentX = parseFloat(commands[++i])
      currentY = parseFloat(commands[++i])
      if (cmd === 'm') {
        currentX += points[points.length - 1]?.x || 0
        currentY += points[points.length - 1]?.y || 0
      }
      points.push({ x: currentX, y: currentY })
    } else if (cmd === 'L' || cmd === 'l') {
      currentX = parseFloat(commands[++i])
      currentY = parseFloat(commands[++i])
      if (cmd === 'l') {
        currentX += points[points.length - 1]?.x || 0
        currentY += points[points.length - 1]?.y || 0
      }
      points.push({ x: currentX, y: currentY })
    } else if (cmd === 'H' || cmd === 'h') {
      currentX = parseFloat(commands[++i])
      if (cmd === 'h') {
        currentX += points[points.length - 1]?.x || 0
      }
      points.push({ x: currentX, y: currentY })
    } else if (cmd === 'V' || cmd === 'v') {
      currentY = parseFloat(commands[++i])
      if (cmd === 'v') {
        currentY += points[points.length - 1]?.y || 0
      }
      points.push({ x: currentX, y: currentY })
    } else if (cmd === 'Z' || cmd === 'z') {
      if (points.length > 0) {
        points.push({ ...points[0] })
      }
    }
  }

  return points
}
