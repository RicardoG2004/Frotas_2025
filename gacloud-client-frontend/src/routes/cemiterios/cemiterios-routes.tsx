import { actionTypes } from '@/config/modules'
import { cemiterios } from '@/config/modules/cemiterios/cemiterios-module'
import { AgenciasFunerariasPage } from '@/pages/cemiterios/agencias-funerarias/agencias-funerarias-page'
import { AgenciasFunerariasCreatePage } from '@/pages/cemiterios/agencias-funerarias/components/agencias-funerarias-create-page/agencias-funerarias-create-page'
import { AgenciasFunerariasUpdatePage } from '@/pages/cemiterios/agencias-funerarias/components/agencias-funerarias-update-page/agencias-funerarias-update-page'
import { CoveirosCreatePage } from '@/pages/cemiterios/coveiros/components/coveiros-create-page/coveiros-create-page'
import { CoveirosUpdatePage } from '@/pages/cemiterios/coveiros/components/coveiros-update-page/coveiros-update-page'
import { CoveirosPage } from '@/pages/cemiterios/coveiros/coveiros-page'
import { CemiteriosDashboardPage } from '@/pages/cemiterios/cemiterios-dashboard'
import { MarcasPage } from '@/pages/cemiterios/Marcas/marcas-page'
import { MarcasCreatePage } from '@/pages/cemiterios/Marcas/components/marcas-create.page/marcas-create-page'
import { MarcasUpdatePage } from '@/pages/cemiterios/Marcas/components/marcas-update-page/marcas-update-page'

import { LicenseGuard } from '@/components/auth/license-guard'

export const cemiteriosRoutes = [
  {
    path: 'cemiterios',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <CemiteriosDashboardPage />
      </LicenseGuard>
    ),
    manageWindow: false,
    windowName: cemiterios.name,
  },
 
  {
    path: 'cemiterios/configuracoes',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <div></div>
      </LicenseGuard>
    ),
    windowName: 'Configurações',
  },
  {
    path: 'cemiterios/outros',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <div></div>
      </LicenseGuard>
    ),
    manageWindow: false,
    windowName: 'Outros',
  },
  {
    path: 'cemiterios/configuracoes/coveiros',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.coveiros.id}
      >
        <CoveirosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Coveiros',
  },
  {
    path: 'cemiterios/configuracoes/coveiros/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.coveiros.id}
        actionType={actionTypes.AuthAdd}
      >
        <CoveirosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Coveiro',
  },
  {
    path: 'cemiterios/configuracoes/coveiros/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.coveiros.id}
        actionType={actionTypes.AuthChg}
      >
        <CoveirosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Coveiro',
  },
  {
    path: 'cemiterios/configuracoes/agencias-funerarias',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.agenciasFunerarias.id}
      >
        <AgenciasFunerariasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Agências Funerárias',
  },
  {
    path: 'cemiterios/configuracoes/agencias-funerarias/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.agenciasFunerarias.id}
        actionType={actionTypes.AuthAdd}
      >
        <AgenciasFunerariasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Agência Funerária',
  },
  {
    path: 'cemiterios/configuracoes/agencias-funerarias/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.agenciasFunerarias.id}
        actionType={actionTypes.AuthChg}
      >
        <AgenciasFunerariasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Agência Funerária',
  },
  {
    path: 'cemiterios/configuracoes/marcas',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <MarcasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Marcas',
  },
  {
    path: 'cemiterios/configuracoes/marcas/create',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <MarcasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Marca',
  },
  {
    path: 'cemiterios/configuracoes/marcas/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.marcas.id}
        actionType={actionTypes.AuthChg}
      >
        <MarcasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Marca',
  },
]
