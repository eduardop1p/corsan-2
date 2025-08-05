export default interface UserProtocol {
  _id: string;
  idDocument: string;
  nome: string;
  matricula: string;
  debitos: {
    _id: string;
    referencia: string;
    dataVencimento: string;
    valorFatura: number;
    situacaoPagamento: string;
    codigoTributo: string;
    anoLancamento: number;
    numeroAviso: number;
    numeroEmissao: number;
    zonaLigacao: number;
    statusFatura: string;
    consumo: number;
  }[];
  createdIn: Date;
}
