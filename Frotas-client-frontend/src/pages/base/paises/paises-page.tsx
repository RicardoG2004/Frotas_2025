import {
  useGetPaisesPaginated,
  usePrefetchAdjacentPaises,
} from '@/pages/base/paises/queries/paises-queries'
// import { Navigate } from 'react-router-dom'
// import { usePermissionsStore } from '@/stores/permissions-store'
import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { PaisesTable } from './components/paises-table/paises-table'

export function PaisesPage() {
  // const { hasLicenseAccess } = usePermissionsStore()
  // const requiredLicenseId = 'PAISES_ACCESS' // Replace with your actual license ID

  // if (!hasLicenseAccess(requiredLicenseId)) {
  //   return <Navigate to='/unauthorized' replace />
  // }

  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetPaisesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentPaises,
  })

  const paises = data?.info?.data || []
  const totalPaises = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Países | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Geográficas',
            link: '/utilitarios/tabelas/geograficas',
          },
          { title: 'Países', link: '/utilitarios/tabelas/geograficas/paises' },
        ]}
      />
      <div className='mt-10'>
        <PaisesTable
          paises={paises}
          page={page}
          pageSize={pageSize}
          total={totalPaises}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
