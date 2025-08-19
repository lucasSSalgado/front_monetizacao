import { Deflate } from "zlib";

export interface Busca {
  termosInclude: string[][];
  termosExclude?: string[];
  periodo: string[];
  municipio?: number;
  mesorregiao?: number;
  microrregiao?: number;
  cnae?: number;
  ncm?: number;
  gtin?: number;
  partnumber?: string;
  incluirNFe?: boolean;
  incluirNFCe?: boolean;
}

export interface NfeResponse {
    price: number
    description: string
    mesAnoEmissao: number
    diaEmissao: number
    naturezaOperacao: string
    dtEmissao: Deflate
    gtin: string
    municipio: string
    ncm: string
}