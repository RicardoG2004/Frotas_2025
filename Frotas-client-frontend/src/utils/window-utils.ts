import { roleHeaderMenus } from '@/config/menu-items'
import { utilitariosRoutes } from '@/routes/base/utilitarios-routes'
import { frotasRoutes } from '@/routes/frotas/frotas-routes'
import { useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { usePagesStore } from '@/stores/use-pages-store'
import { useWindowsStore, WindowState } from '@/stores/use-windows-store'
import { Icons } from '@/components/ui/icons'

// ============================================================================
// WINDOW IDENTIFICATION
// ============================================================================

/**
 * Hook to get the current window ID based on the location and instance ID.
 * This is useful for components that need to access the current window's page state.
 */
export function useCurrentWindowId() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId')
  const { windows } = useWindowsStore()

  // First try to find a window with the exact path and instanceId
  const currentWindow = instanceId
    ? windows.find(
        (w) => w.path === location.pathname && w.instanceId === instanceId
      )
    : null

  // If no window found with instanceId, try to find one with just the path
  // This is a fallback for backward compatibility
  const fallbackWindow =
    currentWindow || windows.find((w) => w.path === location.pathname)

  return fallbackWindow?.id || ''
}

/**
 * Function to get the current window ID based on the location and instance ID.
 * This is useful for non-component code that needs to access the current window's page state.
 */
export function getCurrentWindowId() {
  const location = window.location
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId')
  const windows = useWindowsStore.getState().windows

  // First try to find a window with the exact path and instanceId
  const currentWindow = instanceId
    ? windows.find(
        (w) => w.path === location.pathname && w.instanceId === instanceId
      )
    : null

  // If no window found with instanceId, try to find one with just the path
  // This is a fallback for backward compatibility
  const fallbackWindow =
    currentWindow || windows.find((w) => w.path === location.pathname)

  return fallbackWindow?.id || ''
}

/**
 * Gets the current window instance ID from the URL.
 */
export function getCurrentInstanceId(): string {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('instanceId') || 'default'
}

/**
 * Gets the current window path and instance ID.
 */
export function getCurrentWindowInfo(): { path: string; instanceId: string } {
  const location = window.location
  const searchParams = new URLSearchParams(location.search)
  return {
    path: location.pathname,
    instanceId: searchParams.get('instanceId') || 'default',
  }
}

// ============================================================================
// ROUTE & WINDOW MANAGEMENT
// ============================================================================

/**
 * Check if a route should manage windows based on the pathname.
 * This is used to determine if a new instance ID should be added to the URL.
 */
export function shouldManageWindow(pathname: string): boolean {
  // Combine all routes
  const allRoutes = [...utilitariosRoutes, ...frotasRoutes]

  // Find the route that matches the pathname
  const route = allRoutes.find((route) => {
    // Remove leading slash for comparison
    const normalizedPathname = pathname.startsWith('/')
      ? pathname.substring(1)
      : pathname
    return route.path === normalizedPathname
  })

  // Return true if the route has manageWindow set to true
  return !!route?.manageWindow
}

/**
 * Handles closing a window and cleaning up associated form state.
 * This is a common operation used in form components.
 */
export function handleWindowClose(
  windowId: string,
  navigate: (path: string) => void,
  removeWindow: (id: string) => void
) {
  // Remove window from windows store
  removeWindow(windowId)

  // Get the current windows state
  const windows = useWindowsStore.getState().windows

  // Find any other open window to navigate to, or go home
  const remainingWindows = windows.filter((w) => w.id !== windowId)
  if (remainingWindows.length > 0) {
    const lastWindow = remainingWindows[remainingWindows.length - 1]
    // Add instanceId to the URL if it exists
    const searchParams = new URLSearchParams()
    if (lastWindow.searchParams) {
      Object.entries(lastWindow.searchParams).forEach(([key, value]) => {
        searchParams.set(key, value)
      })
    }
    searchParams.set('instanceId', lastWindow.instanceId)
    navigate(`${lastWindow.path}?${searchParams.toString()}`)
  } else {
    navigate('/')
  }
}

/**
 * Generates a unique instance ID for window management
 */
export function generateInstanceId(): string {
  return crypto.randomUUID()
}

/**
 * Clears all window, page, and form data from stores and localStorage.
 */
