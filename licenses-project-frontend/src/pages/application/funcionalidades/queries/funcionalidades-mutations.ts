import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateFuncionalidadeDTO, UpdateFuncionalidadeDTO } from '@/types/dtos'
import FuncionalidadesService from '@/lib/services/application/funcionalidades-service'

export const useDeleteFuncionalidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      FuncionalidadesService('funcionalidades').deleteFuncionalidade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] })
    },
  })
}

export const useCreateFuncionalidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFuncionalidadeDTO) =>
      FuncionalidadesService('funcionalidades').createFuncionalidade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] })
    },
  })
}

export const useUpdateFuncionalidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuncionalidadeDTO }) =>
      FuncionalidadesService('funcionalidades').updateFuncionalidade(id, {
        ...data,
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] })
    },
  })
}

export const useDeleteMultipleFuncionalidades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      FuncionalidadesService('funcionalidades').deleteMultipleFuncionalidades(
        ids
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] })
    },
  })
}
