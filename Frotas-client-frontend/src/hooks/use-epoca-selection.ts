import { useAuthStore } from '@/stores/auth-store'
import { sessionVars } from '@/lib/utils/session-vars'

type SelectedEpoca = {
  id: string
  ano: string
  descricao: string
}

export const useEpocaSelection = () => {
  const getSelectedEpoca = (): SelectedEpoca | null => {
    return sessionVars.get('epoca-selected')
  }

  const setSelectedEpoca = (epoca: SelectedEpoca) => {
    sessionVars.set('epoca-selected', epoca)
    useAuthStore.setState({ selectedEpoca: epoca })
  }

  return {
    selectedEpoca: getSelectedEpoca(),
    setSelectedEpoca,
    getSelectedEpoca,
  }
}
