import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateMarcaDTO,
  UpdateMarcaDTO,
} from '@/types/dtos/cemiterios/marcas.dtos'
import { MarcasService } from '@/lib/services/cemiterios/marcas-service'

export const useDeleteMarca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => MarcasService('marca').deleteMarca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marcas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      queryClient.invalidateQueries({
        queryKey: ['marcas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['marcas-select'],
      })
    },
  })
}

export const useDeleteMultipleMarcas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      MarcasService('marca').deleteMultipleMarcas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marcas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      queryClient.invalidateQueries({
        queryKey: ['marcas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['marcas-select'],
      })
    },
  })
}

export const useCreateMarca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMarcaDTO) =>
      MarcasService('marca').createMarca(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marcas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      queryClient.invalidateQueries({   
        queryKey: ['marcas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['marcas-select'],
      })
    },
  })
}

export const useUpdateMarca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarcaDTO }) =>
      MarcasService('marca').updateMarca(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['marcas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      queryClient.invalidateQueries({
        queryKey: ['marcas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['marcas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['marca', id],
      })
    },
  })
}
