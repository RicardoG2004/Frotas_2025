import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCargoDTO,
  UpdateCargoDTO,
} from '@/types/dtos/base/cargos.dtos'
import { CargosService } from '@/lib/services/base/cargos-service'

export const useDeleteCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CargosService('cargos').deleteCargo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['cargos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-count'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-select'] })
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['cargo', id] })
      }
    },
  })
}

export const useDeleteMultipleCargos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => CargosService('cargos').deleteMultipleCargos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-count'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-select'] })
    },
  })
}

export const useCreateCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCargoDTO) => CargosService('cargos').createCargo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-count'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-select'] })
    },
  })
}

export const useUpdateCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCargoDTO }) =>
      CargosService('cargos').updateCargo(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cargos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-count'] })
      queryClient.invalidateQueries({ queryKey: ['cargos-select'] })
      queryClient.invalidateQueries({ queryKey: ['cargo', id] })
    },
  })
}


