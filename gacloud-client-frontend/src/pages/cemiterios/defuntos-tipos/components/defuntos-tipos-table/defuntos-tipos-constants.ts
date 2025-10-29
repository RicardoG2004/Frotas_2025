import { DefuntoTipoDTO } from '@/types/dtos/cemiterios/defuntos-tipos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<DefuntoTipoDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
]
