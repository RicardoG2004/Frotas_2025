import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModuloFuncionalidadeDTO } from '@/types/dtos'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useUpdateLicencaModulosFuncionalidades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      licencaId,
      data,
    }: {
      licencaId: string
      data: ModuloFuncionalidadeDTO[]
    }) =>
      LicencasService(
        'licencas'
      ).LicencasFuncionalidades.updateLicencaModulosFuncionalidades(
        licencaId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenca-funcionalidades'] })
      queryClient.invalidateQueries({
        queryKey: ['modulos-funcionalidades-licenca'],
      })
    },
  })
}
