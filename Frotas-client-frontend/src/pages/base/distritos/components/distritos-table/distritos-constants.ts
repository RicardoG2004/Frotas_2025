import { DistritoDTO } from '@/types/dtos/base/distritos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<DistritoDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'País',
    value: 'paisId',
    order: 2,
  },
]
