import { useQuery, useQueryClient } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useGetLicencasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  console.log(sorting)
  return useQuery({
    queryKey: ['licencas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      LicencasService('licencas').getLicencasPaginated({
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

export const usePrefetchAdjacentLicencas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['licencas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          LicencasService('licencas').getLicencasPaginated({
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
      queryKey: ['licencas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        LicencasService('licencas').getLicencasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetLicencas = () => {
  return useQuery({
    queryKey: ['licencas'],
    queryFn: () => LicencasService('licencas').getLicencas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetLicencaById = (id: string) => {
  return useQuery({
    queryKey: ['licenca', id],
    queryFn: async () => {
      const response = await LicencasService('licencas').getLicencaById(id)
      return response.info.data
    },
    enabled: !!id,
  })
}

export const useGetLicencasSelect = () => {
  return useQuery({
    queryKey: ['licencas-select'],
    queryFn: async () => {
      const response = await LicencasService('licencas').getLicencas()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetLicencasCount = () => {
  return useQuery({
    queryKey: ['licencas-count'],
    queryFn: async () => {
      const response = await LicencasService('licencas').getLicencas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetLicencasByCliente = (clienteId: string) => {
  return useQuery({
    queryKey: ['licencas-by-cliente', clienteId],
    queryFn: async () => {
      const response =
        await LicencasService('licencas').getLicencasByCliente(clienteId)
      return response.info.data
    },
    enabled: !!clienteId,
  })
}

export const useGetLicencaApiKey = (licencaId: string) => {
  return useQuery({
    queryKey: ['licenca', licencaId],
    queryFn: async () => {
      const response =
        await LicencasService('licencas').Admin.getLicencaApiKey(licencaId)
      return response.info.data
    },
    enabled: !!licencaId,
  })
}
