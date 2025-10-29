import { useQueryClient } from '@tanstack/react-query'
import { ResponseStatus } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { EpocasService } from '@/lib/services/base/epocas-service'
import { sessionVars } from '@/lib/utils/session-vars'

export const useEpocaPredefined = () => {
  const queryClient = useQueryClient()

  const updatePredefinedEpoca = async () => {
    const epocaResponse = await EpocasService('epocas').getPredefinedEpoca()
    if (
      epocaResponse.info.status === ResponseStatus.Success &&
      epocaResponse.info.data
    ) {
      // Update session vars
      sessionVars.set('epoca-predefined', {
        id: epocaResponse.info.data.id,
        ano: epocaResponse.info.data.ano,
        descricao: epocaResponse.info.data.descricao,
      })

      // Update query cache
      queryClient.setQueryData(['epoca-predefined'], epocaResponse)

      // Update auth store
      useAuthStore.setState({
        predefinedEpocaAno: epocaResponse.info.data.ano,
      })

      // If no selected epoca exists, set the predefined one as selected
      const selectedEpoca = sessionVars.get('epoca-selected')
      if (!selectedEpoca) {
        sessionVars.set('epoca-selected', {
          id: epocaResponse.info.data.id,
          ano: epocaResponse.info.data.ano,
          descricao: epocaResponse.info.data.descricao,
        })

        useAuthStore.setState({
          selectedEpoca: {
            id: epocaResponse.info.data.id,
            ano: epocaResponse.info.data.ano,
            descricao: epocaResponse.info.data.descricao,
          },
        })
      }
    }
  }

  return { updatePredefinedEpoca }
}
