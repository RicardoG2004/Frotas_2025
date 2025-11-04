import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EquipamentosService } from '@/lib/services/frotas/equipamentos-service'

export const useGetEquipamentosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'equipamentos-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      EquipamentosService(
        'equipamento'
      ).getEquipamentosPaginated({
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

export const usePrefetchAdjacentEquipamentos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'equipamentos-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          EquipamentosService(
            'equipamento'
          ).getEquipamentosPaginated({
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
      queryKey: [
        'equipamentos-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        EquipamentosService(
          'equipamento'
        ).getEquipamentosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetEquipamentos = () => {
  return useQuery({
    queryKey: ['equipamentos'],
    queryFn: () =>
      EquipamentosService('equipamento').getEquipamentos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetEquipamento = (id: string) => {
  return useQuery({
    queryKey: ['equipamento', id],
    queryFn: () => EquipamentosService('equipamento').getEquipamento(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetEquipamentoById = (id: string) => {
  return useQuery({
    queryKey: ['equipamento', id],
    queryFn: () => EquipamentosService('equipamento').getEquipamento(id),
    enabled: !!id,
  })
}

export const useGetEquipamentosSelect = () => {
  return useQuery({
    queryKey: ['equipamentos-select'],
    queryFn: async () => {
      const response =
        await EquipamentosService(
          'equipamento'
        ).getEquipamentos()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}
