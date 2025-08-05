'use server';

import { FilterQuery } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

import connectDb from '../../connect';

interface Props {
  query: FilterQuery<UserDocumentProtocol>;
}

export default async function getUser({ query }: Props) {
  try {
    await connectDb();
    const res = await usersModel.findOne(query).sort({
      createdIn: -1,
    });
    if (!res) throw new Error('Usuário não encontrado');
    const data: UserProtocol = {
      _id: String(res._id),
      nome: res.nome,
      idDocument: res.idDocument,
      matricula: res.matricula,

      debitos: res.debitos.map(item => ({
        _id: String(item._id),
        referencia: item.referencia,
        dataVencimento: item.dataVencimento,
        valorFatura: item.valorFatura,
        situacaoPagamento: item.situacaoPagamento,
        codigoTributo: item.codigoTributo,
        anoLancamento: item.anoLancamento,
        numeroAviso: item.numeroAviso,
        numeroEmissao: item.numeroEmissao,
        zonaLigacao: item.zonaLigacao,
        statusFatura: item.statusFatura,
        consumo: item.consumo,
      })),
      createdIn: res.createdIn,
    };
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
