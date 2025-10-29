import { SepulturaTipoGeralDTO } from '@/types/dtos/cemiterios/sepulturas-tipos-geral.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SepulturaTipoGeralDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
]
