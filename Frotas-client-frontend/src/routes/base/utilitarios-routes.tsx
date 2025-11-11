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
import { TaxasIvaPage } from '@/pages/base/taxasIva/taxasIva-page'
import { TaxasIvaCreatePage } from '@/pages/base/taxasIva/components/taxasIva-create-page/taxasIva-create-page'
import { TaxasIvaUpdatePage } from '@/pages/base/taxasIva/components/taxasIva-update-page/taxasIva-update-page'
import { SetoresPage, SetoresCreatePage, SetoresUpdatePage } from '@/pages/base/setores'
import { TerceirosPage, TerceirosCreatePage, TerceirosUpdatePage } from '@/pages/base/terceiros'
import { ConservatoriasPage } from '@/pages/base/conservatorias/conservatorias-page'
import { ConservatoriasCreatePage } from '@/pages/base/conservatorias/components/conservatorias-create-page/conservatorias-create-page'
import { ConservatoriasUpdatePage } from '@/pages/base/conservatorias/components/conservatorias-update-page/conservatorias-update-page'
import { DelegacoesPage } from '@/pages/base/delegacoes/delegacoes-page'
import { DelegacoesCreatePage } from '@/pages/base/delegacoes/components/delegacoes-create-page/delegacoes-create-page'
import { DelegacoesUpdatePage } from '@/pages/base/delegacoes/components/delegacoes-update-page/delegacoes-update-page'
import { CoresPage } from '@/pages/base/cores/cores-page'
import { CoresCreatePage } from '@/pages/base/cores/components/cores-create-page/cores-create-page'
import { CoresUpdatePage } from '@/pages/base/cores/components/cores-update-page/cores-update-page'
import { LocalizacoesPage } from '@/pages/base/localizacoes/localizacoes-page'
import { LocalizacoesCreatePage } from '@/pages/base/localizacoes/components/localizacoes-create-page/localizacoes-create-page'
import { LocalizacoesUpdatePage } from '@/pages/base/localizacoes/components/localizacoes-update-page/localizacoes-update-page'
import {
  GarantiasPage,
  GarantiasCreatePage,
  GarantiasUpdatePage,
} from '@/pages/base/garantias'
import {
  FornecedoresPage,
  FornecedoresCreatePage,
  FornecedoresUpdatePage,
} from '@/pages/base/fornecedores'


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
    path: 'utilitarios/tabelas/geograficas/localizacoes',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        actionType={actionTypes.AuthVer}
      >
        <LocalizacoesPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.localizacoes.name,
  },
  {
    path: 'utilitarios/tabelas/geograficas/localizacoes/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        actionType={actionTypes.AuthAdd}
      >
        <LocalizacoesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.localizacoes.name}`,
  },
  {
    path: 'utilitarios/tabelas/geograficas/localizacoes/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        actionType={actionTypes.AuthChg}
      >
        <LocalizacoesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.localizacoes.name}`,
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
  {
    path: 'utilitarios/tabelas/configuracoes/conservatorias',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <ConservatoriasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Conservatorias',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/conservatorias/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <ConservatoriasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Conservatória',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/conservatorias/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType='AuthChg'
      >
        <ConservatoriasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Conservatória',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/delegacoes',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <DelegacoesPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Delegacoes',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/delegacoes/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <DelegacoesCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Delegacao',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/delegacoes/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType='AuthChg'
      >
        <DelegacoesUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Delegacao',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/cores',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <CoresPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Cores',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/cores/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <CoresCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Cor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/cores/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType='AuthChg'
      >
        <CoresUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Cor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/garantias',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <GarantiasPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.garantias.name,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/garantias/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <GarantiasCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.garantias.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/garantias/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthChg}
      >
        <GarantiasUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.garantias.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/fornecedores',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <FornecedoresPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Fornecedores',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/fornecedores/create',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <FornecedoresCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Fornecedor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/fornecedores/update',
    element: (
      <LicenseGuard requiredModule={utilitarios.id}>
        <FornecedoresUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Fornecedor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/taxas-iva',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.taxasIva.id}
        actionType={actionTypes.AuthVer}
      >
        <TaxasIvaPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: utilitarios.permissions.taxasIva.name,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/taxas-iva/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.taxasIva.id}
        actionType={actionTypes.AuthAdd}
      >
        <TaxasIvaCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Criar ${utilitarios.permissions.taxasIva.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/taxas-iva/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={utilitarios.permissions.taxasIva.id}
        actionType='AuthChg'
      >
        <TaxasIvaUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: `Atualizar ${utilitarios.permissions.taxasIva.name}`,
  },
  {
    path: 'utilitarios/tabelas/configuracoes/setores',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <SetoresPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Setores',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/setores/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <SetoresCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Setor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/setores/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType='AuthChg'
      >
        <SetoresUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Setor',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/terceiros',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthVer}
      >
        <TerceirosPage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Outros Devedores/Credores',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/terceiros/create',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType={actionTypes.AuthAdd}
      >
        <TerceirosCreatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Criar Outros Devedores/Credores',
  },
  {
    path: 'utilitarios/tabelas/configuracoes/terceiros/update',
    element: (
      <LicenseGuard
        requiredModule={utilitarios.id}
        requiredPermission={''}
        actionType='AuthChg'
      >
        <TerceirosUpdatePage />
      </LicenseGuard>
    ),
    manageWindow: true,
    windowName: 'Atualizar Outros Devedores/Credores',
  },
]
