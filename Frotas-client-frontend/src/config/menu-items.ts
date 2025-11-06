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
            label: 'Coveiros',
            href: '/frotas/configuracoes/coveiros',
            description: 'Faça a gestão de coveiros de cemitérios',
            icon: 'user',
            colors: {
              colorful: 'bg-purple-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-purple-300',
              vibrant: 'bg-purple-600',
              neon: 'bg-purple-400',
              'neon-cyberpunk':
                'bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.8)]',
            },
            funcionalidadeId: modules.frotas.permissions.coveiros.id,
          },
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
            label: 'Fornecedores',
            href: '/frotas/configuracoes/fornecedores',
            description: 'Faça a gestão de fornecedores',
            icon: 'IconBuilding',
            colors: {
              colorful: 'bg-amber-500',
              'theme-color': 'bg-primary',
              pastel: 'bg-amber-300',
              vibrant: 'bg-amber-600',
              neon: 'bg-amber-400',
              'neon-cyberpunk':
                'bg-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.9)]',
            },
            funcionalidadeId: '', // Removed permission check temporarily
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
