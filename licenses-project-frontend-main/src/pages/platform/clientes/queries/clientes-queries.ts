import { useQuery, useQueryClient } from '@tanstack/react-query'
import ClientesService from '@/lib/services/platform/clientes-service'

export const useGetClientesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['clientes-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ClientesService('clientes').getClientesPaginated({
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

export const usePrefetchAdjacentClientes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['clientes-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ClientesService('clientes').getClientesPaginated({
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
      queryKey: ['clientes-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ClientesService('clientes').getClientesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => ClientesService('clientes').getClientes(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetClientesSelect = () => {
  return useQuery({
    queryKey: ['clientes-select'],
    queryFn: async () => {
      const response = await ClientesService('clientes').getClientes()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetClientesCount = () => {
  return useQuery({
    queryKey: ['clientes-count'],
    queryFn: async () => {
      const response = await ClientesService('clientes').getClientes()
      return response.info?.data?.length || 0
    },
  })
}
