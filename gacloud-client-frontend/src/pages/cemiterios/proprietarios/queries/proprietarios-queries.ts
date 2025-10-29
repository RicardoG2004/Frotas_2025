import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ProprietariosService } from '@/lib/services/cemiterios/proprietarios-service'

export const useGetProprietariosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'proprietarios-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      ProprietariosService('proprietario').getProprietariosPaginated({
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

export const usePrefetchAdjacentProprietarios = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'proprietarios-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          ProprietariosService('proprietario').getProprietariosPaginated({
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
      queryKey: ['proprietarios-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ProprietariosService('proprietario').getProprietariosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetProprietarios = () => {
  return useQuery({
    queryKey: ['proprietarios'],
    queryFn: () => ProprietariosService('proprietario').getProprietarios(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetProprietario = (id: string) => {
  return useQuery({
    queryKey: ['proprietario', id],
    queryFn: () => ProprietariosService('proprietario').getProprietario(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetProprietariosCount = () => {
  return useQuery({
    queryKey: ['proprietarios-count'],
    queryFn: async () => {
      const response =
        await ProprietariosService('proprietario').getProprietarios()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetProprietariosSelect = () => {
  return useQuery({
    queryKey: ['proprietarios-select'],
    queryFn: async () => {
      const response =
        await ProprietariosService('proprietario').getProprietarios()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.entidade?.nome || '').localeCompare(b.entidade?.nome || '')
      )
    },
    staleTime: 30000,
  })
}
