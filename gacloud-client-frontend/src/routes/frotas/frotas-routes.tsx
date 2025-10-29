import { actionTypes } from '@/config/modules'
import { frotas } from '@/config/modules/frotas/frotas-module'
import { AgenciasFunerariasPage } from '@/pages/frotas/agencias-funerarias/agencias-funerarias-page'
import { AgenciasFunerariasCreatePage } from '@/pages/frotas/agencias-funerarias/components/agencias-funerarias-create-page/agencias-funerarias-create-page'
import { AgenciasFunerariasUpdatePage } from '@/pages/frotas/agencias-funerarias/components/agencias-funerarias-update-page/agencias-funerarias-update-page'
import { CoveirosCreatePage } from '@/pages/frotas/coveiros/components/coveiros-create-page/coveiros-create-page'
import { CoveirosUpdatePage } from '@/pages/frotas/coveiros/components/coveiros-update-page/coveiros-update-page'
import { CoveirosPage } from '@/pages/frotas/coveiros/coveiros-page'
import { FrotasDashboardPage } from '@/pages/frotas/frotas-dashboard'
import { MarcasPage } from '@/pages/frotas/Marcas/marcas-page'
import { MarcasCreatePage } from '@/pages/frotas/Marcas/components/marcas-create.page/marcas-create-page'
import { MarcasUpdatePage } from '@/pages/frotas/Marcas/components/marcas-update-page/marcas-update-page'

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
    path: 'frotas/configuracoes/agencias-funerarias',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.agenciasFunerarias.id}
      >
        <AgenciasFunerariasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Agências Funerárias',
  },
  {
    path: 'frotas/configuracoes/agencias-funerarias/create',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.agenciasFunerarias.id}
        actionType={actionTypes.AuthAdd}
      >
        <AgenciasFunerariasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Agência Funerária',
  },
  {
    path: 'frotas/configuracoes/agencias-funerarias/update',
    element: (
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.agenciasFunerarias.id}
        actionType={actionTypes.AuthChg}
      >
        <AgenciasFunerariasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Agência Funerária',
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
      <LicenseGuard
        requiredModule={frotas.id}
        requiredPermission={frotas.permissions.marcas.id}
        actionType={actionTypes.AuthChg}
      >
        <MarcasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Marca',
  },
]
