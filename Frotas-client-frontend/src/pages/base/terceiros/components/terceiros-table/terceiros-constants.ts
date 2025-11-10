import { DataTableFilterField } from '@/components/shared/data-table-types'
import { TerceiroDTO } from '@/types/dtos/base/terceiros.dtos'

export const filterFields: DataTableFilterField<TerceiroDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'NIF',
    value: 'nif',
    order: 2,
  },
  {
    label: 'Morada',
    value: 'morada',
    order: 3,
  },
  {
    label: 'Código Postal',
    value: 'codigoPostalId',
    order: 4,
  },
]


