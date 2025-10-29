import { modules } from './modules'

export const roleMenuItems = {
  client: [
    {
      title: 'base',
      href: '/base',
      icon: 'tablerFolder',
      label: 'Base',
      items: [
        {
          title: 'utilitarios',
          href: '/utilitarios',
          icon: 'tablerSettings',
          label: 'Utilitários',
          moduloId: modules.utilitarios.id,
        },
        // {
        //   title: 'teste',
        //   href: '/teste',
        //   icon: 'tablerMap',
        //   label: 'teste',
        // },
      ],
    },
    // {
    //   title: 'canideos',
    //   href: '/canideos',
    //   icon: 'IconCat',
    //   label: 'Canídeos',
    //   items: [
    //     {
    //       title: 'teste2',
    //       href: '/teste2',
    //       icon: 'IconCat',
    //       label: 'teste2',
    //     },
    //   ],
    // },
    {
      title: 'taxas-e-licencas',
      href: '/taxas-e-licencas',
      icon: 'folder',
      label: 'Taxas e Licenças',
      items: [
        {
          title: 'cemiterios',
          href: '/cemiterios',
          icon: 'IconGrave',
          label: 'Cemitérios',
          colors: {
            colorful: 'bg-blue-500',
            'theme-color': 'bg-primary',
            pastel: 'bg-blue-300',
            vibrant: 'bg-blue-600',
            neon: 'bg-cyan-400',
          },
          moduloId: modules.cemiterios.id,
        },
        {
          title: 'canideos',
          href: '/canideos',
          icon: 'IconCat',
          label: 'Canídeos',
          moduloId: modules.canideos.id,
        },
      ],
    },
    // {
    //   title: 'snc-ap',
    //   href: '/snc-ap',
    //   icon: 'IconReportMoney',
    //   label: 'SNC-AP',
    //   items: [
    //     {
    //       title: 'teste2',
    //       href: '/teste2',
    //       icon: 'map',
    //       label: 'teste2',
    //     },
    //   ],
    // },
  ],
  guest: [],
} as const

export const roleHeaderMenus = {
  client: {
    utilitarios: [
      {
        label: 'Tabelas',
        href: '/utilitarios/tabelas/',
        icon: '',
        funcionalidadeId: '',
        secondaryMenu: [
          {
            label: 'Geográficas',
            href: '#',
            icon: '',
            dropdown: [
              {
                label: 'Países',
                href: '/utilitarios/tabelas/geograficas/paises',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-400',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-200',
                  vibrant: 'bg-blue-500',
                  neon: 'bg-cyan-300',
                },
                funcionalidadeId: modules.utilitarios.permissions.paises.id,
              },
              {
                label: 'Distritos',
                href: '/utilitarios/tabelas/geograficas/distritos',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-500',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-300',
                  vibrant: 'bg-blue-600',
                  neon: 'bg-cyan-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.distritos.id,
              },
              {
                label: 'Concelhos',
                href: '/utilitarios/tabelas/geograficas/concelhos',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-600',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-400',
                  vibrant: 'bg-blue-700',
                  neon: 'bg-pink-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.concelhos.id,
              },
              {
                label: 'Freguesias',
                href: '/utilitarios/tabelas/geograficas/freguesias',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-500',
                  vibrant: 'bg-blue-800',
                  neon: 'bg-yellow-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.freguesias.id,
              },
              {
                label: 'Códigos Postais',
                href: '/utilitarios/tabelas/geograficas/codigospostais',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-800',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-600',
                  vibrant: 'bg-blue-900',
                  neon: 'bg-green-400',
                },
                funcionalidadeId:
                  modules.utilitarios.permissions.codigospostais.id,
              },
              {
                label: 'Ruas',
                href: '/utilitarios/tabelas/geograficas/ruas',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-blue-900',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-blue-700',
                  vibrant: 'bg-blue-950',
                  neon: 'bg-purple-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.ruas.id,
              },
            ],
          },
          {
            label: 'Configurações',
            href: '#',
            icon: '',
            dropdown: [
              {
                label: 'Épocas',
                href: '/utilitarios/tabelas/configuracoes/epocas',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-400',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-200',
                  vibrant: 'bg-green-500',
                  neon: 'bg-cyan-300',
                },
                funcionalidadeId: modules.utilitarios.permissions.epocas.id,
              },
              {
                label: 'Rubricas',
                href: '/utilitarios/tabelas/configuracoes/rubricas',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-500',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-300',
                  vibrant: 'bg-green-600',
                  neon: 'bg-cyan-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.rubricas.id,
              },
              {
                label: 'Entidades',
                href: '/utilitarios/tabelas/configuracoes/entidades',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-600',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-400',
                  vibrant: 'bg-green-700',
                  neon: 'bg-pink-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.entidades.id,
              },
              // {
              //   label: 'teste',
              //   href: '/utilitarios/tabelas/configuracoes/teste',
              //   icon: 'tablerMap',
              //   funcionalidadeId: modules.utilitarios.permissions.entidades.id,
              // },
            ],
          },
        ],
      },
    ],
    cemiterios: [
      {
        label: 'Configurações',
        href: '/cemiterios/configuracoes',
        icon: '',
        funcionalidadeId: '',
        items: [
          {
            label: 'Coveiros',
            href: '/cemiterios/configuracoes/coveiros',
            description: 'Faça a gestão de coveiros de cemitérios',
            icon: 'user',
            colors: {
              colorful: 'bg-purple-600',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-400',
              vibrant: 'bg-purple-700',
              neon: 'bg-pink-400',
              'neon-cyberpunk':
                'bg-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.8)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.coveiros.id,
          },
          {
            label: 'Agências Funerárias',
            href: '/cemiterios/configuracoes/agencias-funerarias',
            description: 'Faça a gestão de agências funerárias',
            icon: 'IconBuilding',
            colors: {
              colorful: 'bg-purple-700',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-300',
              vibrant: 'bg-purple-600',
              neon: 'bg-violet-400',
              'neon-cyberpunk':
                'bg-purple-700 shadow-[0_0_35px_rgba(126,34,206,0.9)]',
            },
            funcionalidadeId:
              modules.cemiterios.permissions.agenciasFunerarias.id,
          },
          {
            label: 'Marcas',
            href: '/cemiterios/configuracoes/marcas',
            description: 'Faça a gestão de marcas de carros',
            icon: 'shield',
            colors: {
              colorful: 'bg-purple-700',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-300',
              vibrant: 'bg-purple-600',
              neon: 'bg-violet-400',
              'neon-cyberpunk':
                'bg-purple-700 shadow-[0_0_35px_rgba(126,34,206,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
          },
        ],
      },
    ],
  },
  guest: {},
} as const
