import { DataTableFilterField } from '@/components/shared/data-table-types';
import { AplicacaoDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<AplicacaoDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1
  },
  {
    label: 'Descrição',
    value: 'descricao',
    order: 2
  },
  {
    label: 'Ativo',
    value: 'ativo',
    order: 3
  },
  {
    label: 'Área',
    value: 'areaId',
    order: 4
  }
];
