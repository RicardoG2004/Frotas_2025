import { useGetAplicacoesCount } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useGetAplicacoes } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useGetAreasCount } from '@/pages/application/areas/queries/areas-queries'

export const useGetDashboardCounts = () => {
  const { data: areasCount, isLoading: isLoadingAreas } = useGetAreasCount()
  const { data: aplicacoesCount, isLoading: isLoadingAplicacoes } =
    useGetAplicacoesCount()
  const { data: aplicacoesResponse, isLoading: isLoadingAplicacoesData } =
    useGetAplicacoes()

  const activeAplicacoesCount =
    aplicacoesResponse?.info?.data?.filter((app) => app.ativo).length || 0

  return {
    areasCount,
    aplicacoesCount,
    activeAplicacoesCount,
    isLoading: isLoadingAreas || isLoadingAplicacoes || isLoadingAplicacoesData,
  }
}
