import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PecasService } from '@/lib/services/frotas/pecas-service'

export const useGetPecasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'pecas-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      PecasService(
        'peca'
      ).getPecasPaginated({
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

export const usePrefetchAdjacentPecas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'pecas-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          PecasService(
            'peca'
          ).getPecasPaginated({
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
        'pecas-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        PecasService(
          'peca'
        ).getPecasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetPecas = () => {
  return useQuery({
    queryKey: ['pecas'],
    queryFn: () =>
      PecasService('peca').getPecas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetPeca = (id: string) => {
  return useQuery({
    queryKey: ['peca', id],
    queryFn: () =>
      PecasService('peca').getPeca(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetPecasCount = () => {
  return useQuery({
    queryKey: ['pecas-count'],
    queryFn: async () => {
      const response =
        await PecasService(
          'peca'
        ).getPecas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetPecasSelect = () => {
  return useQuery({
    queryKey: ['pecas-select'],
    queryFn: async () => {
      const response =
        await PecasService(
          'peca'
        ).getPecas()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}

