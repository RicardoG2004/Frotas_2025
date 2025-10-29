import { ZonaDTO } from '@/types/dtos/cemiterios/zonas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ZonaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Cemitério',
    value: 'cemiterio.nome',
    order: 2,
  },
]
