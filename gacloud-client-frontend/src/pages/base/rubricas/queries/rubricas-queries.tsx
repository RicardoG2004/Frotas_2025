import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedRequest } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { RubricasService } from '@/lib/services/base/rubricas-service'

interface RubricasPaginatedRequest extends PaginatedRequest {
  epocaId?: string
}

export const useGetRubricasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: [
      'rubricas-paginated',
      { pageNumber, pageLimit, filters, sorting },
      selectedEpoca?.id,
    ],
    queryFn: () =>
      RubricasService('rubricas').getRubricasPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
        epocaId: selectedEpoca?.id,
      } as RubricasPaginatedRequest),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentRubricas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'rubricas-paginated',
          { pageNumber: page - 1, pageLimit: pageSize, filters, sorting: null },
          selectedEpoca?.id,
        ],
        queryFn: () =>
          RubricasService('rubricas').getRubricasPaginated({
            pageNumber: page - 1,
            pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
            epocaId: selectedEpoca?.id,
          } as RubricasPaginatedRequest),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'rubricas-paginated',
        { pageNumber: page + 1, pageLimit: pageSize, filters, sorting: null },
        selectedEpoca?.id,
      ],
      queryFn: () =>
        RubricasService('rubricas').getRubricasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
          epocaId: selectedEpoca?.id,
        } as RubricasPaginatedRequest),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetRubricas = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['rubricas', selectedEpoca?.id],
    queryFn: () => RubricasService('rubricas').getRubricas(selectedEpoca?.id),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetRubricasCount = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['rubricas-count', selectedEpoca?.id],
    queryFn: async () => {
      const response = await RubricasService('rubricas').getRubricas(
        selectedEpoca?.id
      )
      return response.info?.data?.length || 0
    },
  })
}

export const useGetRubricasSelect = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['rubricas-select', selectedEpoca?.id],
    queryFn: async () => {
      const response = await RubricasService('rubricas').getRubricas(
        selectedEpoca?.id
      )
      const data = response.info.data || []
      return data.sort((a, b) => a.codigo.localeCompare(b.codigo))
    },
    staleTime: 30000,
  })
}

export const useGetRubrica = (id: string) => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['rubrica', id, selectedEpoca?.id],
    queryFn: () => RubricasService('rubricas').getRubrica(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
