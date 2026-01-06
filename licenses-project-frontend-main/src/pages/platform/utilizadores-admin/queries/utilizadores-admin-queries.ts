import { useQuery, useQueryClient } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useGetUtilizadoresPaginated = (
  clienteId: string,
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'utilizadores-admin-paginated',
      clienteId,
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      LicencasService(
        'licencas'
      ).LicencasUtilizadores.Admin.getUtilizadoresPaginated(clienteId, {
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting:
          (sorting as unknown as Array<{ id: string; desc: boolean }>) ??
          undefined,
      }),
    enabled: !!clienteId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentUtilizadores = (
  clienteId: string,
  currentPage: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPage = async (page: number) => {
    await queryClient.prefetchQuery({
      queryKey: [
        'utilizadores-admin-paginated',
        clienteId,
        page,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        LicencasService(
          'licencas'
        ).LicencasUtilizadores.Admin.getUtilizadoresPaginated(clienteId, {
          pageNumber: page,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return {
    prefetchNextPage: () => prefetchPage(currentPage + 1),
    prefetchPreviousPage: () =>
      currentPage > 1 && prefetchPage(currentPage - 1),
  }
}

export const useGetUtilizadores = (clienteId: string) => {
  return useQuery({
    queryKey: ['utilizadores-admin', clienteId],
    queryFn: () =>
      LicencasService('licencas').LicencasUtilizadores.Admin.getUtilizadores(
        clienteId
      ),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetBasicUserById = (id: string) => {
  return useQuery({
    queryKey: ['utilizador-admin-basic', id],
    queryFn: () =>
      LicencasService('licencas').LicencasUtilizadores.Admin.getBasicUserById(
        id
      ),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