export function clearAllWindowData() {
  // Get all stores
  const windowsStore = useWindowsStore.getState()
  const pagesStore = usePagesStore.getState()
  const formsStore = useFormsStore.getState()

  // Clear windows store
  windowsStore.windows = []
  windowsStore.activeWindow = null
  windowsStore.windowCache = new Map()

  // Clear pages store
  pagesStore.pages = {}

  // Clear forms store
  formsStore.forms = {}

  // Clear localStorage items
  localStorage.removeItem('windows-storage')
  localStorage.removeItem('pages-storage')
  localStorage.removeItem('form-instances-storage')

  // Force Zustand to persist the cleared state
  useWindowsStore.persist.clearStorage()
  usePagesStore.persist.clearStorage()
  useFormsStore.persist.clearStorage()
}

// ============================================================================
// FORM CHANGE DETECTION
// ============================================================================

/**
 * Compares two values for equality handling different data types appropriately.
 */
function compareValues(current: any, reference: any, normalizeEmpty: boolean = false): boolean {
  // Boolean comparison
  if (typeof current === 'boolean') {
    return current !== reference
  }

  // Date comparison
  if (current instanceof Date && reference instanceof Date) {
    return current.getTime() !== reference.getTime()
  }

  // Array comparison
  if (Array.isArray(current) && Array.isArray(reference)) {
    if (current.length !== reference.length) return true

    return current.some((item, index) => {
      const refItem = reference[index]
      if (typeof item === 'object' && typeof refItem === 'object') {
        return JSON.stringify(item) !== JSON.stringify(refItem)
      }
      return item !== refItem
    })
  }

  // String comparison with optional empty normalization
  if (typeof current === 'string') {
    if (normalizeEmpty) {
      return (current || '') !== (reference || '')
    }
    return current !== (reference || '')
  }

  // Number comparison
  if (typeof current === 'number') {
    return current !== (reference || 0)
  }

  // Default strict equality
  return current !== reference
}

/**
 * Detects if form values have changed from their original/default values.
 * For update forms, set normalizeEmpty to true to handle null/undefined vs empty string equivalence.
 */
export function detectFormChanges(
  currentValues: Record<string, any>,
  referenceValues: Record<string, any>,
  normalizeEmpty: boolean = false
): boolean {
  return Object.entries(currentValues).some(([key, value]) => {
    const referenceValue = referenceValues[key]
    return compareValues(value, referenceValue, normalizeEmpty)
  })
}

/**
 * @deprecated Use detectFormChanges with normalizeEmpty=true instead
 */
export function detectUpdateFormChanges(
  currentValues: Record<string, any>,
  originalValues: Record<string, any>
): boolean {
  return detectFormChanges(currentValues, originalValues, true)
}

/**
 * Updates window form data state when form values change.
 * This is used in form components to track if a form has unsaved changes.
 */
export function updateWindowFormData(
  windowId: string,
  hasChanges: boolean,
  setWindowHasFormData: (id: string, hasFormData: boolean) => void
) {
  setWindowHasFormData(windowId, hasChanges)
}

/**
 * Updates window form data state when form values change in create forms.
 * This is used in create form components to track if a form has unsaved changes.
 */
export function updateCreateFormData(
  windowId: string,
  formValues: Record<string, any>,
  setWindowHasFormData: (id: string, hasFormData: boolean) => void,
  defaultValues?: Record<string, any>
) {
  // If no default values provided, use a simple non-empty check
  if (!defaultValues) {
    const hasNonEmptyValues = Object.entries(formValues).some(([, value]) => {
      // For boolean fields, check if they differ from their default value (false)
      if (typeof value === 'boolean') {
        return value !== false // Consider true as having data
      }
      // For other fields, check if they have a non-empty value
      return value !== undefined && value !== '' && value !== null
    })
    setWindowHasFormData(windowId, hasNonEmptyValues)
    return
  }

  // Compare current values with default values to detect actual changes
  const hasChanges = detectFormChanges(formValues, defaultValues)

  setWindowHasFormData(windowId, hasChanges)
}

// ============================================================================
// WINDOW UTILITIES
// ============================================================================

/**
 * Cleans up all forms associated with a window
 */
