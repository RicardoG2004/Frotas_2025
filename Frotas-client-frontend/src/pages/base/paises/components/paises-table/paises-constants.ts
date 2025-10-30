import { PaisDTO } from '@/types/dtos/base/paises.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<PaisDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Código',
    value: 'codigo',
    order: 2,
  },
  {
    label: 'Prefixo',
    value: 'prefixo',
    order: 3,
  },
]
