import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreatePaisDTO, UpdatePaisDTO } from '@/types/dtos/base/paises.dtos'
import { PaisesService } from '@/lib/services/base/paises-service'

export const useDeletePais = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => PaisesService('paises').deletePais(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['paises-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['paises'] })
      queryClient.invalidateQueries({ queryKey: ['paises-count'] })
      queryClient.invalidateQueries({ queryKey: ['paises-select'] })
      queryClient.invalidateQueries({ queryKey: ['pais', id] })
    },
  })
}

export const useCreatePais = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePaisDTO) =>
      PaisesService('paises').createPais(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paises-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['paises'] })
      queryClient.invalidateQueries({ queryKey: ['paises-count'] })
      queryClient.invalidateQueries({ queryKey: ['paises-select'] })
    },
  })
}

export const useUpdatePais = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaisDTO }) =>
      PaisesService('paises').updatePais(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['paises-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['paises'] })
      queryClient.invalidateQueries({ queryKey: ['paises-count'] })
      queryClient.invalidateQueries({ queryKey: ['paises-select'] })
      queryClient.invalidateQueries({ queryKey: ['pais', id] })
    },
  })
}

export const useDeleteMultiplePaises = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      PaisesService('paises').deleteMultiplePaises(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paises-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['paises'] })
      queryClient.invalidateQueries({ queryKey: ['paises-count'] })
      queryClient.invalidateQueries({ queryKey: ['paises-select'] })
    },
  })
}
