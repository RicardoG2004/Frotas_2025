import { useMemo } from 'react'
import { type ResponsePerfilModulosFuncionalidades } from '@/types/responses'

export function usePerfilAdminPermissions(
  data: ResponsePerfilModulosFuncionalidades | undefined
) {
  return useMemo(() => {
    if (!data?.modulos) return { checkedKeys: [], expandedKeys: [] }

    const checkedKeys: string[] = []
    const expandedKeys: string[] = data.modulos.map((modulo) => modulo.moduloId)

    data.modulos.forEach((modulo) => {
      modulo.funcionalidades.forEach((func) => {
        if (func.authVer) checkedKeys.push(`${func.funcionalidadeId}-ver`)
        if (func.authAdd) checkedKeys.push(`${func.funcionalidadeId}-add`)
        if (func.authChg) checkedKeys.push(`${func.funcionalidadeId}-chg`)
        if (func.authDel) checkedKeys.push(`${func.funcionalidadeId}-del`)
        if (func.authPrt) checkedKeys.push(`${func.funcionalidadeId}-prt`)
      })
    })

    return { checkedKeys, expandedKeys }
  }, [data])
}
