import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PaisesService } from '@/lib/services/base/paises-service'

export const useGetPaisesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['paises-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      PaisesService('paises').getPaisesPaginated({
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

export const usePrefetchAdjacentPaises = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['paises-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          PaisesService('aplicacoes').getPaisesPaginated({
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
      queryKey: ['paises-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        PaisesService('paises').getPaisesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetPaises = () => {
  return useQuery({
    queryKey: ['paises'],
    queryFn: () => PaisesService('paises').getPaises(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetPaisesCount = () => {
  return useQuery({
    queryKey: ['paises-count'],
    queryFn: async () => {
      const response = await PaisesService('paises').getPaises()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetPaisesSelect = () => {
  return useQuery({
    queryKey: ['paises-select'],
    queryFn: async () => {
      const response = await PaisesService('paises').getPaises()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetPais = (id: string) => {
  return useQuery({
    queryKey: ['pais', id],
    queryFn: () => PaisesService('paises').getPais(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
