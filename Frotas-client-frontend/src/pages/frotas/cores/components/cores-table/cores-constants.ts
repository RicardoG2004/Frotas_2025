import { CorDTO } from '@/types/dtos/frotas/cores.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<CorDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
]

