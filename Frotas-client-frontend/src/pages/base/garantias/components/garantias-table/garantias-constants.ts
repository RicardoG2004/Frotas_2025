import { GarantiaDTO } from '@/types/dtos/base/garantias.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<GarantiaDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Anos',
    value: 'anos',
    order: 2,
  },
  {
    label: 'Kms',
    value: 'kms',
    order: 3,
  },
]


