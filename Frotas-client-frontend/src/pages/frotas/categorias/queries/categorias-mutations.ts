import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from '@/types/dtos/frotas/categorias.dtos'
import { CategoriasService } from '@/lib/services/frotas/categorias-service'

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CategoriasService('categoria').deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({
        queryKey: ['categorias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['categorias-select'],
      })
    },
  })
}

export const useDeleteMultipleCategorias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CategoriasService('categoria').deleteMultipleCategorias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({
        queryKey: ['categorias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['categorias-select'],
      })
    },
  })
}

export const useCreateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCategoriaDTO) =>
      CategoriasService('categoria').createCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({   
        queryKey: ['categorias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['categorias-select'],
      })
    },
  })
}

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaDTO }) =>
      CategoriasService('categoria').updateCategoria(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['categorias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      queryClient.invalidateQueries({
        queryKey: ['categorias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['categorias-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['categoria', id],
      })
    },
  })
}
