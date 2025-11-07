import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateLocalizacaoDTO,
  UpdateLocalizacaoDTO,
} from '@/types/dtos/base/localizacoes.dtos'
import { LocalizacoesService } from '@/lib/services/base/localizacoes-service'

export const useDeleteLocalizacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      LocalizacoesService('localizacoes').deleteLocalizacao(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-select'] })
      queryClient.invalidateQueries({ queryKey: ['localizacao', id] })
    },
  })
}

export const useCreateLocalizacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateLocalizacaoDTO) =>
      LocalizacoesService('localizacoes').createLocalizacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-select'] })
    },
  })
}

export const useUpdateLocalizacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocalizacaoDTO }) =>
      LocalizacoesService('localizacoes').updateLocalizacao(id, {
        ...data,
        id,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-select'] })
      queryClient.invalidateQueries({ queryKey: ['localizacao', id] })
    },
  })
}

export const useDeleteMultipleLocalizacoes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      LocalizacoesService('localizacoes').deleteMultipleLocalizacoes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-count'] })
      queryClient.invalidateQueries({ queryKey: ['localizacoes-select'] })
    },
  })
}

