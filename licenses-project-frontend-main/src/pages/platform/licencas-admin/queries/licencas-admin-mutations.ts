import { useMutation, useQueryClient } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

interface LicencaUtilizadorDTO {
  utilizadorId: string
  ativo: boolean
}

export const useUpdateLicencaUtilizadores = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      licencaId,
      data,
    }: {
      licencaId: string
      data: LicencaUtilizadorDTO[]
    }) =>
      LicencasService(
        'licencas'
      ).LicencasUtilizadores.Admin.updateUtilizadoresLicenca(licencaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
    },
  })
}
