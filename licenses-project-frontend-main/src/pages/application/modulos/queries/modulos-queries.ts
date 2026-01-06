import { useQuery, useQueryClient } from '@tanstack/react-query'
import ModulosService from '@/lib/services/application/modulos-service'

export const useGetModulosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['modulos-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ModulosService('modulos').getModulosPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting:
          (sorting as unknown as Array<{ id: string; desc: boolean }>) ??
          undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentModulos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['modulos-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ModulosService('modulos').getModulosPaginated({
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
      queryKey: ['modulos-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ModulosService('modulos').getModulosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetModulos = () => {
  return useQuery({
    queryKey: ['modulos'],
    queryFn: () => ModulosService('modulos').getModulos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetModulosCount = () => {
  return useQuery({
    queryKey: ['modulos-count'],
    queryFn: async () => {
      const response = await ModulosService('modulos').getModulos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetModulosSelect = () => {
  return useQuery({
    queryKey: ['modulos-select'],
    queryFn: async () => {
      const response = await ModulosService('modulos').getModulos()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetModulosByAplicacao = (aplicacaoId: string) => {
  return useQuery({
    queryKey: ['modulos-aplicacao', aplicacaoId],
    queryFn: () => ModulosService('modulos').getModulos(aplicacaoId),
    enabled: !!aplicacaoId,
  })
}
