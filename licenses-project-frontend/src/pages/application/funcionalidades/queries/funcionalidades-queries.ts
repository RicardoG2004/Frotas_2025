import { useQuery, useQueryClient } from '@tanstack/react-query'
import FuncionalidadesService from '@/lib/services/application/funcionalidades-service'

export const useGetFuncionalidadesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'funcionalidades-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated({
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

export const usePrefetchAdjacentFuncionalidades = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'funcionalidades-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated(
            {
              pageNumber: page - 1,
              pageSize: pageSize,
              filters:
                (filters as unknown as Record<string, string>) ?? undefined,
              sorting: undefined,
            }
          ),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'funcionalidades-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetFuncionalidades = () => {
  return useQuery({
    queryKey: ['funcionalidades'],
    queryFn: () =>
      FuncionalidadesService('funcionalidades').getFuncionalidades(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFuncionalidadesCount = () => {
  return useQuery({
    queryKey: ['funcionalidades-count'],
    queryFn: async () => {
      const response =
        await FuncionalidadesService('funcionalidades').getFuncionalidades()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetFuncionalidadesSelect = () => {
  return useQuery({
    queryKey: ['funcionalidades-select'],
    queryFn: async () => {
      const response =
        await FuncionalidadesService('funcionalidades').getFuncionalidades()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetFuncionalidadesByModulo = (moduloId: string) => {
  return useQuery({
    queryKey: ['funcionalidades-modulo', moduloId],
    queryFn: () =>
      FuncionalidadesService('funcionalidades').getFuncionalidades(moduloId),
    enabled: !!moduloId,
  })
}
