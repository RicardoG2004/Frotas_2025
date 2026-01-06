import { GSResponseToken } from '@/types/api/responses'
import { UpdateInfo } from '@/types/dtos'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { debugStorage } from '@/utils/debug-storage'
import { secureStorage } from '@/utils/secure-storage'

export interface AuthState {
  token: string
  refreshToken: string
  refreshTokenExpiryTime: string
  email: string
  name: string
  userId: string
  roleId: string
  clienteId: string
  licencaId: string
  permissions: Record<string, number>
  isLoaded: boolean
  isAuthenticated: boolean
  updateInfo: UpdateInfo | null
}

interface AuthActions {
  setToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setRefreshTokenExpiryTime: (time: string) => void
  setUser: (email: string) => void
  setUpdateInfo: (updateInfo: UpdateInfo | null) => void
  decodeToken: () => void
  clearAuth: () => void
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  email: '',
  name: '',
  userId: '',
  roleId: '',
  clienteId: '',
  licencaId: '',
  permissions: {},
  isLoaded: false,
  isAuthenticated: false,
  updateInfo: null,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => {
        // During initial login, we trust the token from the server
        set({ token, isAuthenticated: !!token, isLoaded: true })
        get().decodeToken()
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },

      setRefreshTokenExpiryTime: (refreshTokenExpiryTime: string) => {
        set({ refreshTokenExpiryTime })
      },

      setUser: (email: string) => {
        set({ email })
      },

      setUpdateInfo: (updateInfo: UpdateInfo | null) => {
        set({ updateInfo })
      },

      decodeToken: () => {
        const { token } = get()
        if (!token) {
          console.warn('No token available to decode')
          return
        }

        try {
          const decoded: GSResponseToken = jwtDecode(token)
          if (!secureStorage.verify(token)) {
            get().clearAuth()
            return
          }
          set({
            name: decoded.name,
            userId: decoded.uid,
            roleId: decoded.roles.toLowerCase(),
            isLoaded: true,
          })
        } catch (err) {
          console.error('Failed to decode JWT:', err)
          get().clearAuth()
        }
      },

      clearAuth: () => {
        set((_state: AuthState) => {
          const cleanState = { ...initialState, isLoaded: true }
          return cleanState as AuthState
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const secureValue = secureStorage.get(name)
          debugStorage.set(name, secureValue)
          return secureValue
        },
        setItem: (name, value) => {
          debugStorage.set(name, value)
          return secureStorage.set(name, value)
        },
        removeItem: (name) => {
          debugStorage.remove(name)
          localStorage.removeItem(name)
        },
      },
    }
  )
)
