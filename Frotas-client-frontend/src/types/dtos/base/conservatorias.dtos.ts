export interface CreateConservatoriaDTO {
    Nome: string
    Morada: string
    CodigoPostalId: string
    FreguesiaId: string
    ConcelhoId: string
    Telefone: string
}

export interface UpdateConservatoriaDTO {
    Nome: string
    Morada: string
    CodigoPostalId: string
    FreguesiaId: string
    ConcelhoId: string
    Telefone: string
}

export interface ConservatoriaDTO {
    id: string
    nome: string
    morada: string
    codigoPostalId: string
    freguesiaId: string
    concelhoId: string
    telefone: string
    createdOn: Date
}