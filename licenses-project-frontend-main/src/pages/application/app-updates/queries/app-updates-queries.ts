import { useQuery } from '@tanstack/react-query'
import AppUpdatesService from '@/lib/services/application/app-updates-service'

export const useGetUpdatesForAplicacao = (
  aplicacaoId: string,
  keyword?: string
) => {
  return useQuery({
    queryKey: ['app-updates', aplicacaoId, keyword],
    queryFn: () =>
      AppUpdatesService('app-updates').getUpdatesForAplicacao(
        aplicacaoId,
        keyword
      ),
    enabled: !!aplicacaoId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetUpdatesPaginated = (
  aplicacaoId: string,
  params: {
    pageNumber: number
    pageSize: number
    sorting?: Array<{ id: string; desc: boolean }>
    filters?: Array<{ id: string; value: string }>
    keyword?: string
  }
) => {
  return useQuery({
    queryKey: [
      'app-updates-paginated',
      aplicacaoId,
      params.pageNumber,
      params.pageSize,
      params.sorting,
      params.filters,
      params.filters,
    ],
    queryFn: () =>
      AppUpdatesService('app-updates').getUpdatesPaginated(aplicacaoId, params),
    enabled: !!aplicacaoId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetUpdateStatistics = (aplicacaoId: string) => {
  return useQuery({
    queryKey: ['app-updates-statistics', aplicacaoId],
    queryFn: () =>
      AppUpdatesService('app-updates').getUpdateStatistics(aplicacaoId),
    enabled: !!aplicacaoId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetUpdateById = (id: string) => {
  return useQuery({
    queryKey: ['app-update', id],
    queryFn: () => AppUpdatesService('app-updates').getUpdateById(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetLatestUpdate = (aplicacaoId: string) => {
  return useQuery({
    queryKey: ['app-update-latest', aplicacaoId],
    queryFn: () =>
      AppUpdatesService('app-updates').getLatestUpdate(aplicacaoId),
    enabled: !!aplicacaoId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useCheckUpdate = (
  versaoAtual: string,
  aplicacaoId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['app-update-check', versaoAtual, aplicacaoId],
    queryFn: () =>
      AppUpdatesService('app-updates').checkUpdate({
        versaoAtual,
        aplicacaoId,
      }),
    enabled: enabled && !!versaoAtual && !!aplicacaoId,
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  })
}
