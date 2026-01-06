// src/pages/platform/licencas/components/licenca-forms/licenca-modulos-form.tsx
import { useEffect, useState } from 'react'
import { useGetModulosByAplicacao } from '@/pages/application/modulos/queries/modulos-queries'
import { Tree } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { useUpdateLicencaModulosFuncionalidades } from '../../queries/licencas-funcionalidades-mutations'
import { useGetModulosFuncionalidadesLicenca } from '../../queries/licencas-funcionalidades-queries'

interface LicencaModulosFormProps {
  licencaId: string
  aplicacaoId: string
  modalClose: () => void
}

export default function LicencaModulosForm({
  licencaId,
  aplicacaoId,
  modalClose,
}: LicencaModulosFormProps) {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const { data: modulos } = useGetModulosByAplicacao(aplicacaoId)
  const { data: savedModulosFuncionalidades } =
    useGetModulosFuncionalidadesLicenca(licencaId)
  const updateLicencaModulosFuncionalidades =
    useUpdateLicencaModulosFuncionalidades()

  useEffect(() => {
    if (modulos?.info?.data) {
      const transformedData = modulos.info.data.map((modulo) => ({
        title: modulo.nome,
        key: modulo.id,
        children: modulo.funcionalidades?.map((func) => ({
          title: func.nome,
          key: func.id,
        })),
      }))
      setTreeData(transformedData)
    }
  }, [modulos])

  useEffect(() => {
    if (savedModulosFuncionalidades?.funcionalidades) {
      const checkedFuncionalidades =
        savedModulosFuncionalidades.funcionalidades.map((func) => func.id)
      setCheckedKeys(checkedFuncionalidades)

      const expandedModulos = savedModulosFuncionalidades.modulos.map(
        (modulo) => modulo.id
      )
      setExpandedKeys(expandedModulos)
    }
  }, [savedModulosFuncionalidades])

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  const handleSave = async () => {
    try {
      // Transform checked keys into array of {moduloId, funcionalidadeId}
      const updateData = checkedKeys.reduce<
        { moduloId: string; funcionalidadeId: string }[]
      >((acc, funcionalidadeId) => {
        // Find the module that contains this funcionalidade
        const parentModule = treeData.find((modulo) =>
          modulo.children?.some((func) => func.key === funcionalidadeId)
        )

        if (parentModule) {
          acc.push({
            moduloId: parentModule.key as string,
            funcionalidadeId: funcionalidadeId as string,
          })
        }

        return acc
      }, [])

      const response = await updateLicencaModulosFuncionalidades.mutateAsync({
        licencaId,
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
            className='bg-transparent' // Add this line
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
          disabled={updateLicencaModulosFuncionalidades.isPending}
          onClick={handleSave}
          className='w-full md:w-auto'
        >
          {updateLicencaModulosFuncionalidades.isPending
            ? 'A guardar...'
            : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}
