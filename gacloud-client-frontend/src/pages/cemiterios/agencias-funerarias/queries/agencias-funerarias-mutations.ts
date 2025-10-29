import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateAgenciaFunerariaDTO,
  UpdateAgenciaFunerariaDTO,
} from '@/types/dtos/cemiterios/agencias-funerarias.dtos'
import { AgenciasFunerariasService } from '@/lib/services/cemiterios/agencias-funerarias-service'

export const useDeleteAgenciaFuneraria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      AgenciasFunerariasService('agencia-funeraria').deleteAgenciaFuneraria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['agencias-funerarias'] })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-select'],
      })
    },
  })
}

export const useDeleteMultipleAgenciasFunerarias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      AgenciasFunerariasService(
        'agencia-funeraria'
      ).deleteMultipleAgenciasFunerarias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['agencias-funerarias'] })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-select'],
      })
    },
  })
}

export const useCreateAgenciaFuneraria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAgenciaFunerariaDTO) =>
      AgenciasFunerariasService('agencia-funeraria').createAgenciaFuneraria(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['agencias-funerarias'] })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-select'],
      })
    },
  })
}

export const useUpdateAgenciaFuneraria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateAgenciaFunerariaDTO
    }) =>
      AgenciasFunerariasService('agencia-funeraria').updateAgenciaFuneraria(
        id,
        { ...data, id }
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['agencias-funerarias'] })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['agencias-funerarias-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['agencia-funeraria', id],
      })
    },
  })
}
