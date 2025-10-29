import { useAuthStore } from '@/stores/auth-store'
import { sessionVars } from '@/lib/utils/session-vars'

type SelectedCemiterio = {
  id: string
  nome: string
}

export const useCemiterioSelection = () => {
  const getSelectedCemiterio = (): SelectedCemiterio | null => {
    return sessionVars.get('cemiterio-selected')
  }

  const setSelectedCemiterio = (cemiterio: SelectedCemiterio) => {
    sessionVars.set('cemiterio-selected', cemiterio)
    useAuthStore.setState({ selectedCemiterio: cemiterio })
  }

  return {
    selectedCemiterio: getSelectedCemiterio(),
    setSelectedCemiterio,
    getSelectedCemiterio,
  }
}
