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
          title: 'frotas',
          href: '/frotas',
          icon: 'car',
          label: 'Frotas',
          colors: {
            colorful: 'bg-blue-500',
            'theme-color': 'bg-primary',
            pastel: 'bg-blue-300',
            vibrant: 'bg-blue-600',
            neon: 'bg-cyan-400',
          },
          moduloId: modules.frotas.id,
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
              {
                label: 'Localizações',
                href: '/utilitarios/tabelas/geograficas/localizacoes',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-indigo-500',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-indigo-300',
                  vibrant: 'bg-indigo-600',
                  neon: 'bg-orange-400',
                },
                funcionalidadeId: '',
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
                label: 'Conservatorias',
                href: '/utilitarios/tabelas/configuracoes/conservatorias',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-500',
                  vibrant: 'bg-green-800',
                  neon: 'bg-yellow-400',
                },
                funcionalidadeId: '',
              },
              {
                label: 'Delegacoes',
                href: '/utilitarios/tabelas/configuracoes/delegacoes',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-500',
                  vibrant: 'bg-green-800',
                  neon: 'bg-yellow-400',
                },
                funcionalidadeId: '',
              },
              {
                label: 'Garantias',
                href: '/utilitarios/tabelas/configuracoes/garantias',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-500',
                  vibrant: 'bg-green-800',
                  neon: 'bg-yellow-400',
                },
                funcionalidadeId: '',
              },
              {
                label: 'Entidades',
                href: '/utilitarios/tabelas/configuracoes/entidades',
                icon: 'IconBuilding',
                colors: {
                  colorful: 'bg-indigo-500',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-indigo-200',
                  vibrant: 'bg-indigo-700',
                  neon: 'bg-indigo-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.entidades.id,
              },
              {
                label: 'Fornecedores',
                href: '/utilitarios/tabelas/configuracoes/fornecedores',
                icon: 'briefcase',
                colors: {
                  colorful: 'bg-emerald-500',
                  'theme-color': 'bg-emerald-600',
                  pastel: 'bg-emerald-200',
                  vibrant: 'bg-emerald-700',
                  neon: 'bg-emerald-400',
                  'neon-cyberpunk':
                    'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.9)]',
                },
                funcionalidadeId: modules.utilitarios.permissions.fornecedores.id,
              },

              {
                label: 'Taxas de IVA',
                href: '/utilitarios/tabelas/configuracoes/taxas-iva',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-500',
                  vibrant: 'bg-green-800',
                  neon: 'bg-yellow-400',
                },
                funcionalidadeId: modules.utilitarios.permissions.taxasIva.id,
              },
              {
                label: 'Setores',
                href: '/utilitarios/tabelas/configuracoes/setores',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-800',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-600',
                  vibrant: 'bg-green-900',
                  neon: 'bg-orange-400',
                },
                funcionalidadeId: '',
              },
              {
                label: 'Outros Devedores/Credores',
                href: '/utilitarios/tabelas/configuracoes/terceiros',
                icon: 'tablerMap',
                colors: {
                  colorful: 'bg-green-700',
                  'theme-color': 'bg-primary',
                  pastel: 'bg-green-500',
                  vibrant: 'bg-green-800',
                  neon: 'bg-lime-400',
                },
                funcionalidadeId:
                  modules.utilitarios.permissions.terceiros.id,
              },
            ],
          },
        ],
      },
    ],
    frotas: [
      {
        label: 'Configurações',
        href: '/frotas/configuracoes',
        icon: '',
        funcionalidadeId: '',
        items: [
          {
            label: 'Peças',
            href: '/frotas/configuracoes/pecas',
            description: 'Faça a gestão de peças',
            icon: 'container',
            colors: {
              colorful: 'bg-purple-600',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-400',
              vibrant: 'bg-purple-700',
              neon: 'bg-purple-500',
              'neon-cyberpunk':
                'bg-purple-600 shadow-[0_0_35px_rgba(147,51,234,0.85)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Serviços',
            href: '/frotas/configuracoes/servicos',
            description: 'Faça a gestão de serviços',
            icon: 'settings',
            colors: {
              colorful: 'bg-purple-700',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-500',
              vibrant: 'bg-purple-800',
              neon: 'bg-purple-600',
              'neon-cyberpunk':
                'bg-purple-700 shadow-[0_0_40px_rgba(126,34,206,0.9)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Marcas',
            href: '/frotas/configuracoes/marcas',
            description: 'Faça a gestão de marcas de carros',
            icon: 'shield',
            colors: {
              colorful: 'bg-violet-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-violet-300',
              vibrant: 'bg-violet-600',
              neon: 'bg-violet-400',
              'neon-cyberpunk':
                'bg-violet-500 shadow-[0_0_35px_rgba(139,92,246,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
          },
          {
            label: 'Modelos',
            href: '/frotas/configuracoes/modelos',
            description: 'Faça a gestão de modelos de veículos',
            icon: 'layers',
            colors: {
              colorful: 'bg-indigo-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-indigo-300',
              vibrant: 'bg-indigo-600',
              neon: 'bg-indigo-400',
              'neon-cyberpunk':
                'bg-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
          },
          {
            label: 'Categorias',
            href: '/frotas/configuracoes/categorias',
            description: 'Faça a gestão de categorias de veículos',
            icon: 'truck',
            colors: {
              colorful: 'bg-blue-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-blue-300',
              vibrant: 'bg-blue-600',
              neon: 'bg-blue-400',
              'neon-cyberpunk':
                'bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
          },
          {
            label: 'Tipos de Viatura',
            href: '/frotas/configuracoes/tipo-viaturas',
            description: 'Faça a gestão de tipos de viatura',
            icon: 'car',
            colors: {
              colorful: 'bg-sky-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-sky-300',
              vibrant: 'bg-sky-600',
              neon: 'bg-sky-400',
              'neon-cyberpunk':
                'bg-sky-500 shadow-[0_0_40px_rgba(56,189,248,0.9)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Cores',
            href: '/frotas/configuracoes/cores',
            description: 'Faça a gestão de cores',
            icon: 'droplet',
            colors: {
              colorful: 'bg-emerald-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-emerald-200',
              vibrant: 'bg-emerald-600',
              neon: 'bg-emerald-400',
              'neon-cyberpunk':
                'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.9)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Seguradoras',
            href: '/frotas/configuracoes/seguradoras',
            description: 'Faça a gestão de seguradoras',
            icon: 'shield',
            colors: {
              colorful: 'bg-cyan-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-cyan-300',
              vibrant: 'bg-cyan-600',
              neon: 'bg-cyan-400',
              'neon-cyberpunk':
                'bg-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.9)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Seguros',
            href: '/frotas/configuracoes/seguros',
            description: 'Faça a gestão de seguros',
            icon: 'fileText',
            colors: {
              colorful: 'bg-teal-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-teal-300',
              vibrant: 'bg-teal-600',
              neon: 'bg-teal-400',
              'neon-cyberpunk':
                'bg-teal-500 shadow-[0_0_40px_rgba(45,212,191,0.9)]',
            },
            funcionalidadeId: '',
          },
          {
            label: 'Equipamentos',
            href: '/frotas/configuracoes/equipamentos',
            description: 'Faça a gestão de equipamentos',
            icon: 'wrench',
            colors: {
              colorful: 'bg-emerald-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-emerald-300',
              vibrant: 'bg-emerald-600',
              neon: 'bg-emerald-400',
              'neon-cyberpunk':
                'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
          },
        ],
      },
    ],
  },
  guest: {},
} as const
