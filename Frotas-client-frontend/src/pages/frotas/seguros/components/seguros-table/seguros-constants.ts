import { SeguroDTO } from '@/types/dtos/frotas/seguros.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SeguroDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Seguradora',
    value: 'seguradora.descricao',
    order: 2,
  },
]


