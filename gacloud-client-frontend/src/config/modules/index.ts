import { utilitarios } from './base/utilitarios-module'
import { canideos } from './canideos/canideos-module'
import { cemiterios } from './cemiterios/cemiterios-module'
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
  cemiterios,
  canideos,
  // Add other modules here as they are created
}
