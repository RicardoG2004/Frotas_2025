import { utilitarios } from './base/utilitarios-module'
import { frotas } from './frotas/frotas-module'
import { Modules } from './types'

export const actionTypes = {
  AuthVer: 'AuthVer',
  AuthAdd: 'AuthAdd',
  AuthEdit: 'AuthEdit',
  AuthDel: 'AuthDel',
  AuthChg: 'AuthChg',
} as const

export const modules: Modules = {
  utilitarios,
  frotas,
  // Add other modules here as they are created
}
