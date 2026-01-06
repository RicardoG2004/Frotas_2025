import { useQuery } from '@tanstack/react-query'
import { VersionDTO } from '@/types/dtos'
import VersionService from '@/lib/services/version-service'

export const useGetVersion = (requireAuth = false) => {
  return useQuery<VersionDTO | undefined>({
    queryKey: ['version', requireAuth],
    queryFn: async () => {
      const response = await VersionService().getVersion(requireAuth)
      return response.info?.data
    },
  })
}
