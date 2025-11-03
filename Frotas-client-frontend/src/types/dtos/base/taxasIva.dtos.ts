export interface CreateTaxaIvaDTO {
    Descricao: string;
    Valor: number;
    Ativo: boolean;
}

export interface UpdateTaxaIvaDTO {
    Descricao: string;
    Valor: number;
    Ativo: boolean;
}

export interface TaxaIvaDTO {
    id: string;
    descricao: string;
    valor: number;
    ativo: boolean;
    createdOn: Date;
}