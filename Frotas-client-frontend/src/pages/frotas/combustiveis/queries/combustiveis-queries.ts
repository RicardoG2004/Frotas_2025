import { useQuery } from '@tanstack/react-query'
import { CombustiveisService } from '@/lib/services/frotas/combustiveis-service'

export const useGetCombustiveisSelect = () => {
  return useQuery({
    queryKey: ['combustiveis-select'],
    queryFn: async () => {
      const response = await CombustiveisService('combustivel').getCombustiveis()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}

