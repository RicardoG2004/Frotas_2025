import { TipoViaturaDTO } from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<TipoViaturaDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
]

