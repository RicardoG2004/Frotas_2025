import { useState } from 'react'
import AppUpdateStatistics from '@/pages/application/app-updates/components/app-update-statistics'
import AppUpdatesTable from '@/pages/application/app-updates/components/app-updates-table'
import {
  useGetUpdatesPaginated,
  useGetUpdateStatistics,
} from '@/pages/application/app-updates/queries/app-updates-queries'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function AppUpdatesPage() {
  const { aplicacaoId } = useParams<{ aplicacaoId: string }>()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters] = useState<Array<{ id: string; value: string }>>([])
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([
    { id: 'dataLancamento', desc: true },
  ])

  const { data, isLoading } = useGetUpdatesPaginated(aplicacaoId || '', {
    pageNumber: page,
    pageSize: pageSize,
    sorting: sorting,
    filters: filters,
    keyword: keyword || undefined,
  })

  const { data: statisticsData } = useGetUpdateStatistics(aplicacaoId || '')

  const updates = data?.info?.data || []
  const totalUpdates = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleSortingChange = (
    newSorting: Array<{ id: string; desc: boolean }>
  ) => {
    setSorting(newSorting)
  }

  if (isLoading) {
    return (
      <div className='p-5'>
        <DataTableSkeleton columnCount={5} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-5 p-5'>
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Aplicações', link: '/administracao/aplicacoes' },
          { title: 'Atualizações', link: '#' },
        ]}
      />
      <PageHead title='Gestão de Atualizações' />
      {statisticsData?.info?.data && (
        <AppUpdateStatistics statistics={statisticsData.info.data} />
      )}
      <AppUpdatesTable
        updates={updates}
        aplicacaoId={aplicacaoId || ''}
        total={totalUpdates}
        pageCount={pageCount}
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
      />
    </div>
  )
}
