import { CodigoPostalDTO } from "./codigospostais.dtos";
import { FreguesiaDTO } from "./freguesias.dtos";
import { ConcelhoDTO } from "./concelhos.dtos";

export interface CreateConservatoriaDTO {
    Nome: string;
    Morada: string;
    CodigoPostalId: string;
    FreguesiaId: string;
    ConcelhoId: string;
    Telefone: string;
}

export interface UpdateConservatoriaDTO extends Omit<CreateConservatoriaDTO, 'id'> {
    id?: string;
}

export interface ConservatoriaDTO {
    id: string;
    nome: string;
    designacao?: string;
    morada: string;
    codigoPostalId: string;
    codigoPostal: CodigoPostalDTO;
    freguesiaId: string;
    freguesia: FreguesiaDTO;
    concelhoId: string;
    concelho: ConcelhoDTO;
    telefone: string;
}