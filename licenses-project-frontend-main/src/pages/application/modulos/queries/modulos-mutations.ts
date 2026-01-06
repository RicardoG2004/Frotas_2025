import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateModuloDTO, UpdateModuloDTO } from '@/types/dtos'
import ModulosService from '@/lib/services/application/modulos-service'

export const useDeleteModulo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ModulosService('modulos').deleteModulo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['modulos'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-count'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-select'] })
    },
  })
}

export const useCreateModulo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateModuloDTO) =>
      ModulosService('modulos').createModulo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['modulos'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-count'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-select'] })
    },
  })
}

export const useUpdateModulo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuloDTO }) =>
      ModulosService('modulos').updateModulo(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['modulos'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-count'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-select'] })
    },
  })
}

export const useDeleteMultipleModulos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ModulosService('modulos').deleteMultipleModulos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['modulos'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-count'] })
      queryClient.invalidateQueries({ queryKey: ['modulos-select'] })
    },
  })
}
