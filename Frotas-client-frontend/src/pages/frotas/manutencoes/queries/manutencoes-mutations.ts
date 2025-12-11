import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateManutencaoDTO,
  UpdateManutencaoDTO,
} from '@/types/dtos/frotas/manutencoes.dtos'
import { ManutencoesService } from '@/lib/services/frotas/manutencoes-service'

export const useDeleteManutencao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      ManutencoesService('manutencao').deleteManutencao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] })
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-count'],
      })
    },
  })
}

export const useDeleteMultipleManutencoes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ManutencoesService(
        'manutencao'
      ).deleteMultipleManutencoes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] })
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-count'],
      })
    },
  })
}

export const useCreateManutencao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateManutencaoDTO) =>
      ManutencoesService('manutencao').createManutencao(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] })
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-count'],
      })
    },
  })
}

export const useUpdateManutencao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateManutencaoDTO
    }) =>
      ManutencoesService('manutencao').updateManutencao(
        id,
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] })
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['manutencao', id],
      })
    },
  })
}

