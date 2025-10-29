import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SepulturaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Talhão',
    value: 'talhao.nome',
    order: 2,
  },
  {
    label: 'Tipo',
    value: 'sepulturaTipo.nome',
    order: 3,
  },
  {
    label: 'Bloqueada',
    value: 'bloqueada',
    order: 4,
  },
  {
    label: 'Litígio',
    value: 'litigio',
    order: 5,
  },
  {
    label: 'Estado',
    value: 'sepulturaEstadoId',
    order: 6,
  },
  {
    label: 'Situação',
    value: 'sepulturaSituacaoId',
    order: 7,
  },
]