export function cleanupWindowForms(windowId: string) {
  const formsStore = useFormsStore.getState()

  if (windowId === '*') {
    // If '*' is passed, clear all form instances
    formsStore.clearAllFormData()
    return
  }

  const allFormIds = Object.keys(formsStore.forms)

  allFormIds.forEach((formId) => {
    const formState = formsStore.getFormState(formId)
    if (formState?.windowId === windowId) {
      formsStore.removeFormState(formId)
    }
  })
}

/**
 * Truncates a title to a maximum of 10 characters with ellipsis
 */
export function truncateWindowTitle(title: string): string {
  return title.length > 10 ? `${title.substring(0, 10)}...` : title
}

/**
 * Gets the parent window information for a given window
 */
export function getParentWindowInfo(
  parentWindowId: string,
  windows: WindowState[]
): { title: string; path: string } | null {
  const parentWindow = windows.find((w) => w.id === parentWindowId)
  return parentWindow
    ? {
        title: parentWindow.title,
        path: parentWindow.path,
      }
    : null
}

/**
 * Gets all child windows for a given parent window
 */
export function getChildWindows(
  parentWindowId: string,
  windows: WindowState[]
): WindowState[] {
  return windows.filter((w) => w.parentWindowId === parentWindowId)
}

/**
 * Updates the window title based on a field value.
 * Falls back to a default title if no value is provided.
 */
export function updateWindowTitle(
  windowId: string,
  value: string | undefined,
  defaultTitle: string,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void
) {
  const title = value ? truncateWindowTitle(value) : defaultTitle
  updateWindowState(windowId, { title })
}

/**
 * @deprecated Use updateWindowTitle with defaultTitle='Criar' instead
 */
export function updateCreateWindowTitle(
  windowId: string,
  value: string | undefined,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void
) {
  updateWindowTitle(windowId, value, 'Criar', updateWindowState)
}

/**
 * @deprecated Use updateWindowTitle with defaultTitle='Atualizar' instead
 */
export function updateUpdateWindowTitle(
  windowId: string,
  value: string | undefined,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void
) {
  updateWindowTitle(windowId, value, 'Atualizar', updateWindowState)
}

/**
 * Gets window metadata including icon, color, and title from menu configuration.
 */
export function getWindowMetadata(path: string): {
  icon: keyof typeof Icons | null
  color: string
  title: string
} {
  // Check frotas menu items
  const frotasMenu = roleHeaderMenus.client.frotas?.[0]?.items || []

  for (const item of frotasMenu) {
    if (item.href === path) {
      return {
        icon: item.icon as keyof typeof Icons,
        color: '', // Will be set by theme-based system
        title: item.label,
      }
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosMenu =
    roleHeaderMenus.client.utilitarios?.[0]?.secondaryMenu || []

  for (const section of utilitariosMenu) {
    if (section.dropdown) {
      for (const dropdownItem of section.dropdown) {
        if (dropdownItem.href === path) {
          return {
            icon: dropdownItem.icon as keyof typeof Icons,
            color: '', // Will be set by theme-based system
            title: dropdownItem.label,
          }
        }
      }
    }
  }

  // If no direct match found, try to find parent route for create/update pages
  const pathSegments = path.split('/').filter(Boolean)

  // For create/update pages, look for the parent route
  if (pathSegments.includes('create') || pathSegments.includes('update')) {
    // Remove the last segment (create/update) and try to find the parent
    const parentPathSegments = pathSegments.slice(0, -1)
    const parentPath = '/' + parentPathSegments.join('/')

    // Check frotas menu items for parent
    for (const item of frotasMenu) {
      if (item.href === parentPath) {
        return {
          icon: item.icon as keyof typeof Icons,
          color: '', // Will be set by theme-based system
          title: item.label,
        }
      }
    }

    // Check utilitarios menu items for parent
    for (const section of utilitariosMenu) {
      if (section.dropdown) {
        for (const dropdownItem of section.dropdown) {
          if (dropdownItem.href === parentPath) {
            return {
              icon: dropdownItem.icon as keyof typeof Icons,
              color: '', // Will be set by theme-based system
              title: dropdownItem.label,
            }
          }
        }
      }
    }
  }

  // Default metadata
  return {
    icon: null,
    color: 'bg-gray-500',
    title: 'Window',
  }
}

// ============================================================================
// WINDOW CREATION & NAVIGATION
// ============================================================================

/**
 * Opens a new window for creating an item and sets up communication
 * with the parent window for auto-selection when the item is created.
 */
export function openCreationWindow(
  navigate: (path: string) => void,
  parentWindowId: string,
  route: string,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void,
  findWindowByPathAndInstanceId: (
    path: string,
    instanceId: string
  ) => WindowState | undefined
) {
  const windowId = `create-${Date.now()}`

  // Store the parent window ID in sessionStorage for the new window to access
  sessionStorage.setItem(`parent-window-${windowId}`, parentWindowId)

  // Navigate to the route (this will trigger window manager to create a window)
  navigate(`${route}?instanceId=${windowId}`)

  // Update the window with parent reference after a delay
  setTimeout(() => {
    const createdWindow = findWindowByPathAndInstanceId(route, windowId)

    if (createdWindow) {
      updateWindowState(createdWindow.id, {
        parentWindowId: parentWindowId,
      })
    }
  }, 500)
}

/**
 * Helper function to create custom creation window functions for different entities.
 * This makes it very easy to create specific functions for different entity types.
 */
export function createEntityCreationWindow(route: string) {
  return function openEntityCreationWindow(
    navigate: (path: string) => void,
    parentWindowId: string,
    updateWindowState: (id: string, updates: Partial<WindowState>) => void,
    findWindowByPathAndInstanceId: (
      path: string,
      instanceId: string
    ) => WindowState | undefined
  ) {
    return openCreationWindow(
      navigate,
      parentWindowId,
      route,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }
}

// Pre-defined creation window functions for common entities


// Utilitários - Geografia
export const openPaisCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/paises/create'
)

export const openDistritoCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/distritos/create'
)

export const openConcelhoCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/concelhos/create'
)

