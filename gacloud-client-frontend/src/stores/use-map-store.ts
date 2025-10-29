import { Forma } from '@/pages/cemiterios/cemiterios-mapa/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MapState {
  formas: Forma[]
  mapImage: string | null
  mapDimensions: { width: number; height: number } | null
  mapOpacity: number
  windowId: string
  instanceId: string
}

interface MapStore {
  maps: Record<string, MapState>
  setFormas: (windowId: string, instanceId: string, formas: Forma[]) => void
  setMapImage: (
    windowId: string,
    instanceId: string,
    image: string | null
  ) => void
  setMapDimensions: (
    windowId: string,
    instanceId: string,
    dimensions: { width: number; height: number } | null
  ) => void
  setMapOpacity: (windowId: string, instanceId: string, opacity: number) => void
  resetMapState: (windowId: string, instanceId: string) => void
  getMapState: (windowId: string, instanceId: string) => MapState
  cleanupWindowData: (windowId: string) => void
}

const defaultMapState: MapState = {
  formas: [],
  mapImage: null,
  mapDimensions: null,
  mapOpacity: 0.5,
  windowId: '',
  instanceId: '',
}

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      maps: {},

      getMapState: (windowId: string, instanceId: string) => {
        const key = `${windowId}-${instanceId}`
        return get().maps[key] || { ...defaultMapState, windowId, instanceId }
      },

      setFormas: (windowId: string, instanceId: string, formas: Forma[]) => {
        const key = `${windowId}-${instanceId}`
        set((state) => ({
          maps: {
            ...state.maps,
            [key]: {
              ...(state.maps[key] || {
                ...defaultMapState,
                windowId,
                instanceId,
              }),
              formas,
            },
          },
        }))
      },

      setMapImage: (
        windowId: string,
        instanceId: string,
        mapImage: string | null
      ) => {
        const key = `${windowId}-${instanceId}`
        set((state) => ({
          maps: {
            ...state.maps,
            [key]: {
              ...(state.maps[key] || {
                ...defaultMapState,
                windowId,
                instanceId,
              }),
              mapImage,
            },
          },
        }))
      },

      setMapDimensions: (
        windowId: string,
        instanceId: string,
        mapDimensions: { width: number; height: number } | null
      ) => {
        const key = `${windowId}-${instanceId}`
        set((state) => ({
          maps: {
            ...state.maps,
            [key]: {
              ...(state.maps[key] || {
                ...defaultMapState,
                windowId,
                instanceId,
              }),
              mapDimensions,
            },
          },
        }))
      },

      setMapOpacity: (
        windowId: string,
        instanceId: string,
        mapOpacity: number
      ) => {
        const key = `${windowId}-${instanceId}`
        set((state) => ({
          maps: {
            ...state.maps,
            [key]: {
              ...(state.maps[key] || {
                ...defaultMapState,
                windowId,
                instanceId,
              }),
              mapOpacity,
            },
          },
        }))
      },

      resetMapState: (windowId: string, instanceId: string) => {
        const key = `${windowId}-${instanceId}`
        set((state) => ({
          maps: {
            ...state.maps,
            [key]: {
              ...defaultMapState,
              windowId,
              instanceId,
            },
          },
        }))
      },

      cleanupWindowData: (windowId: string) => {
        set((state) => {
          const newMaps = { ...state.maps }
          // Remove all map data for this window
          Object.keys(newMaps).forEach((key) => {
            if (key.startsWith(`${windowId}-`)) {
              delete newMaps[key]
            }
          })
          return { maps: newMaps }
        })
      },
    }),
    {
      name: 'map-storage',
    }
  )
)
