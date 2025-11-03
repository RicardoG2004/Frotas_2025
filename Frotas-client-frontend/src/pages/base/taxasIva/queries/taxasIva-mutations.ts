import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateTaxaIvaDTO,
  UpdateTaxaIvaDTO,
} from '@/types/dtos/base/taxasIva.dtos'
import { TaxasIvaService } from '@/lib/services/base/taxasIva-service'

export const useDeleteTaxaIva = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      TaxasIvaService('taxas-iva').deleteTaxaIva(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-count'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-select'] })
    },
  })
}

export const useCreateTaxaIva = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTaxaIvaDTO) =>
      TaxasIvaService('taxas-iva').createTaxaIva(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-count'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-select'] })
    },
  })
}

export const useUpdateTaxaIva = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaxaIvaDTO }) =>
      TaxasIvaService('taxas-iva').updateTaxaIva(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-count'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-select'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva', id] })
    },
  })
}

export const useDeleteMultipleTaxasIvas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      TaxasIvaService('taxas-iva').deleteMultipleTaxasIva(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-count'] })
      queryClient.invalidateQueries({ queryKey: ['taxas-iva-select'] })
    },
  })
}