export const openFreguesiaCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/freguesias/create'
)

export const openCodigoPostalCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/codigospostais/create'
)

export const openRuaCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/ruas/create'
)

// Frotas - Configurações
export const openMarcaCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/marcas/create'
)

export const openSeguradoraCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/seguradoras/create'
)

export const openModeloCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/modelos/create'
)

export const openTipoViaturaCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/tipo-viaturas/create'
)

export const openCorCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/cores/create'
)

export const openCategoriaCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/categorias/create'
)

export const openLocalizacaoCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/geograficas/localizacoes/create'
)

export const openSetorCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/setores/create'
)

export const openDelegacaoCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/delegacoes/create'
)

export const openConservatoriaCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/conservatorias/create'
)

export const openTerceiroCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/terceiros/create'
)

export const openFornecedorCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/fornecedores/create'
)

export const openSeguroCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/seguros/create'
)

export const openGarantiaCreationWindow = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/garantias/create'
)

export const openEquipamentoCreationWindow = createEntityCreationWindow(
  '/frotas/configuracoes/equipamentos/create'
)

// ============================================================================
// WINDOW VIEW FUNCTIONS
// ============================================================================

/**
 * Opens a window for viewing/editing an existing entity.
 * This is used when you want to open an entity in update mode.
 */
export function openViewWindow(
  navigate: (path: string) => void,
  parentWindowId: string,
  route: string,
  entityId: string,
  entityIdParamName: string,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void,
  findWindowByPathAndInstanceId: (
    path: string,
    instanceId: string
  ) => WindowState | undefined
) {
  const windowId = `view-${Date.now()}`

  // Store the parent window ID in sessionStorage for the new window to access
  sessionStorage.setItem(`parent-window-${windowId}`, parentWindowId)

  // Navigate to the route with the entity ID parameter
  navigate(`${route}?${entityIdParamName}=${entityId}&instanceId=${windowId}`)

  // Update the window with parent reference after a delay
  setTimeout(() => {
    const createdWindow = findWindowByPathAndInstanceId(route, windowId)

    if (createdWindow) {
      updateWindowState(createdWindow.id, {
        parentWindowId: parentWindowId,
      })
    }
  }, 500)
}

/**
 * Helper function to create custom view window functions for different entities.
 * This makes it very easy to create specific functions for viewing different entity types.
 */
export function createEntityViewWindow(
  route: string,
  entityIdParamName: string
) {
  return function openEntityViewWindow(
    navigate: (path: string) => void,
    parentWindowId: string,
    entityId: string,
    updateWindowState: (id: string, updates: Partial<WindowState>) => void,
    findWindowByPathAndInstanceId: (
      path: string,
      instanceId: string
    ) => WindowState | undefined
  ) {
    return openViewWindow(
      navigate,
      parentWindowId,
      route,
      entityId,
      entityIdParamName,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }
}

// Pre-defined view window functions for common entities


// Utilitários - Geografia
export const openPaisViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/paises/update',
  'paisId'
)

