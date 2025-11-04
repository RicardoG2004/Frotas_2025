import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateServicoDTO,
  UpdateServicoDTO,
} from '@/types/dtos/frotas/servicos.dtos'
import { ServicosService } from '@/lib/services/frotas/servicos-service'

export const useDeleteServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      ServicosService('servico').deleteServico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['servicos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.invalidateQueries({
        queryKey: ['servicos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['servicos-select'],
      })
    },
  })
}

export const useDeleteMultipleServicos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ServicosService(
        'servico'
      ).deleteMultipleServicos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['servicos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.invalidateQueries({
        queryKey: ['servicos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['servicos-select'],
      })
    },
  })
}

export const useCreateServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateServicoDTO) =>
      ServicosService('servico').createServico(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['servicos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.invalidateQueries({
        queryKey: ['servicos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['servicos-select'],
      })
    },
  })
}

export const useUpdateServico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateServicoDTO
    }) =>
      ServicosService('servico').updateServico(
        id,
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['servicos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
      queryClient.invalidateQueries({
        queryKey: ['servicos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['servicos-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['servico', id],
      })
    },
  })
}

