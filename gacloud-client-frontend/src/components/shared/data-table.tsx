import React, { useState, useEffect } from 'react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  Updater,
} from '@tanstack/react-table'
import { PrintOption } from '@/types/data-table'
import { ArrowUpDown } from 'lucide-react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableFilterModal } from '@/components/shared/data-table-filter-modal'
import {
  DataTableFilterField,
  DataTableColumnDef,
} from '@/components/shared/data-table-types'
import { DataTableToolbar } from './data-table-toolbar'

export type DataTableAction = {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'emerald'
  disabled?: boolean
  showOnlyIcon?: boolean
  className?: string
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  filterFields?: DataTableFilterField<TData>[]
  pageSizeOptions?: number[]
  initialFilters?: ColumnFiltersState
  initialActiveFiltersCount?: number
  onPaginationChange?: (page: number, pageSize: number) => void
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  FilterControls: React.ComponentType<{
    table: any
    columns: any[]
    onApplyFilters: () => void
    onClearFilters: () => void
  }>
  baseRoute?: string
  hiddenColumns?: string[]
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
  enableSorting?: boolean
  selectedRows?: string[]
  onRowSelectionChange?: (selectedRows: string[]) => void
  printOptions?: PrintOption[]
  totalRows?: number
  toolbarActions?: DataTableAction[]
  initialPage?: number
  initialPageSize?: number
  initialSorting?: Array<{ id: string; desc: boolean }>
  initialColumnVisibility?: Record<string, boolean>
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void
}

