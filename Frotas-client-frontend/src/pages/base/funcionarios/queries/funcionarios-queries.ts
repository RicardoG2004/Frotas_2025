import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FuncionariosService } from '@/lib/services/base/funcionarios-service'

export const useGetFuncionariosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['funcionarios-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      FuncionariosService('funcionarios').getFuncionariosPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentFuncionarios = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['funcionarios-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          FuncionariosService('funcionarios').getFuncionariosPaginated({
            pageNumber: page - 1,
            pageSize,
            filters: (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['funcionarios-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        FuncionariosService('funcionarios').getFuncionariosPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetFuncionarios = () => {
  return useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => FuncionariosService('funcionarios').getFuncionarios(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFuncionario = (id: string) => {
  return useQuery({
    queryKey: ['funcionario', id],
    queryFn: async () => {
      const response = await FuncionariosService('funcionarios').getFuncionario(id)
      return response.info?.data
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFuncionariosCount = () => {
  return useQuery({
    queryKey: ['funcionarios-count'],
    queryFn: async () => {
      const response = await FuncionariosService('funcionarios').getFuncionarios()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetFuncionariosSelect = () => {
  return useQuery({
    queryKey: ['funcionarios-select'],
    queryFn: async () => {
      const response = await FuncionariosService('funcionarios').getFuncionarios()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}

