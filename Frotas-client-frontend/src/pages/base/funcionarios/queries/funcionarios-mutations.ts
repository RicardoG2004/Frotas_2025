import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateFuncionarioDTO,
  UpdateFuncionarioDTO,
} from '@/types/dtos/base/funcionarios.dtos'
import { FuncionariosService } from '@/lib/services/base/funcionarios-service'

export const useDeleteFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      FuncionariosService('funcionarios').deleteFuncionario(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-select'] })
      queryClient.invalidateQueries({ queryKey: ['funcionario', id] })
    },
  })
}

export const useDeleteMultipleFuncionarios = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      FuncionariosService('funcionarios').deleteMultipleFuncionarios(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-select'] })
    },
  })
}

export const useCreateFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFuncionarioDTO) =>
      FuncionariosService('funcionarios').createFuncionario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-select'] })
    },
  })
}

export const useUpdateFuncionario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuncionarioDTO }) =>
      FuncionariosService('funcionarios').updateFuncionario(id, {
        ...data,
        id,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-count'] })
      queryClient.invalidateQueries({ queryKey: ['funcionarios-select'] })
      queryClient.invalidateQueries({ queryKey: ['funcionario', id] })
    },
  })
}

