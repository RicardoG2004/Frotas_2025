type RGB = { r: number; g: number; b: number }

const startColor: RGB = { r: 109, g: 40, b: 217 } // purple-600
const endColor: RGB = { r: 34, g: 197, b: 94 } // green-500

const interpolateColor = (ratio: number): RGB => ({
  r: Math.round(startColor.r + (endColor.r - startColor.r) * ratio),
  g: Math.round(startColor.g + (endColor.g - startColor.g) * ratio),
  b: Math.round(startColor.b + (endColor.b - startColor.b) * ratio),
})

const lightenColor = (color: RGB, amount = 0.3): RGB => ({
  r: Math.round(color.r + (255 - color.r) * amount),
  g: Math.round(color.g + (255 - color.g) * amount),
  b: Math.round(color.b + (255 - color.b) * amount),
})

const rgbToCss = (color: RGB) => `rgb(${color.r}, ${color.g}, ${color.b})`

export const createIconGradient = (index: number, total: number) => {
  const safeTotal = Math.max(total, 1)
  const ratio = safeTotal === 1 ? 0 : index / (safeTotal - 1)
  const baseColor = interpolateColor(ratio)
  const highlightColor = lightenColor(baseColor)

  return `linear-gradient(135deg, ${rgbToCss(baseColor)}, ${rgbToCss(
    highlightColor
  )})`
}


