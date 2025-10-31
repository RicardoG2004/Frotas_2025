import { CategoriaDTO } from '@/types/dtos/frotas/categorias.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<CategoriaDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 2,
  },
]
