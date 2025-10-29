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
            label: 'Cemitérios',
            href: '/cemiterios/configuracoes/cemiterios',
            description: 'Faça a gestão de cemitérios',
            icon: 'IconGrave',
            colors: {
              colorful: 'bg-cyan-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-cyan-300',
              vibrant: 'bg-cyan-600',
              neon: 'bg-cyan-400',
              'neon-cyberpunk':
                'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.cemiterios.id,
          },
          {
            label: 'Zonas',
            href: '/cemiterios/configuracoes/zonas',
            description: 'Faça a gestão de zonas de cemitérios',
            icon: 'tablerMap',
            colors: {
              colorful: 'bg-cyan-600',
              'theme-color': 'bg-primary',
              pastel: 'bg-cyan-400',
              vibrant: 'bg-cyan-700',
              neon: 'bg-blue-400',
              'neon-cyberpunk':
                'bg-cyan-600 shadow-[0_0_25px_rgba(8,145,178,0.7)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.zonas.id,
          },
          {
            label: 'Talhões',
            href: '/cemiterios/configuracoes/talhoes',
            description: 'Faça a gestão de talhões de cemitérios',
            icon: 'tablerFolder',
            colors: {
              colorful: 'bg-cyan-700',
              'theme-color': 'bg-primary',
              pastel: 'bg-cyan-500',
              vibrant: 'bg-cyan-800',
              neon: 'bg-purple-400',
              'neon-cyberpunk':
                'bg-cyan-700 shadow-[0_0_30px_rgba(14,116,144,0.8)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.talhoes.id,
          },
          {
            label: 'Sepulturas',
            href: '/cemiterios/configuracoes/sepulturas',
            description: 'Faça a gestão de sepulturas de cemitérios',
            icon: 'IconGrave',
            colors: {
              colorful: 'bg-emerald-400',
              'theme-color': 'bg-primary',
              pastel: 'bg-emerald-200',
              vibrant: 'bg-emerald-500',
              neon: 'bg-green-400',
              'neon-cyberpunk':
                'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.sepulturas.id,
          },
          {
            label: 'Tipos de Sepultura',
            href: '/cemiterios/configuracoes/sepulturas/tipos',
            description: 'Faça a gestão de tipos de sepultura da época',
            icon: 'list',
            colors: {
              colorful: 'bg-emerald-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-emerald-300',
              vibrant: 'bg-emerald-600',
              neon: 'bg-lime-400',
              'neon-cyberpunk':
                'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.7)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.sepulturasTipos.id,
          },
          {
            label: 'Proprietários',
            href: '/cemiterios/configuracoes/proprietarios',
            description: 'Faça a gestão de proprietários de sepultura',
            icon: 'user',
            colors: {
              colorful: 'bg-emerald-600',
              'theme-color': 'bg-primary',
              pastel: 'bg-emerald-400',
              vibrant: 'bg-emerald-700',
              neon: 'bg-pink-400',
              'neon-cyberpunk':
                'bg-emerald-600 shadow-[0_0_30px_rgba(5,150,105,0.8)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.proprietarios.id,
          },
          {
            label: 'Defuntos',
            href: '/cemiterios/configuracoes/defuntos',
            description: 'Faça a gestão de defuntos de cemitérios',
            icon: 'IconGrave',
            colors: {
              colorful: 'bg-orange-400',
              'theme-color': 'bg-primary',
              pastel: 'bg-orange-200',
              vibrant: 'bg-orange-500',
              neon: 'bg-orange-400',
              'neon-cyberpunk':
                'bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.defuntos.id,
          },
          {
            label: 'Tipos de Defunto',
            href: '/cemiterios/configuracoes/defuntos/tipos',
            description: 'Faça a gestão de tipos de defunto',
            icon: 'list',
            colors: {
              colorful: 'bg-orange-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-orange-300',
              vibrant: 'bg-orange-600',
              neon: 'bg-yellow-400',
              'neon-cyberpunk':
                'bg-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.7)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.defuntosTipos.id,
          },
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
            label: 'Criar/Editar Mapa',
            href: '/cemiterios/configuracoes/mapa',
            description: 'Faça a gestão de mapas de cemitérios',
            icon: 'tablerMap',
            colors: {
              colorful: 'bg-pink-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-pink-300',
              vibrant: 'bg-pink-600',
              neon: 'bg-rose-400',
              'neon-cyberpunk':
                'bg-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.7)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.mapas.id,
          },
          {
            label: 'Ver Mapa',
            href: '/cemiterios/configuracoes/mapa/view',
            description: 'Consulte mapas de cemitérios',
            icon: 'tablerMap',
            colors: {
              colorful: 'bg-pink-600',
              'theme-color': 'bg-primary',
              pastel: 'bg-pink-400',
              vibrant: 'bg-pink-700',
              neon: 'bg-pink-400',
              'neon-cyberpunk':
                'bg-pink-600 shadow-[0_0_30px_rgba(219,39,119,0.8)]',
            },
            funcionalidadeId: modules.cemiterios.permissions.mapas.id,
          },
        ],
      },
      {
        label: 'Outros',
        href: '/cemiterios/outros',
        icon: '',
        funcionalidadeId: '',
        items: [
          {
            label: 'Tipos de Sepultura',
            href: '/cemiterios/outros/tipos-descricoes',
            description: 'Faça a gestão de tipos de sepultura geral',
            icon: 'list',
            colors: {
              colorful: 'bg-rose-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-rose-300',
              vibrant: 'bg-rose-600',
              neon: 'bg-indigo-400',
              'neon-cyberpunk':
                'bg-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.7)]',
            },
            funcionalidadeId:
              modules.cemiterios.permissions.sepulturasTiposDescricoes.id,
          },
        ],
      },
    ],
  },
  guest: {},
} as const
