import { FuncionalidadeDTO } from '@/types/dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<FuncionalidadeDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Descrição',
    value: 'descricao',
    order: 2,
  },
  {
    label: 'Ativo',
    value: 'ativo',
    order: 3,
  },
  {
    label: 'Aplicação',
    value: 'aplicacaoId',
    order: 4,
  },
  {
    label: 'Módulo',
    value: 'moduloId',
    order: 5,
  },
]