// Add these translations
const ptPTTranslations = {
  rowsPerPage: 'Linhas por página',
  of: 'de',
  page: 'Página',
  noResults: 'Sem resultados.',
  rowsSelected: 'linha(s) selecionada(s).',
  goToFirstPage: 'Ir para primeira página',
  goToPreviousPage: 'Ir para página anterior',
  goToNextPage: 'Ir para próxima página',
  goToLastPage: 'Ir para última página',
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialFilters = [],
  initialActiveFiltersCount,
  onPaginationChange,
  onFiltersChange,
  FilterControls,
  baseRoute,
  hiddenColumns,
  onSortingChange,
  selectedRows,
  onRowSelectionChange,
  printOptions,
  totalRows,
  toolbarActions,
  initialPage = 1,
  initialPageSize = 10,
  initialSorting = [],
  initialColumnVisibility = {},
  onColumnVisibilityChange,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(initialPage - 1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters)
  const [pendingColumnFilters, setPendingColumnFilters] =
    useState<ColumnFiltersState>(initialFilters)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  )
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (hiddenColumns) {
      setColumnVisibility(
        hiddenColumns.reduce(
          (acc, columnId) => ({
            ...acc,
            [columnId]: false,
          }),
          {}
        )
      )
    }
  }, [hiddenColumns])

  useEffect(() => {
    setPageSize(initialPageSize)
  }, [initialPageSize])

  useEffect(() => {
    if (initialActiveFiltersCount !== undefined) {
      setActiveFiltersCount(initialActiveFiltersCount)
    }
  }, [initialActiveFiltersCount])

  useEffect(() => {
    const count = columnFilters.filter((filter) => filter.value).length
    setActiveFiltersCount(count)
  }, [columnFilters])

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    if (onPaginationChange) {
      onPaginationChange(newPageIndex + 1, newPageSize)
    }
    setPageIndex(newPageIndex)
    setPageSize(newPageSize)
  }

  const handleApplyFilters = () => {
    setColumnFilters(pendingColumnFilters)
    if (onFiltersChange) {
      const formattedFilters = pendingColumnFilters
        .filter((filter) => filter.value)
        .map((filter) => ({
          id: filter.id,
          value: filter.value as string,
        }))
      onFiltersChange(formattedFilters)
    }
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = () => {
    setPendingColumnFilters([])
    setColumnFilters([])
    setPageIndex(0)
    if (onFiltersChange) {
      onFiltersChange([])
    }
    if (onPaginationChange) {
      onPaginationChange(1, pageSize)
    }
    if (baseRoute) {
      navigate(baseRoute)
    }
    setIsFilterModalOpen(false)
  }

  const handleColumnVisibilityChange = (
    updaterOrValue: Updater<VisibilityState>
  ) => {
    const updatedVisibility =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility)
        : updaterOrValue
    setColumnVisibility(updatedVisibility)
    if (onColumnVisibilityChange) {
      onColumnVisibilityChange(updatedVisibility)
    }
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      columnFilters: pendingColumnFilters,
      columnVisibility,
      sorting,
      rowSelection: selectedRows?.reduce(
        (acc, id) => ({
          ...acc,
          [id]: true,
        }),
        {}
      ),
    },
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getRowId: (row: any) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        const currentSelection = table.getState().rowSelection
        const newSelection = updater(currentSelection)
        const selectedIds = Object.entries(newSelection)
          .filter(([_, selected]) => selected)
          .map(([id]) => id)
        onRowSelectionChange?.(selectedIds)
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        })
        handlePaginationChange(newState.pageIndex, newState.pageSize)
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting)
        setSorting(newSorting)
        if (onSortingChange) {
          onSortingChange(
            newSorting.map((sort) => ({
              id: sort.id,
              desc: sort.desc,
            }))
          )
        }
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        const newFilters = updater(pendingColumnFilters)
        setPendingColumnFilters(newFilters)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  // Update column visibility when component mounts
  useEffect(() => {
    table.setColumnVisibility(initialColumnVisibility)
  }, [])

  useEffect(() => {
    setColumnVisibility(initialColumnVisibility)
    // Force table to update its state
    if (table) {
      table.setColumnVisibility(initialColumnVisibility)
    }
  }, [initialColumnVisibility, table])

  const getActiveFiltersCount = () => {
    return activeFiltersCount
  }

  return (
    <div className='flex flex-col space-y-4'>
      <DataTableToolbar
        onFilterClick={() => setIsFilterModalOpen(true)}
        activeFiltersCount={getActiveFiltersCount()}
        printOptions={printOptions}
        table={table}
        toolbarActions={toolbarActions}
      />

      <DataTableFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        table={table}
        columns={columns}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        FilterControls={FilterControls}
      />

      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex-1'>
          <ScrollArea className='h-[calc(100vh-500px)] rounded-md border md:h-[calc(100vh-400px)]'>
            <div>
              <Table key={JSON.stringify(columnVisibility)}>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className='hover:bg-muted'>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            'h-12 font-semibold text-muted-foreground hover:text-foreground',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'center' && 'text-center',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'right' && 'text-right',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'left' && 'text-left'
                          )}
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ||
                            header.column.getCanHide() ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div
                                  className={cn(
                                    'flex items-center gap-2',
                                    (
                                      header.column
                                        .columnDef as DataTableColumnDef<TData>
                                    ).meta?.align === 'center' &&
                                      'justify-center',
                                    (
                                      header.column
                                        .columnDef as DataTableColumnDef<TData>
                                    ).meta?.align === 'right' && 'justify-end',
                                    header.column.getCanSort() &&
                                      'cursor-pointer select-none'
                                  )}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getCanSort() && (
                                    <div className='w-4'>
                                      {header.column.getIsSorted() ===
                                        'asc' && (
                                        <ArrowUpIcon className='h-4 w-4' />
                                      )}
                                      {header.column.getIsSorted() ===
                                        'desc' && (
                                        <ArrowDownIcon className='h-4 w-4' />
                                      )}
                                      {!header.column.getIsSorted() && (
                                        <ArrowUpDown className='h-4 w-4 opacity-50' />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                {header.column.getCanSort() && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        header.column.toggleSorting(false)
                                      }
                                      className='gap-2'
                                    >
                                      <ArrowUpIcon className='h-3.5 w-3.5' />
                                      Asc
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        header.column.toggleSorting(true)
                                      }
                                      className='gap-2'
                                    >
                                      <ArrowDownIcon className='h-3.5 w-3.5' />
                                      Desc
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {header.column.getCanHide() && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      header.column.toggleVisibility(false)
                                    }
                                    className='gap-2'
                                  >
                                    <Eye className='h-3.5 w-3.5' />
                                    Esconder
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <div
                              className={cn(
                                'flex items-center gap-2',
                                (
                                  header.column
                                    .columnDef as DataTableColumnDef<TData>
                                ).meta?.align === 'center' && 'justify-center',
                                (
                                  header.column
                                    .columnDef as DataTableColumnDef<TData>
                                ).meta?.align === 'right' && 'justify-end'
                              )}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.width,
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'center' && 'text-center',
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'right' && 'text-right',
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'left' && 'text-left'
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        {ptPTTranslations.noResults}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex-1 text-sm text-muted-foreground'>
                {selectedRows?.length || 0} {ptPTTranslations.of}{' '}
                {totalRows || table.getFilteredRowModel().rows.length}{' '}
                {ptPTTranslations.rowsSelected}
              </div>
              <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm font-medium'>
                    {ptPTTranslations.rowsPerPage}
                  </p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value: string) => {
                      const newSize = Number(value)
                      table.setPageSize(newSize)
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px]'>
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side='top'>
                      {pageSizeOptions.map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
              <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                {ptPTTranslations.page}{' '}
                {table.getState().pagination.pageIndex + 1}{' '}
                {ptPTTranslations.of} {table.getPageCount()}
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  aria-label={ptPTTranslations.goToFirstPage}
                  variant='outline'
                  className='hidden h-8 w-8 p-0 lg:flex'
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <DoubleArrowLeftIcon className='h-4 w-4' aria-hidden='true' />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToPreviousPage}
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToNextPage}
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToLastPage}
                  variant='outline'
                  className='hidden h-8 w-8 p-0 lg:flex'
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <DoubleArrowRightIcon
                    className='h-4 w-4'
                    aria-hidden='true'
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
