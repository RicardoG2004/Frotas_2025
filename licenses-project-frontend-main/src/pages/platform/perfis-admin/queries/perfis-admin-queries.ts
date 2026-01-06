import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import PerfisService from '@/lib/services/platform/perfis-service'

export const useGetPerfisPaginated = (
  licencaId: string | undefined,
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'perfis-admin-paginated',
      licencaId,
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      PerfisService('perfis-admin').Admin.getPerfisPaginated(licencaId!, {
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),
    enabled: !!licencaId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentPerfis = (
  licencaId: string | undefined,
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1 && licencaId) {
      await queryClient.prefetchQuery({
        queryKey: [
          'perfis-admin-paginated',
          licencaId,
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          PerfisService('perfis-admin').Admin.getPerfisPaginated(licencaId, {
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
    if (licencaId) {
      await queryClient.prefetchQuery({
        queryKey: [
          'perfis-admin-paginated',
          licencaId,
          page + 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          PerfisService('perfis-admin').Admin.getPerfisPaginated(licencaId, {
            pageNumber: page + 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetPerfis = (
  licencaId: string | undefined,
  keyword?: string
) => {
  return useQuery({
    queryKey: ['perfis-admin', licencaId, keyword],
    queryFn: async () => {
      const response = await PerfisService('perfis-admin').Admin.getPerfis(
        licencaId!,
        keyword
      )
      return response.info.data
    },
    enabled: !!licencaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetPerfilById = (id: string) => {
  return useQuery({
    queryKey: ['perfil-admin', id],
    queryFn: () => PerfisService('perfis-admin').Admin.getPerfilById(id),
    enabled: !!id,
  })
}

export const useGetPerfisModulosFuncionalidades = (id: string) => {
  return useQuery({
    queryKey: ['perfis-admin-modulos-funcionalidades', id],
    queryFn: async () => {
      const response =
        await PerfisService(
          'perfis-admin'
        ).Admin.getPerfisModulosFuncionalidades(id)
      return response.info.data
    },
    enabled: !!id,
  })
}

export const useGetPerfisUtilizadoresFromLicenca = (role?: string) => {
  const { licencaId } = useAuthStore()

  return useQuery({
    queryKey: ['perfis-admin-utilizadores', licencaId, role],
    queryFn: () =>
      PerfisService('perfis-admin').Admin.getPerfisUtilizadoresFromLicenca(
        licencaId!,
        role
      ),
    enabled: !!licencaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
