import { useQueryClient } from '@tanstack/react-query'
import { ResponseStatus } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { CemiteriosService } from '@/lib/services/cemiterios/cemiterios-service'
import { sessionVars } from '@/lib/utils/session-vars'

export const useCemiterioPredefined = () => {
  const queryClient = useQueryClient()

  const updatePredefinedCemiterio = async () => {
    const cemiterioResponse =
      await CemiteriosService('cemiterios').getPredefinedCemiterio()
    if (
      cemiterioResponse.info.status === ResponseStatus.Success &&
      cemiterioResponse.info.data
    ) {
      // Update session vars
      sessionVars.set('cemiterio-predefined', {
        id: cemiterioResponse.info.data.id,
        nome: cemiterioResponse.info.data.nome,
      })

      // Update query cache
      queryClient.setQueryData(['cemiterio-predefined'], cemiterioResponse)

      // Update auth store
      useAuthStore.setState({
        predefinedCemiterioId: cemiterioResponse.info.data.id,
      })

      // If no selected cemiterio exists, set the predefined one as selected
      const selectedCemiterio = sessionVars.get('cemiterio-selected')
      if (!selectedCemiterio) {
        sessionVars.set('cemiterio-selected', {
          id: cemiterioResponse.info.data.id,
          nome: cemiterioResponse.info.data.nome,
        })

        useAuthStore.setState({
          selectedCemiterio: {
            id: cemiterioResponse.info.data.id,
            nome: cemiterioResponse.info.data.nome,
          },
        })
      }
    }
  }

  return { updatePredefinedCemiterio }
}
