import { useGetEntidade } from '@/pages/base/entidades/queries/entidades-queries'
import { EntidadeContacto } from '@/types/dtos/base/entidades.dtos'
import { ContactoTipoLabel } from '@/types/enums/contacto-tipo.enum'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { fromDatabaseDate } from '@/utils/date-utils'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { EntidadeUpdateForm } from '../entidades-forms/entidade-update-form'

export function EntidadesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { findWindowByPathAndInstanceId, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const entidadeId = searchParams.get('entidadeId')
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const { data: entidadeData, isLoading } = useGetEntidade(entidadeId || '')

  console.log('Raw entidade data:', entidadeData)
  console.log('Current entidade:', entidadeData?.info?.data)
  console.log('Contacts from API:', entidadeData?.info?.data?.contactos)

  const handleClose = () => {
    // Remove form data from the form store
    removeFormState(formId)

    // Find the current window and remove it
    const currentWindow = findWindowByPathAndInstanceId(
      location.pathname,
      instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  // If no entidadeId is provided, redirect to entidades page
  if (!entidadeId) {
    navigate('/utilitarios/tabelas/configuracoes/entidades')
    return null
  }

  const currentEntidade = entidadeData?.info?.data

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Entidade | Frotas' />

      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClose}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs
          items={[
            {
              title: 'Configurações',
              link: '/utilitarios/tabelas/configuracoes',
            },
            {
              title: 'Entidades',
              link: '/utilitarios/tabelas/configuracoes/entidades',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/entidades/update?entidadeId=${entidadeId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Entidade</h2>
        </div>
        <div className='p-6'>
          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          ) : currentEntidade ? (
            <EntidadeUpdateForm
              entidadeId={entidadeId}
              modalClose={handleClose}
              initialData={{
                nome: currentEntidade.nome || '',
                nif: currentEntidade.nif || '',
                nifEstrangeiro: currentEntidade.nifEstrangeiro || false,
                paisId: currentEntidade.ruaId
                  ? currentEntidade.rua?.freguesia?.concelho?.distrito
                      ?.paisId || ''
                  : '',
                distritoId: currentEntidade.ruaId
                  ? currentEntidade.rua?.freguesia?.concelho?.distritoId || ''
                  : '',
                concelhoId: currentEntidade.ruaId
                  ? currentEntidade.rua?.freguesia?.concelhoId || ''
                  : '',
                freguesiaId: currentEntidade.ruaId
                  ? currentEntidade.rua?.freguesiaId || ''
                  : '',
                ruaId: currentEntidade.ruaId || '',
                ruaNumeroPorta: currentEntidade.ruaNumeroPorta || '',
                ruaAndar: currentEntidade.ruaAndar || '',
                cartaoIdentificacaoTipoId:
                  currentEntidade.cartaoIdentificacaoTipoId || 1,
                cartaoIdentificacaoNumero:
                  currentEntidade.cartaoIdentificacaoNumero || '',
                cartaoIdentificacaoDataEmissao:
                  currentEntidade.cartaoIdentificacaoDataEmissao
                    ? fromDatabaseDate(
                        currentEntidade.cartaoIdentificacaoDataEmissao
                      ) || new Date()
                    : new Date(),
                cartaoIdentificacaoDataValidade:
                  currentEntidade.cartaoIdentificacaoDataValidade
                    ? fromDatabaseDate(
                        currentEntidade.cartaoIdentificacaoDataValidade
                      ) || new Date()
                    : new Date(),
                estadoCivilId: currentEntidade.estadoCivilId || 1,
                sexo: (currentEntidade.sexo === 'F' ? 'F' : 'M') as 'M' | 'F',
                ativo: currentEntidade.ativo ?? true,
                historico: currentEntidade.historico || false,
                contactos: Object.entries(ContactoTipoLabel).map(([key]) => {
                  const contact = currentEntidade.contactos?.find(
                    (c) => c.entidadeContactoTipoId === Number(key)
                  )
                  return {
                    tipo: Number(key),
                    valor: contact?.valor || '',
                  }
                }),
                predefinedContactoTipo: (() => {
                  const predefined = currentEntidade.contactos?.find(
                    (contact: EntidadeContacto) => contact.principal
                  )
                  console.log('Found predefined contact:', predefined)
                  return predefined?.entidadeContactoTipoId
                })(),
              }}
            />
          ) : (
            <div className='text-center text-gray-500'>
              Entidade não encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
