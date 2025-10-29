export type SessionVars = {
  'epoca-selected': {
    id: string
    ano: string
    descricao: string
  } | null
  'epoca-predefined': {
    id: string
    ano: string
    descricao: string
  } | null
  'data-trabalho': Date | null
  'cemiterio-selected': {
    id: string
    nome: string
  } | null
  'cemiterio-predefined': {
    id: string
    nome: string
  } | null
  // Add more session variables here as needed
}

export const sessionVars = {
  get: <K extends keyof SessionVars>(key: K): SessionVars[K] => {
    const sessionData = localStorage.getItem('session-vars')
    if (!sessionData) return null as SessionVars[K]

    const parsedData = JSON.parse(sessionData)
    return parsedData[key] as SessionVars[K]
  },

  set: <K extends keyof SessionVars>(key: K, value: SessionVars[K]): void => {
    const sessionData = localStorage.getItem('session-vars')
    const currentData: Partial<SessionVars> = sessionData
      ? JSON.parse(sessionData)
      : {}

    currentData[key] = value
    localStorage.setItem('session-vars', JSON.stringify(currentData))
  },

  remove: <K extends keyof SessionVars>(key: K): void => {
    const sessionData = localStorage.getItem('session-vars')
    if (!sessionData) return

    const currentData: Partial<SessionVars> = JSON.parse(sessionData)
    delete currentData[key]
    localStorage.setItem('session-vars', JSON.stringify(currentData))
  },

  clear: (): void => {
    localStorage.removeItem('session-vars')
  },
}
