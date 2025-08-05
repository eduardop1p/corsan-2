import { Schema, model, models, type Document, Model } from 'mongoose';

import UserProtocol from '@/interfaces/userProtocol';

export interface UserDocumentProtocol
  extends Omit<UserProtocol, '_id'>,
    Document {}

const usersSchema = new Schema<UserDocumentProtocol>({
  idDocument: { type: String, required: true, default: '' },
  nome: { type: String, required: true, default: '' },
  matricula: { type: String, required: true, default: '' },

  debitos: [
    {
      referencia: { type: String, required: false, default: '' },
      dataVencimento: { type: String, required: false, default: '' },
      valorFatura: { type: Number, required: false, default: 0 },
      situacaoPagamento: { type: String, required: false, default: '' },
      codigoTributo: { type: String, required: false, default: '' },
      anoLancamento: { type: Number, required: false, default: 0 },
      numeroAviso: { type: Number, required: false, default: 0 },
      numeroEmissao: { type: Number, required: false, default: 0 },
      zonaLigacao: { type: Number, required: false, default: 0 },
      statusFatura: { type: String, required: false, default: '' },
      consumo: { type: Number, required: false, default: 0 },
    },
  ],
  createdIn: {
    type: Date,
    required: false,
    default: Date.now,
    index: { expires: '24h' },
  },
});

const usersModel: Model<UserDocumentProtocol> =
  models.CorsanUsers2 || model<UserDocumentProtocol>('CorsanUsers2', usersSchema);

export default usersModel;
