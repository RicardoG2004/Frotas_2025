import { actionTypes } from '@/config/modules'
import { utilitarios } from '@/config/modules/base/utilitarios-module'
import { CodigosPostaisPage } from '@/pages/base/codigospostais/codigospostais-page'
import { CodigosPostaisCreatePage } from '@/pages/base/codigospostais/components/codigospostais-create-page/codigospostais-create-page'
import { CodigosPostaisUpdatePage } from '@/pages/base/codigospostais/components/codigospostais-update-page/codigospostais-update-page'
import { ConcelhosCreatePage } from '@/pages/base/concelhos/components/concelhos-create-page/concelhos-create-page'
import { ConcelhosUpdatePage } from '@/pages/base/concelhos/components/concelhos-update-page/concelhos-update-page'
import { ConcelhosPage } from '@/pages/base/concelhos/concelhos-page'
import { DistritosCreatePage } from '@/pages/base/distritos/components/distritos-create-page/distritos-create-page'
import { DistritosUpdatePage } from '@/pages/base/distritos/components/distritos-update-page/distritos-update-page'
import { DistritosPage } from '@/pages/base/distritos/distritos-page'
import { EntidadesCreatePage } from '@/pages/base/entidades/components/entidades-create-page/entidades-create-page'
import { EntidadesUpdatePage } from '@/pages/base/entidades/components/entidades-update-page/entidades-update-page'
import { EntidadesPage } from '@/pages/base/entidades/entidades-page'
import { EpocasCreatePage } from '@/pages/base/epocas/components/epocas-create-page/epocas-create-page'
import { EpocasUpdatePage } from '@/pages/base/epocas/components/epocas-update-page/epocas-update-page'
import { EpocasPage } from '@/pages/base/epocas/epocas-page'
import { FreguesiasCreatePage } from '@/pages/base/freguesias/components/freguesias-create-page/freguesias-create-page'
import { FreguesiasUpdatePage } from '@/pages/base/freguesias/components/freguesias-update-page/freguesias-update-page'
import { FreguesiasPage } from '@/pages/base/freguesias/freguesias-page'
import { PaisesCreatePage } from '@/pages/base/paises/components/paises-create-page/paises-create-page'
import { PaisesUpdatePage } from '@/pages/base/paises/components/paises-update-page/paises-update-page'
import { PaisesPage } from '@/pages/base/paises/paises-page'
import { RuasCreatePage } from '@/pages/base/ruas/components/ruas-create-page/ruas-create-page'
import { RuasUpdatePage } from '@/pages/base/ruas/components/ruas-update-page/ruas-update-page'
import { RuasPage } from '@/pages/base/ruas/ruas-page'
import { RubricasCreatePage } from '@/pages/base/rubricas/components/rubricas-create-page/rubricas-create-page'
import { RubricasUpdatePage } from '@/pages/base/rubricas/components/rubricas-update-page/rubricas-update-page'
import { RubricasPage } from '@/pages/base/rubricas/rubricas-page'
import { UtilitariosDashboardPage } from '@/pages/base/utilitarios-dashboard'
import { LicenseGuard } from '@/components/auth/license-guard'

export const utilitariosRoutes = [
  {
    path: 'utilitarios',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <UtilitariosDashboardPage />
      </LicenseGuard>
    ),
    manageWindow: false,
    windowName: utilitarios.name,
  },
  {
    path: 'utilitarios/tabelas',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <div></div>
      </LicenseGuard>
    ),
    windowName: 'Tabelas',
  },
  {
    path: 'utilitarios/tabelas/geograficas',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <div></div>
      </LicenseGuard>
    ),
    windowName: 'Geográficas',
  },
  {
    path: 'utilitarios/tabelas/geograficas/paises',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.paises.id}
        actionType={actionTypes.AuthVer}
      >
        <PaisesPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.paises.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/paises/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.paises.id}
        actionType={actionTypes.AuthAdd}
      >
        <PaisesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.paises.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/paises/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.paises.id}
        actionType={actionTypes.AuthChg}
      >
        <PaisesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.paises.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/distritos',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.distritos.id}
        actionType={actionTypes.AuthVer}
      >
        <DistritosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.distritos.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/distritos/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.distritos.id}
        actionType={actionTypes.AuthAdd}
      >
        <DistritosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.distritos.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/distritos/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.distritos.id}
        actionType={actionTypes.AuthChg}
      >
        <DistritosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.distritos.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/concelhos',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.concelhos.id}
        actionType={actionTypes.AuthVer}
      >
        <ConcelhosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.concelhos.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/concelhos/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.concelhos.id}
        actionType={actionTypes.AuthAdd}
      >
        <ConcelhosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.concelhos.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/concelhos/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.concelhos.id}
        actionType={actionTypes.AuthChg}
      >
        <ConcelhosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.concelhos.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/freguesias',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.freguesias.id}
        actionType={actionTypes.AuthVer}
      >
        <FreguesiasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.freguesias.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/freguesias/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.freguesias.id}
        actionType={actionTypes.AuthAdd}
      >
        <FreguesiasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.freguesias.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/freguesias/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.freguesias.id}
        actionType={actionTypes.AuthChg}
      >
        <FreguesiasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.freguesias.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/ruas',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.ruas.id}
        actionType={actionTypes.AuthVer}
      >
        <RuasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.ruas.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/ruas/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.ruas.id}
        actionType={actionTypes.AuthAdd}
      >
        <RuasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.ruas.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/ruas/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.ruas.id}
        actionType={actionTypes.AuthChg}
      >
        <RuasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.ruas.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/codigospostais',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.codigospostais.id}
        actionType={actionTypes.AuthVer}
      >
        <CodigosPostaisPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.codigospostais.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/codigospostais/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.codigospostais.id}
        actionType={actionTypes.AuthAdd}
      >
        <CodigosPostaisCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.codigospostais.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/codigospostais/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.codigospostais.id}
        actionType={actionTypes.AuthChg}
      >
        <CodigosPostaisUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.codigospostais.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/epocas',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.epocas.id}
        actionType={actionTypes.AuthVer}
      >
        <EpocasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.epocas.name,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/epocas/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.epocas.id}
        actionType={actionTypes.AuthAdd}
      >
        <EpocasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.epocas.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/epocas/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.epocas.id}
        actionType='AuthChg'
      >
        <EpocasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.epocas.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/rubricas',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.rubricas.id}
        actionType={actionTypes.AuthVer}
      >
        <RubricasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.rubricas.name,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/rubricas/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.rubricas.id}
        actionType={actionTypes.AuthAdd}
      >
        <RubricasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.rubricas.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/rubricas/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.rubricas.id}
        actionType='AuthChg'
      >
        <RubricasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.rubricas.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/entidades',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.entidades.id}
        actionType={actionTypes.AuthVer}
      >
        <EntidadesPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.entidades.name,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/entidades/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.entidades.id}
        actionType={actionTypes.AuthAdd}
      >
        <EntidadesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.entidades.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/entidades/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.entidades.id}
        actionType='AuthChg'
      >
        <EntidadesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.entidades.name}`,
  },
]
