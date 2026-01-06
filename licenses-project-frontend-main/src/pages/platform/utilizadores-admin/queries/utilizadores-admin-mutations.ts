import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateUtilizadorDTO, UpdateUtilizadorDTO } from '@/types/dtos'
import LicencasService from '@/lib/services/platform/licencas-service'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUtilizadorDTO) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.createUser(data),
    onSuccess: () => {
      // admin view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })

      // administrator (licenca) view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUtilizadorDTO }) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.updateUser(
        id,
        data
      ),
    onSuccess: () => {
      // admin view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['utilizador-admin-basic'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })

      // administrator (licenca) view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.deleteUser(id),
    onSuccess: () => {
      // admin view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })

      // administrator (licenca) view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}

export const useDeleteMultipleUsers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      UtilizadoresService('utilizadores').Admin.deleteMultipleUsers(ids),
    onSuccess: () => {
      // admin view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })

      // administrator (licenca) view queries
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}
