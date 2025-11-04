import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from '@/types/dtos/frotas/equipamentos.dtos'
import { EquipamentosService } from '@/lib/services/frotas/equipamentos-service'

export const useDeleteEquipamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      EquipamentosService('equipamento').deleteEquipamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-select'],
      })
    },
  })
}

export const useDeleteMultipleEquipamentos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      EquipamentosService(
        'equipamento'
      ).deleteMultipleEquipamentos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-select'],
      })
    },
  })
}

export const useCreateEquipamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEquipamentoDTO) =>
      EquipamentosService('equipamento').createEquipamento(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-select'],
      })
    },
  })
}

export const useUpdateEquipamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateEquipamentoDTO
    }) =>
      EquipamentosService('equipamento').updateEquipamento(
        id,
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['equipamentos-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['equipamento', id],
      })
    },
  })
}
