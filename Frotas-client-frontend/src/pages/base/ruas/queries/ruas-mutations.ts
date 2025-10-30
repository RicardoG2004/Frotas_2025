import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateRuaDTO, UpdateRuaDTO } from '@/types/dtos/base/ruas.dtos'
import { RuasService } from '@/lib/services/base/ruas-service'

export const useDeleteRua = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => RuasService('ruas').deleteRua(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['ruas'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-count'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-select'] })
    },
  })
}

export const useCreateRua = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRuaDTO) =>
      RuasService('ruas').createRua(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['ruas'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-count'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-select'] })
    },
  })
}

export const useUpdateRua = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRuaDTO }) =>
      RuasService('ruas').updateRua(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ruas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['ruas'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-count'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-select'] })
      queryClient.invalidateQueries({ queryKey: ['rua', id] })
    },
  })
}

export const useDeleteMultipleRuas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => RuasService('ruas').deleteMultipleRuas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['ruas'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-count'] })
      queryClient.invalidateQueries({ queryKey: ['ruas-select'] })
    },
  })
}
