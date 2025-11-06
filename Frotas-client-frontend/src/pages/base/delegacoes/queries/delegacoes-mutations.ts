import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateDelegacaoDTO,
  UpdateDelegacaoDTO,
} from '@/types/dtos/base/delegacoes.dtos'
import { DelegacoesService } from '@/lib/services/base/delegacoes-service'

export const useDeleteDelegacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      DelegacoesService('delegacoes').deleteDelegacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-select'] })
    },
  })
}

export const useCreateDelegacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDelegacaoDTO) =>
      DelegacoesService('delegacoes').createDelegacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-select'] })
    },
  })
}

export const useUpdateDelegacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDelegacaoDTO }) =>
      DelegacoesService('delegacoes').updateDelegacao(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['delegacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-select'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes', id] })
    },
  })
}

export const useDeleteMultipleDelegacoes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      DelegacoesService('delegacoes').deleteMultipleDelegacoes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['delegacoes-select'] })
    },
  })
}

