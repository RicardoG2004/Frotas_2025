import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateFornecedorDTO,
  UpdateFornecedorDTO,
} from '@/types/dtos/frotas/fornecedores.dtos'
import { FornecedoresService } from '@/lib/services/frotas/fornecedores-service'

export const useDeleteFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => FornecedoresService('fornecedor').deleteFornecedor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-select'],
      })
    },
  })
}

export const useDeleteMultipleFornecedores = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      FornecedoresService('fornecedor').deleteMultipleFornecedores(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-select'],
      })
    },
  })
}

export const useCreateFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFornecedorDTO) =>
      FornecedoresService('fornecedor').createFornecedor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
      queryClient.invalidateQueries({   
        queryKey: ['fornecedores-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-select'],
      })
    },
  })
}

export const useUpdateFornecedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFornecedorDTO }) =>
      FornecedoresService('fornecedor').updateFornecedor(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fornecedores-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fornecedor', id],
      })
    },
  })
}

