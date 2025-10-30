import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EpocasService } from '@/lib/services/base/epocas-service'

export const useGetEpocasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['epocas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      EpocasService('epocas').getEpocasPaginated({
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

export const usePrefetchAdjacentEpocas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['epocas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          EpocasService('epocas').getEpocasPaginated({
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
      queryKey: ['epocas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        EpocasService('epocas').getEpocasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetEpocas = () => {
  return useQuery({
    queryKey: ['epocas'],
    queryFn: () => EpocasService('epocas').getEpocas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetEpocasCount = () => {
  return useQuery({
    queryKey: ['epocas-count'],
    queryFn: async () => {
      const response = await EpocasService('epocas').getEpocas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetEpocasSelect = () => {
  return useQuery({
    queryKey: ['epocas-select'],
    queryFn: async () => {
      const response = await EpocasService('epocas').getEpocas()
      const data = response.info.data || []
      return data.sort((a, b) => a.descricao.localeCompare(b.descricao))
    },
    staleTime: 30000,
  })
}

export const useGetPredefinedEpoca = () => {
  return useQuery({
    queryKey: ['epoca-predefined'],
    queryFn: () => EpocasService('epocas').getPredefinedEpoca(),
    enabled: false, // This query won't run automatically
  })
}
