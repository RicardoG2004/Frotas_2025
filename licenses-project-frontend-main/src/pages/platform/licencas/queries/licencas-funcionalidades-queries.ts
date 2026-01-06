import { useQuery } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useGetModulosFuncionalidadesLicenca = (licencaId: string) => {
  return useQuery({
    queryKey: ['modulos-funcionalidades-licenca', licencaId],
    queryFn: async () => {
      const response =
        await LicencasService(
          'licencas'
        ).LicencasFuncionalidades.getModulosFuncionalidadesLicenca(licencaId)
      return response.info.data
    },
    enabled: !!licencaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetModulosFuncionalidadesLicencaByApiKey = () => {
  return useQuery({
    queryKey: ['modulos-funcionalidades-licenca-by-api-key'],
    queryFn: async () => {
      const response =
        await LicencasService(
          'licencas'
        ).LicencasFuncionalidades.getModulosFuncionalidadesLicencaByApiKey()
      return response.info.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetModulosFuncionalidadesLicencaById = (licencaId: string) => {
  return useQuery({
    queryKey: ['modulos-funcionalidades-licenca-by-id', licencaId],
    queryFn: async () => {
      const response =
        await LicencasService(
          'licencas'
        ).LicencasFuncionalidades.getModulosFuncionalidadesLicencaById(
          licencaId
        )
      return response.info.data
    },
    enabled: !!licencaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
