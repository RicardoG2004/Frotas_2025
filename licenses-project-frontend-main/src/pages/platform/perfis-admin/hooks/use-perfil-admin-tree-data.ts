import { useMemo } from 'react'
import { type ResponseModuloFuncionalidadeLicenca } from '@/types/responses'
import { type TreeDataNode } from 'antd'

export interface ExtendedTreeDataNode extends TreeDataNode {
  type?: 'modulo' | 'funcionalidade' | 'permission'
}

export function usePerfilAdminTreeData(
  data: ResponseModuloFuncionalidadeLicenca | undefined
) {
  return useMemo(() => {
    if (!data?.modulos) return []

    return data.modulos.map((modulo) => ({
      title: modulo.nome,
      key: modulo.id,
      type: 'modulo' as const,
      children: data.funcionalidades
        .filter((func) => func.moduloId === modulo.id)
        .map((func) => ({
          title: func.nome,
          key: func.id,
          type: 'funcionalidade' as const,
          children: [
            {
              title: 'Ver',
              key: `${func.id}-ver`,
              type: 'permission' as const,
            },
            {
              title: 'Adicionar',
              key: `${func.id}-add`,
              type: 'permission' as const,
            },
            {
              title: 'Alterar',
              key: `${func.id}-chg`,
              type: 'permission' as const,
            },
            {
              title: 'Apagar',
              key: `${func.id}-del`,
              type: 'permission' as const,
            },
            {
              title: 'Imprimir',
              key: `${func.id}-prt`,
              type: 'permission' as const,
            },
          ],
        })),
    })) as ExtendedTreeDataNode[]
  }, [data])
}
