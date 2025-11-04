import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SetoresService } from '@/lib/services/base/setores-service'

export const useGetSetoresPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['setores-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      SetoresService('setores').getSetoresPaginated({
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

export const usePrefetchAdjacentSetores = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['setores-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          SetoresService('setores').getSetoresPaginated({
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
      queryKey: ['setores-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        SetoresService('setores').getSetoresPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSetores = () => {
  return useQuery({
    queryKey: ['setores'],
    queryFn: () => SetoresService('setores').getSetores(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSetoresCount = () => {
  return useQuery({
    queryKey: ['setores-count'],
    queryFn: async () => {
      const response = await SetoresService('setores').getSetores()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSetoresSelect = () => {
  return useQuery({
    queryKey: ['setores-select'],
    queryFn: async () => {
      const response = await SetoresService('setores').getSetores()
      const data = response.info.data || []
      return data.sort((a, b) => a.descricao.localeCompare(b.descricao))
    },
    staleTime: 30000,
  })
}

export const useGetSetor = (id: string) => {
  return useQuery({
    queryKey: ['setores', id],
    queryFn: async () => {
      const response = await SetoresService('setores').getSetor(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

