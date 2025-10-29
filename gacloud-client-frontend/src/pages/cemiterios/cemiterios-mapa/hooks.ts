import { useEffect, useRef, useState } from 'react'
import { Forma, Point } from './types'

export const useHistory = (initialState: Forma[] = []) => {
  const [history, setHistory] = useState<Forma[][]>([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const saveToHistory = (newFormas: Forma[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newFormas)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      return history[newIndex]
    }
    return history[historyIndex]
  }

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    canUndo: historyIndex > 0,
  }
}

export const usePanAndZoom = () => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const lastPanPoint = useRef<Point | null>(null)
  const lastPan = useRef({ x: 0, y: 0 })

  const handleZoom = (delta: number) => {
    setZoom((prevZoom: number) => {
      const newZoom = Math.max(0.1, Math.min(5, prevZoom + delta))
      return newZoom
    })
  }

  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const PAN_STEP = 50 // pixels to move per click

    switch (direction) {
      case 'up':
        setPan((prev: { x: number; y: number }) => ({
          ...prev,
          y: prev.y - PAN_STEP,
        }))
        break
      case 'down':
        setPan((prev: { x: number; y: number }) => ({
          ...prev,
          y: prev.y + PAN_STEP,
        }))
        break
      case 'left':
        setPan((prev: { x: number; y: number }) => ({
          ...prev,
          x: prev.x - PAN_STEP,
        }))
        break
      case 'right':
        setPan((prev: { x: number; y: number }) => ({
          ...prev,
          x: prev.x + PAN_STEP,
        }))
        break
    }
  }

  useEffect(() => {
    lastPan.current = { ...pan }
  }, [pan])

  return {
    zoom,
    pan,
    isPanning,
    lastPanPoint,
    lastPan,
    handleZoom,
    handlePan,
    setPan,
    setZoom,
  }
}

export const useFullscreen = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement
      setIsFullscreen(isFullscreenNow)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
