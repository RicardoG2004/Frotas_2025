import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateClienteDTO, UpdateClienteDTO } from '@/types/dtos'
import ClientesService from '@/lib/services/platform/clientes-service'

export const useDeleteCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ClientesService('clientes').deleteCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-count'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-select'] })
    },
  })
}

export const useCreateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClienteDTO) =>
      ClientesService('clientes').createCliente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-count'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-select'] })
    },
  })
}

export const useUpdateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClienteDTO }) =>
      ClientesService('clientes').updateCliente(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-count'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-select'] })
    },
  })
}

export const useDeleteMultipleClientes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ClientesService('clientes').deleteMultipleClientes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-count'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-select'] })
    },
  })
}
