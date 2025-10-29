import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSepulturaTipoGeralDTO,
  UpdateSepulturaTipoGeralDTO,
} from '@/types/dtos/cemiterios/sepulturas-tipos-geral.dtos'
import { SepulturasTiposDescricoesService } from '@/lib/services/cemiterios/sepulturas-tipos-descricoes-service'

export const useDeleteSepulturaTipoDescricao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).deleteSepulturaTipoDescricao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-select'],
      })
    },
  })
}

export const useCreateSepulturaTipoDescricao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSepulturaTipoGeralDTO) =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).createSepulturaTipoDescricao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-select'],
      })
    },
  })
}

export const useUpdateSepulturaTipoDescricao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateSepulturaTipoGeralDTO
    }) =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).updateSepulturaTipoDescricao(id, {
        ...data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepultura-tipo-descricao', variables.id],
      })
    },
  })
}

export const useDeleteMultipleSepulturaTiposDescricoes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).deleteMultipleSepulturasTiposDescricoes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-descricoes-select'],
      })
    },
  })
}
