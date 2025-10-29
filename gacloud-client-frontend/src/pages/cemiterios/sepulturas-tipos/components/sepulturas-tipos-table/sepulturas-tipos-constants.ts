import { SepulturaTipoDTO } from '@/types/dtos/cemiterios/sepulturas-tipos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SepulturaTipoDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Época',
    value: 'epoca.descricao',
    order: 2,
  },
  {
    label: 'Descrição',
    value: 'sepulturaTipoDescricao.descricao',
    order: 3,
  },
]
