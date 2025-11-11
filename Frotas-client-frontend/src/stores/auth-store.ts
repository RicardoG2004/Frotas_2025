import { GSResponseToken } from '@/types/api/responses'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import { encryptData, decryptData } from '@/lib/utils/crypto'
import { secureStorage } from '@/utils/secure-storage'

interface AuthState {
  token: string
  refreshToken: string
  expiryTime: string
  email: string
  name: string
  userId: string
  roleId: string
  clientId: string
  licencaId: string
  permissions: Record<string, number>
  modules: string[]
  isLoaded: boolean
  isAuthenticated: boolean
  predefinedCemiterioId: string
  selectedCemiterio: {
    id: string
    nome: string
  } | null
}

interface AuthActions {
  setToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setUser: (email: string) => void
  decodeToken: () => void
  clearAuth: () => void
  setExpiryTime: (expiryTime: string) => void
  setSelectedCemiterio: (cemiterio: { id: string; nome: string } | null) => void
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  expiryTime: '',
  email: '',
  name: '',
  userId: '',
  roleId: '',
  clientId: '',
  licencaId: '',
  permissions: {},
  modules: [],
  isLoaded: false,
  isAuthenticated: false,
  predefinedCemiterioId: '',
  selectedCemiterio: null,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token, isLoaded: true })
        get().decodeToken()
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },

      setUser: (email: string) => {
        set({ email })
      },

      setExpiryTime: (expiryTime: string) => {
        set({ expiryTime })
      },

      decodeToken: () => {
        const { token } = get()
        if (!token) {
          console.warn('No token available to decode')
          return
        }

        try {
          const decoded: GSResponseToken = jwtDecode(token)

          set({
            email: decoded.email || '',
            name: `${decoded.firstName} ${decoded.lastName}`,
            userId: decoded.sub || '',
            roleId: decoded.roles || '',
            clientId: decoded.client_id || '',
            licencaId: decoded.license_id || '',
            isLoaded: true,
          })
        } catch (err) {
          console.error('Failed to decode JWT:', err)
          get().clearAuth()
        }
      },

      clearAuth: () => {
        try {
          // First remove the auth storage
          secureStorage.remove('auth-storage')
          // Then reset the state
          set({ ...initialState, isLoaded: true })
        } catch (error) {
          console.error('Error clearing auth:', error)
          // Ensure state is reset even if storage removal fails
          set({ ...initialState, isLoaded: true })
        }
      },

      setSelectedCemiterio: (cemiterio: { id: string; nome: string } | null) =>
        set({ selectedCemiterio: cemiterio }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name): StorageValue<AuthState & AuthActions> | null => {
          const value = localStorage.getItem(name)
          if (value) {
            const decrypted =
              decryptData<StorageValue<AuthState & AuthActions>>(value)
            return decrypted
          }
          return null
        },
        setItem: (name, value) => {
          const encrypted = encryptData(value)
          localStorage.setItem(name, encrypted)
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)
