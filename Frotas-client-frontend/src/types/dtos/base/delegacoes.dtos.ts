import { CodigoPostalDTO } from "./codigospostais.dtos";
import { PaisDTO } from "./paises.dtos";

export interface CreateDelegacaoDTO {
    Designacao: string;
    Morada: string;
    Localidade: string;
    CodigoPostalId: string;
    PaisId: string;
    Telefone: string;
    Email: string;
    Fax: string;
    EnderecoHttp: string;
}

export interface UpdateDelegacaoDTO extends Omit<CreateDelegacaoDTO, 'id'> {
    id?: string;
}

export interface DelegacaoDTO {
    id: string;
    designacao: string;
    morada: string;
    localidade: string;
    codigoPostalId: string;
    codigoPostal: CodigoPostalDTO;
    paisId: string;
    pais: PaisDTO;
    telefone: string;
    email: string;
    fax: string;
    enderecoHttp: string;
}