'use server';

import { FilterQuery } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

import connectDb from '../../connect';

interface Props {
  query: FilterQuery<UserDocumentProtocol>;
}

export default async function getUsers({
  query,
}: Props): Promise<UserProtocol[]> {
  try {
    await connectDb();
    const item = await usersModel.find(query).sort({
      createdIn: -1,
    });
    const data: UserProtocol[] = item.map(item => ({
      _id: String(item._id),
      nome: item.nome,
      idDocument: item.idDocument,
      matricula: item.matricula,

      debitos: item.debitos.map(_item => ({
        _id: String(_item._id),
        referencia: _item.referencia,
        dataVencimento: _item.dataVencimento,
        valorFatura: _item.valorFatura,
        situacaoPagamento: _item.situacaoPagamento,
        codigoTributo: _item.codigoTributo,
        anoLancamento: _item.anoLancamento,
        numeroAviso: _item.numeroAviso,
        numeroEmissao: _item.numeroEmissao,
        zonaLigacao: _item.zonaLigacao,
        statusFatura: _item.statusFatura,
        consumo: _item.consumo,
      })),
      createdIn: item.createdIn,
    }));
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
