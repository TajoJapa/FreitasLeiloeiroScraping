export interface LotLog {
  id: string;
  urlLote: string;
  leilaoId?: string;
  loteNumero?: string;
  descricaoCompleta: string;
  dataCaptura: string;
  hashConteudo?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PaginatedLogs {
  data: LotLog[];
  total: number;
  page: number;
  limit: number;
}
