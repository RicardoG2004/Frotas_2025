import { useEffect, useState, useCallback } from 'react'
import { useGetModulosFuncionalidadesLicenca } from '@/pages/platform/licencas/queries/licencas-funcionalidades-queries'
import { PerfilFuncionalidadeDTO } from '@/types/dtos/perfil.dto'
import { Tree } from 'antd'
import type { TreeDataNode } from 'antd'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { usePerfilAdminPermissions } from '../../hooks/use-perfil-admin-permissions'
import { usePerfilAdminTreeData } from '../../hooks/use-perfil-admin-tree-data'
import { useUpdatePerfilFuncionalidades } from '../../queries/perfis-admin-mutations'
import { useGetPerfisModulosFuncionalidades } from '../../queries/perfis-admin-queries'

interface AuthProps {
  authVer: boolean
  authAdd: boolean
  authChg: boolean
  authDel: boolean
  authPrt: boolean
}

interface ExtendedTreeDataNode extends TreeDataNode {
  authProps?: AuthProps
  type?: 'modulo' | 'funcionalidade' | 'permission'
}

interface PerfilAdminModulosFormProps {
  perfilId: string
  licencaId: string
  modalClose: () => void
}

export default function PerfilAdminModulosForm({
  perfilId,
  licencaId,
  modalClose,
}: PerfilAdminModulosFormProps) {
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  // Queries
  const { data: licencaData, isLoading: isLoadingLicenca } =
    useGetModulosFuncionalidadesLicenca(licencaId)
  const { data: savedData, isLoading: isLoadingSaved } =
    useGetPerfisModulosFuncionalidades(perfilId)
  const updateMutation = useUpdatePerfilFuncionalidades()

  // Process data
  const treeData = usePerfilAdminTreeData(licencaData)
  const { checkedKeys: initialCheckedKeys, expandedKeys: initialExpandedKeys } =
    usePerfilAdminPermissions(savedData)

  // Set initial state when data is loaded
  useEffect(() => {
    if (initialCheckedKeys.length > 0) {
      setCheckedKeys(initialCheckedKeys)
    }
    if (initialExpandedKeys.length > 0) {
      setExpandedKeys(initialExpandedKeys)
    }
  }, [initialCheckedKeys, initialExpandedKeys])

  const onExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys)
    setAutoExpandParent(false)
  }, [])

  const onCheck = useCallback(
    (
      keys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }
    ) => {
      setCheckedKeys(Array.isArray(keys) ? keys : keys.checked)
    },
    []
  )

  const processPermissions = useCallback(
    (checkedKeys: React.Key[], treeData: ExtendedTreeDataNode[]) => {
      const permissionsByFunc = new Map<string, PerfilFuncionalidadeDTO>()

      checkedKeys.forEach((key) => {
        const keyStr = key.toString()

        for (const modulo of treeData) {
          const funcionalidade = modulo.children?.find((func) =>
            func.children?.some((perm) => perm.key === keyStr)
          )

          if (funcionalidade) {
            const funcId = funcionalidade.key as string
            let permissions = permissionsByFunc.get(funcId) ?? {
              perfilId,
              funcionalidadeId: funcId,
              authVer: false,
              authAdd: false,
              authChg: false,
              authDel: false,
              authPrt: false,
            }

            const permKey = keyStr
            if (permKey.endsWith('-ver')) permissions.authVer = true
            if (permKey.endsWith('-add')) permissions.authAdd = true
            if (permKey.endsWith('-chg')) permissions.authChg = true
            if (permKey.endsWith('-del')) permissions.authDel = true
            if (permKey.endsWith('-prt')) permissions.authPrt = true

            permissionsByFunc.set(funcId, permissions)
            break
          }
        }
      })

      return Array.from(permissionsByFunc.values())
    },
    [perfilId]
  )

  const handleSave = async () => {
    try {
      const updateData = processPermissions(checkedKeys, treeData)
      const response = await updateMutation.mutateAsync({
        perfilId,
        data: updateData,
      })

      if (response.info.succeeded) {
        toast.success('Configuração guardada com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao guardar configuração'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao guardar configuração'))
    }
  }

  const isLoading = isLoadingLicenca || isLoadingSaved
  const isSaving = updateMutation.isPending

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='border rounded-md p-4'>
        {treeData.length > 0 ? (
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            className='bg-transparent'
          />
        ) : (
          <div className='flex items-center justify-center p-4 text-muted-foreground'>
            Não existem módulos e funcionalidades disponíveis para a aplicação.
          </div>
        )}
      </div>

      <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
        <Button
          type='button'
          variant='outline'
          onClick={modalClose}
          className='w-full md:w-auto'
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          disabled={isSaving}
          onClick={handleSave}
          className='w-full md:w-auto'
        >
          {isSaving ? 'A guardar...' : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}
