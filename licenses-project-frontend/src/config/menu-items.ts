export const roleMenuItems = {
  administrator: [
    {
      title: 'dashboard',
      href: '/',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      title: 'administracao',
      href: '/administracao',
      icon: 'user',
      label: 'Administração',
    },
  ],
  admin: [
    {
      title: 'administracao',
      href: '/administracao',
      icon: 'user',
      label: 'Administração',
    },
  ],
  guest: [],
} as const

export const roleHeaderMenus = {
  administrator: {
    administracao: [
      {
        label: 'Plataforma',
        href: '#',
        icon: '',
        items: [
          {
            label: 'Áreas',
            href: '/administracao/areas',
            description: 'Faca a gestão das áreas da sua empresa',
            icon: 'dashboard',
            secondaryMenu: [
              {
                label: 'Lista de Áreas',
                href: '/administracao/areas',
                icon: 'list',
              },
              {
                label: 'Nova Área',
                href: '/administracao/areas/novo',
                icon: 'add',
              },
              {
                label: 'Configurações',
                href: '/administracao/areas/configuracoes',
                icon: 'settings',
                dropdown: [
                  {
                    label: 'Geral',
                    href: '/administracao/areas/configuracoes/geral',
                    icon: 'settings',
                  },
                  {
                    label: 'Permissões',
                    href: '/administracao/areas/configuracoes/permissoes',
                    icon: 'lock',
                  },
                ],
              },
            ],
          },
          {
            label: 'Aplicações',
            href: '/administracao/aplicacoes',
            description: 'Faça a gestão das aplicações da sua empresa',
            icon: 'application',
            secondaryMenu: [
              {
                label: 'Lista de Aplicações',
                href: '/administracao/aplicacoes',
                icon: 'list',
                dropdown: [
                  {
                    label: 'Todas as Aplicações',
                    href: '/administracao/aplicacoes/todas',
                    icon: 'dashboard',
                  },
                  {
                    label: 'Ativas',
                    href: '/administracao/aplicacoes/ativas',
                    icon: 'check',
                  },
                  {
                    label: 'Inativas',
                    href: '/administracao/aplicacoes/inativas',
                    icon: 'close',
                  },
                ],
              },
              {
                label: 'Nova Aplicação',
                href: '/administracao/aplicacoes/novo',
                icon: 'add',
              },
              {
                label: 'Configurações',
                href: '/administracao/aplicacoes/configuracoes',
                icon: 'settings',
                dropdown: [
                  {
                    label: 'Geral',
                    href: '/administracao/aplicacoes/configuracoes/geral',
                    icon: 'settings',
                  },
                  {
                    label: 'Permissões',
                    href: '/administracao/aplicacoes/configuracoes/permissoes',
                    icon: 'lock',
                  },
                  {
                    label: 'Integrações',
                    href: '/administracao/aplicacoes/configuracoes/integracoes',
                    icon: 'link',
                  },
                ],
              },
            ],
          },
          {
            label: 'Modulos',
            href: '/administracao/modulos',
            description: 'Faça a gestão dos modulos da sua empresa',
            icon: 'application',
          },
          {
            label: 'Funcionalidades',
            href: '/administracao/funcionalidades',
            description: 'Faça a gestão das funcionalidades da sua empresa',
            icon: 'settings',
          },
        ],
      },
      {
        label: 'Clientes',
        href: '#',
        icon: '',
        items: [
          {
            label: 'Clientes',
            href: '/administracao/clientes',
            description: 'Faca a gestão dos clientes da sua empresa',
            icon: 'user',
          },
          {
            label: 'Licenças',
            href: '/administracao/licencas',
            description: 'Faça a gestão das licenças da sua empresa',
            icon: 'lock',
          },
        ],
      },
      {
        label: 'Utilizadores',
        href: '/administracao/utilizadores',
        icon: '',
        description: 'Faça a gestão dos utilizadores da sua empresa',
      },
    ],
  },
  admin: {
    administracao: [
      {
        label: 'Configuração',
        href: '#',
        icon: '',
        items: [
          {
            label: 'Licenças',
            href: '/administracao/licencas/admin',
            description: 'Faca a gestão da sua licença',
            icon: 'lock',
          },
          {
            label: 'Perfis',
            href: '/administracao/perfis/admin',
            description: 'Faca a gestão da sua configuração',
            icon: 'user',
          },
          {
            label: 'Utilizadores',
            href: '/administracao/utilizadores/admin',
            description: 'Faca a gestão dos utilizadores da sua empresa',
            icon: 'profile',
          },
        ],
      },
    ],
  },
  user: {},
  guest: {},
} as const
