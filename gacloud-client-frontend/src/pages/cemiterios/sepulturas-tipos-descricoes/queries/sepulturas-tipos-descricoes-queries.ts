import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SepulturasTiposDescricoesService } from '@/lib/services/cemiterios/sepulturas-tipos-descricoes-service'

export const useGetSepulturasTiposDescricoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'sepulturas-tipos-descricoes-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).getSepulturasTiposDescricoesPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentSepulturaTiposDescricoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'sepulturas-tipos-descricoes-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          SepulturasTiposDescricoesService(
            'sepulturas-tipos-descricoes'
          ).getSepulturasTiposDescricoesPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'sepulturas-tipos-descricoes-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        SepulturasTiposDescricoesService(
          'sepulturas-tipos-descricoes'
        ).getSepulturasTiposDescricoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSepulturasTiposDescricoes = () => {
  return useQuery({
    queryKey: ['sepulturas-tipos-descricoes'],
    queryFn: () =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).getSepulturasTiposDescricoes(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSepulturaTipoDescricao = (id: string) => {
  return useQuery({
    queryKey: ['sepultura-tipo-descricao', id],
    queryFn: () =>
      SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).getSepulturaTipoDescricao(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSepulturasTiposDescricoesCount = () => {
  return useQuery({
    queryKey: ['sepulturas-tipos-descricoes-count'],
    queryFn: async () => {
      const response = await SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).getSepulturasTiposDescricoes()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSepulturasTiposDescricoesSelect = () => {
  return useQuery({
    queryKey: ['sepulturas-tipos-descricoes-select'],
    queryFn: async () => {
      const response = await SepulturasTiposDescricoesService(
        'sepulturas-tipos-descricoes'
      ).getSepulturasTiposDescricoes()
      const data = response.info.data || []
      return data.sort((a, b) => a.descricao.localeCompare(b.descricao))
    },
    staleTime: 30000,
  })
}
