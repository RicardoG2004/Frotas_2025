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

  // Main initialization function
  async initialize() {
    try {
      await Promise.all([this.initializeDates()])
    } catch (error) {
      console.error('Error during app initialization:', error)
      toast.error('Erro ao inicializar aplicação')
    }
  },
}
