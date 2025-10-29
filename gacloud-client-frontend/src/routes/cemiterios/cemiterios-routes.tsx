import { actionTypes } from '@/config/modules'
import { cemiterios } from '@/config/modules/cemiterios/cemiterios-module'
import { AgenciasFunerariasPage } from '@/pages/cemiterios/agencias-funerarias/agencias-funerarias-page'
import { AgenciasFunerariasCreatePage } from '@/pages/cemiterios/agencias-funerarias/components/agencias-funerarias-create-page/agencias-funerarias-create-page'
import { AgenciasFunerariasUpdatePage } from '@/pages/cemiterios/agencias-funerarias/components/agencias-funerarias-update-page/agencias-funerarias-update-page'
import { CemiteriosDashboardPage } from '@/pages/cemiterios/cemiterios-dashboard'
import { CemiteriosMapaPage } from '@/pages/cemiterios/cemiterios-mapa/cemiterios-mapa-page'
import { CemiteriosViewPage } from '@/pages/cemiterios/cemiterios-view/cemiterios-view-page'
import { CemiteriosPage } from '@/pages/cemiterios/cemiterios/cemiterios-page'
import { CemiteriosCreatePage } from '@/pages/cemiterios/cemiterios/components/cemiterios-create-page/cemiterios-create-page'
import { CemiteriosUpdatePage } from '@/pages/cemiterios/cemiterios/components/cemiterios-update-page/cemiterios-update-page'
import { CoveirosCreatePage } from '@/pages/cemiterios/coveiros/components/coveiros-create-page/coveiros-create-page'
import { CoveirosUpdatePage } from '@/pages/cemiterios/coveiros/components/coveiros-update-page/coveiros-update-page'
import { CoveirosPage } from '@/pages/cemiterios/coveiros/coveiros-page'
import { DefuntosTiposCreatePage } from '@/pages/cemiterios/defuntos-tipos/components/defuntos-tipos-create-page/defuntos-tipos-create-page'
import { DefuntosTiposUpdatePage } from '@/pages/cemiterios/defuntos-tipos/components/defuntos-tipos-update-page/defuntos-tipos-update-page'
import { DefuntosTiposPage } from '@/pages/cemiterios/defuntos-tipos/defuntos-tipos-page'
import { ProprietariosCreatePage } from '@/pages/cemiterios/proprietarios/components/proprietarios-create-page/proprietarios-create-page'
import { ProprietariosUpdatePage } from '@/pages/cemiterios/proprietarios/components/proprietarios-update-page/proprietarios-update-page'
import { ProprietariosPage } from '@/pages/cemiterios/proprietarios/proprietarios-page'
import { SepulturasTiposDescricoesCreatePage } from '@/pages/cemiterios/sepulturas-tipos-descricoes/components/sepulturas-tipos-descricoes-create-page/sepulturas-tipos-descricoes-create-page'
import { SepulturasTiposDescricoesUpdatePage } from '@/pages/cemiterios/sepulturas-tipos-descricoes/components/sepulturas-tipos-descricoes-update-page/sepulturas-tipos-descricoes-update-page'
import { SepulturasTiposCreatePage } from '@/pages/cemiterios/sepulturas-tipos/components/sepulturas-tipos-create-page/sepulturas-tipos-create-page'
import { SepulturasTiposUpdatePage } from '@/pages/cemiterios/sepulturas-tipos/components/sepulturas-tipos-update-page/sepulturas-tipos-update-page'
import { SepulturasTiposPage } from '@/pages/cemiterios/sepulturas-tipos/sepulturas-tipos-page'
import { SepulturasCreatePage } from '@/pages/cemiterios/sepulturas/components/sepulturas-create-page/sepulturas-create-page'
import { SepulturasUpdatePage } from '@/pages/cemiterios/sepulturas/components/sepulturas-update-page/sepulturas-update-page'
import { SepulturasPage } from '@/pages/cemiterios/sepulturas/sepulturas-page'
import { TalhoesCreatePage } from '@/pages/cemiterios/talhoes/components/talhoes-create-page/talhoes-create-page'
import { TalhoesUpdatePage } from '@/pages/cemiterios/talhoes/components/talhoes-update-page/talhoes-update-page'
import { TalhoesPage } from '@/pages/cemiterios/talhoes/talhoes-page'
import { ZonasCreatePage } from '@/pages/cemiterios/zonas/components/zonas-create-page/zonas-create-page'
import { ZonasUpdatePage } from '@/pages/cemiterios/zonas/components/zonas-update-page/zonas-update-page'
import { ZonasPage } from '@/pages/cemiterios/zonas/zonas-page'
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
    windowName: 'Cemitérios',
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
    path: 'cemiterios/configuracoes/cemiterios',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.cemiterios.id}
      >
        <CemiteriosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Cemitérios',
  },
  {
    path: 'cemiterios/configuracoes/cemiterios/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.cemiterios.id}
        actionType={actionTypes.AuthAdd}
      >
        <CemiteriosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Cemitério',
  },
  {
    path: 'cemiterios/configuracoes/cemiterios/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.cemiterios.id}
        actionType={actionTypes.AuthChg}
      >
        <CemiteriosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Cemitério',
  },
  {
    path: 'cemiterios/configuracoes/zonas',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.zonas.id}
      >
        <ZonasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Zonas',
  },
  {
    path: 'cemiterios/configuracoes/zonas/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.zonas.id}
        actionType={actionTypes.AuthAdd}
      >
        <ZonasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Zona',
  },
  {
    path: 'cemiterios/configuracoes/zonas/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.cemiterios.id}
        actionType={actionTypes.AuthChg}
      >
        <ZonasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Zona',
  },
  {
    path: 'cemiterios/configuracoes/talhoes',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.talhoes.id}
      >
        <TalhoesPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Talhoes',
  },
  {
    path: 'cemiterios/configuracoes/talhoes/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.talhoes.id}
        actionType={actionTypes.AuthAdd}
      >
        <TalhoesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Talhão',
  },
  {
    path: 'cemiterios/configuracoes/talhoes/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.talhoes.id}
        actionType={actionTypes.AuthAdd}
      >
        <TalhoesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Talhão',
  },
  {
    path: 'cemiterios/outros/tipos-descricoes',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTiposDescricoes.id}
      >
        <SepulturasTiposDescricoesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Tipos de Sepultura [G]',
  },
  {
    path: 'cemiterios/outros/tipos-descricoes/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTiposDescricoes.id}
        actionType={actionTypes.AuthAdd}
      >
        <SepulturasTiposDescricoesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Tipo [G]',
  },
  {
    path: 'cemiterios/outros/tipos-descricoes/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTiposDescricoes.id}
        actionType={actionTypes.AuthChg}
      >
        <SepulturasTiposDescricoesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Tipo [G]',
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
    path: 'cemiterios/configuracoes/sepulturas',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturas.id}
      >
        <SepulturasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Sepulturas',
  },
  {
    path: 'cemiterios/configuracoes/sepulturas/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturas.id}
        actionType={actionTypes.AuthAdd}
      >
        <SepulturasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Sepultura',
  },
  {
    path: 'cemiterios/configuracoes/sepulturas/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturas.id}
        actionType={actionTypes.AuthChg}
      >
        <SepulturasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Sepultura',
  },
  {
    path: 'cemiterios/configuracoes/sepulturas/tipos',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTipos.id}
      >
        <SepulturasTiposPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Tipos de Sepultura [E]',
  },
  {
    path: 'cemiterios/configuracoes/sepulturas/tipos/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTipos.id}
        actionType={actionTypes.AuthAdd}
      >
        <SepulturasTiposCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Tipo [E]',
  },
  {
    path: 'cemiterios/configuracoes/sepulturas/tipos/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.sepulturasTipos.id}
        actionType={actionTypes.AuthChg}
      >
        <SepulturasTiposUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Tipo [E]',
  },
  {
    path: 'cemiterios/configuracoes/mapa',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <CemiteriosMapaPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar/Editar Mapa',
  },
  {
    path: 'cemiterios/configuracoes/mapa/view',
    element: (
      <LicenseGuard requiredModule={cemiterios.id}>
        <CemiteriosViewPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Ver Mapa',
  },
  {
    path: 'cemiterios/configuracoes/proprietarios',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.proprietarios.id}
      >
        <ProprietariosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Proprietários',
  },
  {
    path: 'cemiterios/configuracoes/proprietarios/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.proprietarios.id}
        actionType={actionTypes.AuthAdd}
      >
        <ProprietariosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Proprietário',
  },
  {
    path: 'cemiterios/configuracoes/proprietarios/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.proprietarios.id}
        actionType={actionTypes.AuthChg}
      >
        <ProprietariosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Proprietário',
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
    path: 'cemiterios/configuracoes/defuntos/tipos',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.defuntosTipos.id}
      >
        <DefuntosTiposPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Tipos de Defunto',
  },
  {
    path: 'cemiterios/configuracoes/defuntos/tipos/create',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.defuntosTipos.id}
        actionType={actionTypes.AuthAdd}
      >
        <DefuntosTiposCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Tipo de Defunto',
  },
  {
    path: 'cemiterios/configuracoes/defuntos/tipos/update',
    element: (
      <LicenseGuard
        requiredModule={cemiterios.id}
        requiredPermission={cemiterios.permissions.defuntosTipos.id}
        actionType={actionTypes.AuthChg}
      >
        <DefuntosTiposUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Tipo de Defunto',
  },
]
