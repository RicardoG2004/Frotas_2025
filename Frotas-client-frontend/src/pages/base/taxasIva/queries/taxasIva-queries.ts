import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TaxasIvaService } from '@/lib/services/base/taxasIva-service'

export const useGetTaxasIvaPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['taxas-iva-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      TaxasIvaService('taxas-iva').getTaxasIvaPaginated({
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

export const usePrefetchAdjacentTaxasIvas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['taxas-iva-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          TaxasIvaService('taxas-iva').getTaxasIvaPaginated({
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
      queryKey: ['taxasIva-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        TaxasIvaService('taxasIva').getTaxasIvaPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetTaxasIva = () => {
  return useQuery({
    queryKey: ['taxasIva'],
    queryFn: () => TaxasIvaService('taxasIva').getTaxasIva(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTaxasIvaCount = () => {
  return useQuery({
    queryKey: ['taxasIva-count'],
    queryFn: async () => {
      const response = await TaxasIvaService('taxasIva').getTaxasIva()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetTaxasIvaSelect = () => {
  return useQuery({
    queryKey: ['taxasIva-select'],
    queryFn: async () => {
      const response = await TaxasIvaService('taxasIva').getTaxasIva()
      const data = response.info.data || []
      return data.sort((a, b) => a.descricao.localeCompare(b.descricao))
    },
    staleTime: 30000,
  })
}

export const useGetTaxaIva = (id: string) => {
  return useQuery({
    queryKey: ['taxasIva', id],
    queryFn: async () => {
      const response = await TaxasIvaService('taxasIva').getTaxaIva(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
