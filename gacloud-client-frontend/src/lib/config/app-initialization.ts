import { useAuthStore } from '@/stores/auth-store'
import { sessionVars } from '@/lib/utils/session-vars'
import { toast } from '@/utils/toast-utils'

export const initializeAppData = {
  // Initialize date-related settings
  async initializeDates() {
    try {
      // Get today's date without time
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Set data-trabalho in session if it doesn't exist
      if (!sessionVars.get('data-trabalho')) {
        sessionVars.set('data-trabalho', today)
      }
    } catch (error) {
      console.error('Error initializing dates:', error)
      toast.error('Erro ao inicializar datas do sistema')
    }
  },

  // Initialize epoca-related settings
  async initializeEpoca(
    getSelectedEpoca: () => any,
    updatePredefinedEpoca: () => Promise<void>
  ) {
    try {
      const selectedEpoca = getSelectedEpoca()

      if (!selectedEpoca) {
        // Only update predefined epoca if no epoca is selected
        await updatePredefinedEpoca()
      } else {
        // Set the selected epoca in the auth store
        useAuthStore.setState({ selectedEpoca })
      }
    } catch (error) {
      console.error('Error initializing epoca:', error)
      toast.error('Erro ao inicializar época')
    }
  },

  // Initialize cemiterio-related settings
  async initializeCemiterio(
    getSelectedCemiterio: () => any,
    updatePredefinedCemiterio: () => Promise<void>
  ) {
    try {
      const selectedCemiterio = getSelectedCemiterio()

      if (!selectedCemiterio) {
        // Only update predefined cemiterio if no cemiterio is selected
        await updatePredefinedCemiterio()
      } else {
        // Set the selected cemiterio in the auth store
        useAuthStore.setState({ selectedCemiterio })
      }
    } catch (error) {
      console.error('Error initializing cemiterio:', error)
      toast.error('Erro ao inicializar cemitério')
    }
  },

  // Main initialization function
  async initialize(
    getSelectedEpoca: () => any,
    updatePredefinedEpoca: () => Promise<void>,
    getSelectedCemiterio: () => any,
    updatePredefinedCemiterio: () => Promise<void>
  ) {
    try {
      await Promise.all([
        this.initializeDates(),
        this.initializeEpoca(getSelectedEpoca, updatePredefinedEpoca),
        this.initializeCemiterio(
          getSelectedCemiterio,
          updatePredefinedCemiterio
        ),
        // Add more initialization functions here as needed
      ])
    } catch (error) {
      console.error('Error during app initialization:', error)
      toast.error('Erro ao inicializar aplicação')
    }
  },
}
