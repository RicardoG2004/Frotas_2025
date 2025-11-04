import { actionTypes } from '@/config/modules'
import { frotas } from '@/config/modules/frotas/frotas-module'
import { PecasPage } from '@/pages/frotas/pecas/pecas-page'
import { PecasCreatePage } from '@/pages/frotas/pecas/components/pecas-create-page/pecas-create-page'
import { PecasUpdatePage } from '@/pages/frotas/pecas/components/pecas-update-page/pecas-update-page'
import { ServicosPage } from '@/pages/frotas/servicos/servicos-page'
import { ServicosCreatePage } from '@/pages/frotas/servicos/components/servicos-create-page/servicos-create-page'
import { ServicosUpdatePage } from '@/pages/frotas/servicos/components/servicos-update-page/servicos-update-page'
import { CoveirosCreatePage } from '@/pages/frotas/coveiros/components/coveiros-create-page/coveiros-create-page'
import { CoveirosUpdatePage } from '@/pages/frotas/coveiros/components/coveiros-update-page/coveiros-update-page'
import { CoveirosPage } from '@/pages/frotas/coveiros/coveiros-page'
import { FrotasDashboardPage } from '@/pages/frotas/frotas-dashboard'
import { MarcasPage } from '@/pages/frotas/Marcas/marcas-page'
import { MarcasCreatePage } from '@/pages/frotas/Marcas/components/marcas-create.page/marcas-create-page'
import { MarcasUpdatePage } from '@/pages/frotas/Marcas/components/marcas-update-page/marcas-update-page'
import { ModelosPage } from '@/pages/frotas/modelos/modelos-page'
import { ModelosCreatePage } from '@/pages/frotas/modelos/components/modelos-create-page/modelos-create-page'
import { ModelosUpdatePage } from '@/pages/frotas/modelos/components/modelos-update-page/modelos-update-page'
import { CategoriasPage } from '@/pages/frotas/categorias/categorias-page'
import { CategoriasCreatePage } from '@/pages/frotas/categorias/components/categorias-create-page/categorias-create-page'
import { CategoriasUpdatePage } from '@/pages/frotas/categorias/components/categorias-update-page/categorias-update-page'
import { FornecedoresPage } from '@/pages/frotas/fornecedores/fornecedores-page'
import { FornecedoresCreatePage } from '@/pages/frotas/fornecedores/components/fornecedores-create-page/fornecedores-create-page'
import { FornecedoresUpdatePage } from '@/pages/frotas/fornecedores/components/fornecedores-update-page/fornecedores-update-page'

import { LicenseGuard } from '@/components/auth/license-guard'

export const frotasRoutes = [
  {
    path: 'frotas',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <FrotasDashboardPage />
      </LicenseGuard>
    ),
    manageWindow: false,
    windowName: frotas.name,
  },
 
  {
    path: 'frotas/configuracoes',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <div></div>
      </LicenseGuard>
    ),
    windowName: 'Configurações',
  },
  {
    path: 'frotas/outros',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <div></div>
      </LicenseGuard>
    ),
    manageWindow: false,
    windowName: 'Outros',
  },
  {
    path: 'frotas/configuracoes/coveiros',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.coveiros.id}
      >
        <CoveirosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Coveiros',
  },
  {
    path: 'frotas/configuracoes/coveiros/create',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.coveiros.id}
        actionType={actionTypes.AuthAdd}
      >
        <CoveirosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Coveiro',
  },
  {
    path: 'frotas/configuracoes/coveiros/update',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.coveiros.id}
        actionType={actionTypes.AuthChg}
      >
        <CoveirosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Coveiro',
  },
  {
    path: 'frotas/configuracoes/pecas',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
      >
        <PecasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Peças',
  },
  {
    path: 'frotas/configuracoes/pecas/create',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        actionType={actionTypes.AuthAdd}
      >
        <PecasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Peça',
  },
  {
    path: 'frotas/configuracoes/pecas/update',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        actionType={actionTypes.AuthChg}
      >
        <PecasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Peça',
  },
  {
    path: 'frotas/configuracoes/servicos',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
      >
        <ServicosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Serviços',
  },
  {
    path: 'frotas/configuracoes/servicos/create',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        actionType={actionTypes.AuthAdd}
      >
        <ServicosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Serviço',
  },
  {
    path: 'frotas/configuracoes/servicos/update',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        actionType={actionTypes.AuthChg}
      >
        <ServicosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Serviço',
  },
  {
    path: 'frotas/configuracoes/marcas',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <MarcasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Marcas',
  },
  {
    path: 'frotas/configuracoes/marcas/create',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <MarcasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Marca',
  },
  {
    path: 'frotas/configuracoes/marcas/update',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <MarcasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Marca',
  },
  {
    path: 'frotas/configuracoes/modelos',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <ModelosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Modelos',
  },
  {
    path: 'frotas/configuracoes/modelos/create',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <ModelosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Modelo',
  },
  {
    path: 'frotas/configuracoes/modelos/update',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <ModelosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Modelo',
  },
  {
    path: 'frotas/configuracoes/categorias',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <CategoriasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Categorias',
  },
  {
    path: 'frotas/configuracoes/categorias/create',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <CategoriasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Categoria',
  },
  {
    path: 'frotas/configuracoes/categorias/update',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <CategoriasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Categoria',
  },
  {
    path: 'frotas/configuracoes/fornecedores',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <FornecedoresPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Fornecedores',
  },
  {
    path: 'frotas/configuracoes/fornecedores/create',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <FornecedoresCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Fornecedor',
  },
  {
    path: 'frotas/configuracoes/fornecedores/update',
    element: (
      <LicenseGuard requiredModule={frotas.id}>
        <FornecedoresUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Fornecedor',
  },
]
