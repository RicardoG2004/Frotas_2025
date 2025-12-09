import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FsesService } from '@/lib/services/base/fses-service'

export const useGetFsesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['fses-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      FsesService('fse').getFsesPaginated({
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

export const usePrefetchAdjacentFses = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['fses-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          FsesService('fse').getFsesPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters: (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['fses-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        FsesService('fse').getFsesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetFses = () => {
  return useQuery({
    queryKey: ['fses'],
    queryFn: () => FsesService('fse').getFses(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFse = (id: string) => {
  return useQuery({
    queryKey: ['fse', id],
    queryFn: () => FsesService('fse').getFse(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFsesCount = () => {
  return useQuery({
    queryKey: ['fses-count'],
    queryFn: async () => {
      const response = await FsesService('fse').getFses()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetFsesSelect = () => {
  return useQuery({
    queryKey: ['fses-select'],
    queryFn: async () => {
      const response = await FsesService('fse').getFses()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}

