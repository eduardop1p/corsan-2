/* eslint-disable @typescript-eslint/no-unused-vars */
export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
import puppeteerConfig from '@/config/puppeteerConfig';
import createUser from '@/db/actions/user/createUser';
import capsolver from '@/functions/capsolver';
import UserProtocol from '@/interfaces/userProtocol';
import delay from '@/services/delay';
import validationCNPJ from '@/services/validationCNPJ';
import validationCPF from '@/services/validationCPF';

interface BodyParams {
  idDocument?: string;
  registration?: string;
}

export async function POST(req: NextRequest) {
  const headers = await nextHeaders();
  const realUserAgent = userAgentNext({ headers }).ua;
  const { page, browser } = await puppeteerConfig({ userAgent: realUserAgent });

  try {
    const authorization = req.headers.get('authorization') ?? '';
    const isAuthorized = await decryptData(authorization);
    // if (!isAuthorized) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: {
    //         message: 'Você não tem esse poder comédia',
    //         description: '',
    //       },
    //     },
    //     { status: 401 }
    //   );
    // }

    const body: BodyParams = await req.json();
    let { idDocument, registration } = body;
    if (!idDocument || !registration) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Parâmetros de requisição inválidos',
            description: '',
          },
        },
        { status: 400 }
      );
    }
    console.warn(body);

    idDocument = idDocument.replace(/[^\d]+/g, '');
    let name = 'Pagamentos Online';
    try {
      const resAuth = await fetch('https://api.deskdata.com.br/auth', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          username: 'mariaribeiro042731@gmail.com',
          password: '04273156aA@',
        }),
      });
      const dataAuth = await resAuth.json();
      const tokenAuth = dataAuth.data.access_token;
      const resData = await fetch('https://api.deskdata.com.br/queries', {
        method: 'post',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify({
          type: validationCPF(idDocument) ? 'persons' : 'companies',
          key_type: validationCPF(idDocument) ? 'cpf' : 'cnpj',
          key_value: idDocument,
          datasets: validationCPF(idDocument) ? ['basic'] : ['addresses'],
        }),
      });
      const data = await resData.json();
      // console.log(data.data.addresses.items[0]);
      name = data.data.basic.name.full_name;
    } catch (err) {
      console.log(err);
    }

    await page.goto('https://cliente.corsan.com.br/entrar', {
      waitUntil: 'networkidle2',
    });

    // let data: any = null;
    // page.on('response', async response => {
    //   const url = response.url();
    //   // Filtrar pela URL desejada
    //   try {
    //     if (
    //       url.includes(
    //         'https://api.aegea.com.br/external/agencia-virtual/app/v1/publico/debito-deslogado/debito-totais-deslogado'
    //       )
    //     ) {
    //       data = await response.json(); // ou .json() se for JSON válido
    //     }
    //   } catch (err) {
    //     console.error('Erro ao ler resposta:', err);
    //   }
    // });

    // const idDocumentSelector = 'input[formcontrolname="cpf_cnpj"]';
    // await page.waitForSelector(idDocumentSelector);
    // await page.type(idDocumentSelector, idDocument, { delay: 50 });

    // const registrationSelector = 'input[formcontrolname="matricula"]';
    // await page.waitForSelector(registrationSelector);
    // await page.type(registrationSelector, registration, { delay: 50 });

    // const token = await capsolver();

    // await page.evaluate(token => {
    //   const form = document.querySelector<HTMLFormElement>('form');
    //   const btn = document.querySelector<HTMLButtonElement>('.botao-consulta');
    //   const captcha = document.querySelector<HTMLTextAreaElement>(
    //     '#g-recaptcha-response'
    //   );
    //   if (form && captcha && token && btn) {
    //     btn.removeAttribute('disabled');
    //     captcha.value = token;
    //     btn.click();
    //   }
    // }, token);

    const data = await page.evaluate(
      async (registration, idDocument, realUserAgent) => {
        const res = await fetch(
          `https://api.aegea.com.br/external/agencia-virtual/app/v1/publico/debito-deslogado/debito-totais-deslogado?matricula=${registration}&documento=${idDocument}`,
          {
            method: 'get',
            headers: {
              'User-Agent': realUserAgent,
              'ocp-apim-subscription-key': '4b70bdf7ac3548a7afefb73bf7ce4aa5',
              'x-origin': '08abfac643f658e42b970549ea95063e',
              'x-tenantid': '44981421-f9c5-4c31-9506-f495c439ed9b',
            },
          }
        );
        const data = await res.json();
        return data;
      },
      registration,
      idDocument,
      realUserAgent
    );
    // if (!res.ok) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: {
    //         message: data.error,
    //         description: data.description,
    //       },
    //     },
    //     { status: 400 }
    //   );
    // }

    const newData: Omit<UserProtocol, '_id' | 'createdIn'> = {
      nome: name,
      idDocument,
      matricula: registration,
      debitos: data.content.debitos.map((item: any) => ({
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
    };

    const userId = await createUser(newData);

    return NextResponse.json({
      success: true,
      userId,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Erro ao fazer a consulta',
          description: 'Por favor tente novamente.',
        },
      },
      { status: 400 }
    );
  } finally {
    // await browser.close();
  }
}
