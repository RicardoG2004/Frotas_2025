import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AgenciasFunerariasService } from '@/lib/services/cemiterios/agencias-funerarias-service'

export const useGetAgenciasFunerariasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'agencias-funerarias-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      AgenciasFunerariasService(
        'agencia-funeraria'
      ).getAgenciasFunerariasPaginated({
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

export const usePrefetchAdjacentAgenciasFunerarias = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'agencias-funerarias-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          AgenciasFunerariasService(
            'agencia-funeraria'
          ).getAgenciasFunerariasPaginated({
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
        'agencias-funerarias-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        AgenciasFunerariasService(
          'agencia-funeraria'
        ).getAgenciasFunerariasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetAgenciasFunerarias = () => {
  return useQuery({
    queryKey: ['agencias-funerarias'],
    queryFn: () =>
      AgenciasFunerariasService('agencia-funeraria').getAgenciasFunerarias(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetAgenciaFuneraria = (id: string) => {
  return useQuery({
    queryKey: ['agencia-funeraria', id],
    queryFn: () =>
      AgenciasFunerariasService('agencia-funeraria').getAgenciaFuneraria(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetAgenciasFunerariasCount = () => {
  return useQuery({
    queryKey: ['agencias-funerarias-count'],
    queryFn: async () => {
      const response =
        await AgenciasFunerariasService(
          'agencia-funeraria'
        ).getAgenciasFunerarias()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetAgenciasFunerariasSelect = () => {
  return useQuery({
    queryKey: ['agencias-funerarias-select'],
    queryFn: async () => {
      const response =
        await AgenciasFunerariasService(
          'agencia-funeraria'
        ).getAgenciasFunerarias()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.entidade?.nome || '').localeCompare(b.entidade?.nome || '')
      )
    },
    staleTime: 30000,
  })
}
