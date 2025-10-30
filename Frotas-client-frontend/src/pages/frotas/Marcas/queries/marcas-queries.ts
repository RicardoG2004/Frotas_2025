import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MarcasService } from '@/lib/services/frotas/marcas-service'

export const useGetMarcasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['marcas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      MarcasService('marca').getMarcasPaginated({
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

export const usePrefetchAdjacentMarcas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['marcas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          MarcasService('marca').getMarcasPaginated({
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
        queryKey: ['marcas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        MarcasService('marca').getMarcasPaginated({
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
    queryKey: ['marcas'],
    queryFn: () => MarcasService('marca').getMarcas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetMarca = (id: string) => {
  return useQuery({
    queryKey: ['marca', id],
    queryFn: () => MarcasService('marca').getMarca(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetMarcasCount = () => {
  return useQuery({
    queryKey: ['marcas-count'],
    queryFn: async () => {
      const response = await MarcasService('marca').getMarcas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetMarcasSelect = () => {
  return useQuery({
    queryKey: ['marcas-select'],
    queryFn: async () => {
      const response = await MarcasService('marca').getMarcas()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}
