import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoriasService } from '@/lib/services/frotas/categorias-service'

export const useGetCategoriasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['categorias-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CategoriasService('categoria').getCategoriasPaginated({
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

export const usePrefetchAdjacentCategorias = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['categorias-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CategoriasService('categoria').getCategoriasPaginated({
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
        queryKey: ['categorias-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CategoriasService('categoria').getCategoriasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetMarcas = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => CategoriasService('categoria').getCategorias(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCategoria = (id: string) => {
  return useQuery({
    queryKey: ['categoria', id],
    queryFn: () => CategoriasService('categoria').getCategoria(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCategoriasCount = () => {
  return useQuery({
    queryKey: ['categorias-count'],
    queryFn: async () => {
      const response = await CategoriasService('categoria').getCategorias()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCategoriasSelect = () => {
  return useQuery({
    queryKey: ['categorias-select'],
    queryFn: async () => {
      const response = await CategoriasService('categoria').getCategorias()
      const data = response.info.data || []
      return data.sort((a, b) => (a.designacao || '').localeCompare(b.designacao || ''))
    },
    staleTime: 30000,
  })
}