export const openDistritoViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/distritos/update',
  'distritoId'
)

export const openConcelhoViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/concelhos/update',
  'concelhoId'
)

export const openFreguesiaViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/freguesias/update',
  'freguesiaId'
)

export const openCodigoPostalViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/codigospostais/update',
  'codigoPostalId'
)

export const openRuaViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/ruas/update',
  'ruaId'
)

// Frotas - Configurações
export const openMarcaViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/marcas/update',
  'marcaId'
)

export const openSeguradoraViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/seguradoras/update',
  'seguradoraId'
)

export const openModeloViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/modelos/update',
  'modeloId'
)

export const openTipoViaturaViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/tipo-viaturas/update',
  'tipoViaturaId'
)

export const openCorViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/cores/update',
  'corId'
)

export const openCategoriaViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/categorias/update',
  'categoriaId'
)

export const openLocalizacaoViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/geograficas/localizacoes/update',
  'localizacaoId'
)

export const openSetorViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/setores/update',
  'setorId'
)

export const openDelegacaoViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/delegacoes/update',
  'delegacaoId'
)

export const openConservatoriaViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/conservatorias/update',
  'conservatoriaId'
)

export const openTerceiroViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/terceiros/update',
  'terceiroId'
)

export const openFornecedorViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/fornecedores/update',
  'fornecedorId'
)

export const openSeguroViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/seguros/update',
  'seguroId'
)

export const openGarantiaViewWindow = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/garantias/update',
  'garantiaId'
)

export const openEquipamentoViewWindow = createEntityViewWindow(
  '/frotas/configuracoes/equipamentos/update',
  'equipamentoId'
)

// ============================================================================
// WINDOW RETURN DATA MANAGEMENT
// ============================================================================

/**
 * Sets entity-specific return data with toast suppression to prevent duplicate toasts.
 * Uses entity-specific sessionStorage keys to prevent conflicts between different entity types.
 */
export function setEntityReturnDataWithToastSuppression(
  windowId: string,
  data: any,
  entityType: string,
  setWindowReturnData: (id: string, data: any) => void,
  parentWindowIdFromStorage?: string,
  instanceId?: string
) {
  // Primary mechanism: set return data for the current window
  setWindowReturnData(windowId, data)

  // Fallback mechanism: set return data with parent window ID from storage
  if (parentWindowIdFromStorage) {
    setWindowReturnData(parentWindowIdFromStorage, data)

    // Store in sessionStorage with entity-specific key for longer persistence
    const sessionKey = `return-data-${parentWindowIdFromStorage}-${entityType.toLowerCase()}`
    sessionStorage.setItem(sessionKey, JSON.stringify(data))

    // Set flag to suppress auto-selection toast to prevent duplicate toasts
    const suppressionKey = `suppress-auto-selection-toast-${parentWindowIdFromStorage}`
    sessionStorage.setItem(suppressionKey, 'true')
  }

  // Clean up sessionStorage after a delay to ensure parent window has time to read it
  if (parentWindowIdFromStorage && instanceId) {
    setTimeout(() => {
      sessionStorage.removeItem(`parent-window-${instanceId}`)
    }, 2000)
  }
}

/**
 * Gets the return data from a child window and clears it.
 */
export function getAndClearWindowReturnData(
  windowId: string,
  getWindowReturnData: (id: string) => any,
  clearWindowReturnData: (id: string) => void
) {
  const data = getWindowReturnData(windowId)
  if (data) {
    clearWindowReturnData(windowId)
  }
  return data
}

/**
 * Checks if there are any child windows with return data for the given parent window.
 */
export function checkForChildWindowReturnData(
  parentWindowId: string,
  findChildWindows: (parentWindowId: string) => WindowState[],
  getWindowReturnData: (id: string) => any
) {
  const childWindows = findChildWindows(parentWindowId)

  for (const childWindow of childWindows) {
    const returnData = getWindowReturnData(childWindow.id)
    if (returnData) {
      return { childWindowId: childWindow.id, returnData }
    }
  }
  return null
}
