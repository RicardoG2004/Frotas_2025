import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateAppUpdateDTO,
  UpdateAppUpdateDTO,
  UpdateType,
} from '@/types/dtos'
import AplicacoesService from '@/lib/services/application/aplicacoes-service'
import AppUpdatesService from '@/lib/services/application/app-updates-service'

export const useCreateAppUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppUpdateDTO) =>
      AppUpdatesService('app-updates').createUpdate(data),
    onSuccess: async (_, variables) => {
      // Update the application version to match the app update version
      try {
        // Get all applications to find the one we need
        const aplicacoesResponse =
          await AplicacoesService('aplicacoes').getAplicacoes()
        const aplicacao = aplicacoesResponse.info.data?.find(
          (app) => app.id === variables.aplicacaoId
        )

        if (aplicacao) {
          // Update the application with the new version
          await AplicacoesService('aplicacoes').updateAplicacao(
            variables.aplicacaoId,
            {
              nome: aplicacao.nome,
              descricao: aplicacao.descricao,
              versao: variables.versao,
              ativo: aplicacao.ativo,
              areaId: aplicacao.areaId,
            }
          )

          // Invalidate applications queries to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-paginated'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-select'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-count'] })
          // Also invalidate licenses since they show application version
          queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
          queryClient.invalidateQueries({ queryKey: ['licencas'] })
        }
      } catch (error) {
        console.error('Failed to update application version:', error)
        // Don't throw - the app update was created successfully
      }

      queryClient.invalidateQueries({
        queryKey: ['app-updates', variables.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-paginated', variables.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-update-latest', variables.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-statistics', variables.aplicacaoId],
      })
    },
  })
}

export const useUpdateAppUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppUpdateDTO }) =>
      AppUpdatesService('app-updates').updateUpdate(id, { ...data, id }),
    onSuccess: async (_, variables) => {
      // Update the application version to match the app update version
      try {
        // Get all applications to find the one we need
        const aplicacoesResponse =
          await AplicacoesService('aplicacoes').getAplicacoes()
        const aplicacao = aplicacoesResponse.info.data?.find(
          (app) => app.id === variables.data.aplicacaoId
        )

        if (aplicacao) {
          // Update the application with the new version
          await AplicacoesService('aplicacoes').updateAplicacao(
            variables.data.aplicacaoId,
            {
              nome: aplicacao.nome,
              descricao: aplicacao.descricao,
              versao: variables.data.versao,
              ativo: aplicacao.ativo,
              areaId: aplicacao.areaId,
            }
          )

          // Invalidate applications queries to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-paginated'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-select'] })
          queryClient.invalidateQueries({ queryKey: ['aplicacoes-count'] })
          // Also invalidate licenses since they show application version
          queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
          queryClient.invalidateQueries({ queryKey: ['licencas'] })
        }
      } catch (error) {
        console.error('Failed to update application version:', error)
        // Don't throw - the app update was updated successfully
      }

      queryClient.invalidateQueries({ queryKey: ['app-update', variables.id] })
      queryClient.invalidateQueries({
        queryKey: ['app-updates', variables.data.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-paginated', variables.data.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-update-latest', variables.data.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-statistics', variables.data.aplicacaoId],
      })
    },
  })
}

export const useDeleteAppUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: string; aplicacaoId: string }) =>
      AppUpdatesService('app-updates').deleteUpdate(variables.id),
    onSuccess: (_, variables) => {
      // Invalidate all update-related queries
      queryClient.invalidateQueries({ queryKey: ['app-update', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['app-updates'] })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-paginated', variables.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-update-latest', variables.aplicacaoId],
      })
      queryClient.invalidateQueries({
        queryKey: ['app-updates-statistics', variables.aplicacaoId],
      })
    },
  })
}

export const useUploadUpdatePackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      id: string
      file: File
      onProgress?: (progress: number) => void
      aplicacaoId?: string
      packageType?: UpdateType
    }) =>
      AppUpdatesService('app-updates').uploadUpdatePackage(
        variables.id,
        variables.file,
        variables.onProgress,
        variables.packageType
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['app-update', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['app-updates'] })
      if (variables.aplicacaoId) {
        queryClient.invalidateQueries({
          queryKey: ['app-updates-paginated', variables.aplicacaoId],
        })
        queryClient.invalidateQueries({
          queryKey: ['app-updates-statistics', variables.aplicacaoId],
        })
      }
    },
  })
}

export const useDeleteUpdatePackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      id: string
      aplicacaoId?: string
      packageType?: UpdateType
    }) =>
      AppUpdatesService('app-updates').deleteUpdatePackage(
        variables.id,
        variables.packageType
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['app-update', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['app-updates'] })
      if (variables.aplicacaoId) {
        queryClient.invalidateQueries({
          queryKey: ['app-updates-paginated', variables.aplicacaoId],
        })
        queryClient.invalidateQueries({
          queryKey: ['app-updates-statistics', variables.aplicacaoId],
        })
      }
    },
  })
}
