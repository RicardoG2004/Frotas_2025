import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FornecedoresService } from '@/lib/services/frotas/fornecedores-service'

export const useGetFornecedoresPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['fornecedores-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      FornecedoresService('fornecedor').getFornecedoresPaginated({
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

export const usePrefetchAdjacentFornecedores = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['fornecedores-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          FornecedoresService('fornecedor').getFornecedoresPaginated({
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
        queryKey: ['fornecedores-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        FornecedoresService('fornecedor').getFornecedoresPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetFornecedores = () => {
  return useQuery({
    queryKey: ['fornecedores'],
    queryFn: () => FornecedoresService('fornecedor').getFornecedores(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFornecedor = (id: string) => {
  return useQuery({
    queryKey: ['fornecedor', id],
    queryFn: () => FornecedoresService('fornecedor').getFornecedor(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFornecedoresCount = () => {
  return useQuery({
    queryKey: ['fornecedores-count'],
    queryFn: async () => {
      const response = await FornecedoresService('fornecedor').getFornecedores()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetFornecedoresSelect = () => {
  return useQuery({
    queryKey: ['fornecedores-select'],
    queryFn: async () => {
      const response = await FornecedoresService('fornecedor').getFornecedores()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}

