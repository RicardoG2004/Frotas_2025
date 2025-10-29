import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ViewState {
  scale: number
  position: { x: number; y: number }
  isPanning: boolean
  selectedShape: any | null
  modalOpen: boolean
  tooltipData: any | null
  tooltipPosition: { x: number; y: number }
}

interface ViewStore {
  viewStates: Record<string, ViewState>
  getViewState: (windowId: string) => ViewState
  setViewState: (windowId: string, state: Partial<ViewState>) => void
  cleanupWindowData: (windowId: string) => void
  clearAllViewStates: () => void
}

const defaultViewState: ViewState = {
  scale: 1.4,
  position: { x: 0, y: 0 },
  isPanning: false,
  selectedShape: null,
  modalOpen: false,
  tooltipData: null,
  tooltipPosition: { x: 0, y: 0 },
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set, get) => ({
      viewStates: {},
      getViewState: (windowId: string) => {
        const state = get().viewStates[windowId]
        return state || defaultViewState
      },
      setViewState: (windowId: string, newState: Partial<ViewState>) => {
        set((state) => ({
          viewStates: {
            ...state.viewStates,
            [windowId]: {
              ...(state.viewStates[windowId] || defaultViewState),
              ...newState,
            },
          },
        }))
      },
      cleanupWindowData: (windowId: string) => {
        set((state) => {
          const { [windowId]: removed, ...remainingStates } = state.viewStates
          return { viewStates: remainingStates }
        })
      },
      clearAllViewStates: () => {
        set(() => ({ viewStates: {} }))
      },
    }),
    {
      name: 'cemiterio-view-storage', // unique name for localStorage key
      partialize: (state) => ({ viewStates: state.viewStates }), // only persist viewStates
    }
  )
)
