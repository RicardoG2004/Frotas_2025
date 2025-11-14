import { DataTableFilterField } from '@/components/shared/data-table-types'
import { CargoDTO } from '@/types/dtos/base/cargos.dtos'

export const filterFields: DataTableFilterField<CargoDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
]


