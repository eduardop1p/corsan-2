/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';

import { useState } from 'react';
import { BiSolidDollarCircle } from 'react-icons/bi';
import { IoIosCloseCircle } from 'react-icons/io';

import { twMerge } from 'tailwind-merge';

import getIP from '@/functions/getIP';
import PixProtocol from '@/interfaces/pixProtocol';
import TransactionPixProtocol from '@/interfaces/transactionPixProtocol';
import TransactionPixProtocol2 from '@/interfaces/transactionPixProtocol2';
import TransactionPixProtocol4 from '@/interfaces/transactionPixProtocol4';
import TransactionPixProtocol6 from '@/interfaces/transactionPixProtocol6';
import formatPrice from '@/services/formatPrice';
import validationCPF from '@/services/validationCPF';
import { useLoadingApplicationContext } from '@/utils/loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '@/utils/toastSweetalert2Context/useContext';

import QRCodePix from './QRCode';
import QRCodePixInstallments from './QRCodeInstallments';
import QRCodePixStatic from './QRCodeStatic';

interface Props extends PixProtocol {
  className?: string;
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
  customer: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}

export default function Invoices({
  className,
  debitos,
  customer,
  pixKey,
  pixName,
}: Props) {
  const [qrcode, setQRCode] = useState('');
  const [QRCodeStatic, setQRCodeStatic] = useState({ show: false, value: 0 });
  const [currentInvoice, setCurrentInvoice] = useState({
    name: customer.name,
    total: debitos.reduce((p, c) => p + c.valorFatura, 0),
    maturity: new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
  });
  const [QRCodeInstallments, setQRCodeInstallments] = useState({
    value: 0,
    show: false,
  });

  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();

  const handleFormateDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { dateStyle: 'short' });
  };

  const handlePaymentGateway = async (amount: number, maturity: string) => {
    if (isLoading) return;
    setCurrentInvoice({
      name: customer.name,
      maturity,
      total: amount,
    });
    if (amount > 700) {
      setQRCodeInstallments({ value: amount, show: true });
      return;
    }
    amount = Math.round(amount * 100);
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol = {
        currency: 'BRL',
        paymentMethod: 'PIX',
        amount: amount,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: {
            number: customer.document.replace(/\D/g, ''),
            type: validationCPF(customer.document) ? 'cpf' : 'cnpj',
          },
          address: {
            street: 'Rua 13 de maio',
            streetNumber: '465',
            complement: '',
            zipCode: '76629971',
            neighborhood: 'bairro',
            city: 'Colinas',
            state: 'GO',
            country: 'BR',
          },
        },
        shipping: {
          fee: 0,
          address: {
            street: 'Rua 20 de maio',
            streetNumber: '465',
            complement: '',
            zipCode: '76629971',
            neighborhood: 'bairro',
            city: 'Colinas',
            state: 'GO',
            country: 'BR',
          },
        },
        items: [
          {
            quantity: 1,
            tangible: true,
            title: 'Produto digital',
            unitPrice: amount,
          },
        ],
        pix: { expiresInDays: 1 },
        postbackUrl: 'https://meusite.com/postback',
      };
      const res = await fetch('/api/create-transaction-pix', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({
          icon: 'error',
          message: data.error.message,
          description: '',
        });
        return;
      }

      const qrcode = data.qrcode;
      setQRCode(qrcode);
      setIsLoading(false);
    } catch (err) {
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
        description: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentVelana = async (amount: number) => {
    if (isLoading) return;

    amount = Math.round(amount * 100);
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol4 = {
        paymentMethod: 'pix',
        amount: amount,
        customer: {
          name: customer.name,
          email: customer.email,
          document: {
            number: customer.document.replace(/\D/g, ''),
            type: validationCPF(customer.document) ? 'cpf' : 'cnpj',
          },
          phone: customer.document,
        },
        items: [
          {
            quantity: 1,
            tangible: true,
            title: 'Produto digital',
            unitPrice: amount,
          },
        ],
        pix: { expiresInDays: 1 },
      };
      const res = await fetch('/api/create-transaction-pix4', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({
          icon: 'error',
          message: data.error.message,
          description: '',
        });
        return;
      }
      const qrcode = data.qrcode;
      setQRCode(qrcode);
    } catch (err) {
      console.log(err);
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
        description: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentGatewayAura = async (amount: number, maturity: string) => {
    if (isLoading) return;
    setCurrentInvoice({
      name: customer.name,
      total: amount,
      maturity,
    });

    amount = Math.round(amount * 100);
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol2 = {
        amount,
        externalRef: '',
        postbackUrl: '',
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: {
            type: 'cpf',
            number: validationCPF(customer.document)
              ? customer.document
              : '59789145080',
          },
        },
        traceable: false,
        metadata: '{"provider":"Checkout Transparent"}',
        items: [
          {
            title: 'Produto Digital',
            unitPrice: amount,
            quantity: 1,
            tangible: false,
            externalRef: '',
            product_image: '',
          },
        ],
        paymentMethod: 'pix',
        installments: '1',
      };
      const res = await fetch('/api/create-transaction-pix2', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({
          icon: 'error',
          message: data.error.message,
          description: '',
        });
        return;
      }
      const qrcode = data.qrcode;
      setQRCode(qrcode);
    } catch (err) {
      console.log(err);
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
        description: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentPixBolt = async (amount: number, maturity: string) => {
    if (isLoading) return;
    setCurrentInvoice({
      name: customer.name,
      maturity,
      total: amount,
    });

    if (amount > 700) {
      setQRCodeInstallments({ value: amount, show: true });
      return;
    }
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol6 = {
        payment_method: 'pix',
        amount: amount,
        customer: {
          name: customer.name,
          email: customer.email,
          document: customer.document.replace(/\D/g, ''),
          phone: customer.phone,
        },
        description: 'Produto digital',
        metadata: {
          order_id: crypto.randomUUID(),
          product_id: crypto.randomUUID(),
        },
        postbackUrl: 'https://google.com',
      };
      const res = await fetch('/api/create-transaction-pix6', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({
          icon: 'error',
          message: data.error.message,
          description: '',
        });
        return;
      }
      const qrcode = data.qrcode;
      setQRCode(qrcode);
    } catch (err) {
      console.log(err);
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
        description: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentQRCodeStatic = async (
    amount: number,
    maturity: string
  ) => {
    if (isLoading) return;
    setCurrentInvoice({
      name: customer.name,
      maturity,
      total: amount,
    });

    setQRCodeStatic({ show: true, value: amount });
  };

  const handleCloseQRCode = () => {
    setQRCode('');
  };

  return (
    <>
      {debitos.length ? (
        <div
          className={twMerge(
            `${debitos.length > 1 ? 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]' : 'grid-cols-[repeat(auto-fit,minmax(280px,400px))]'} grid w-full gap-6`,
            className
          )}
        >
          {debitos.map((item, i) => (
            <div
              key={i}
              className={`w-full flex flex-col overflow-hidden rounded-[20px]`}
            >
              <div
                className={`${item.statusFatura.toLowerCase() === 'atrasada' ? 'bg-ff5c60 text-white' : 'bg-yellow-400 text-0027bd'} w-full h-[55px] p-4 text-base font-medium`}
              >
                {item.referencia}
              </div>
              <div className='w-full bg-f0f2f9 flex flex-col p-4'>
                <Image
                  src='/assets/imgs/invoice.png'
                  alt='invoice'
                  width={35}
                  height={35}
                  className='flex-none mb-3'
                />
                <div className='flex items-center gap-3 mb-1'>
                  {item.statusFatura.toLowerCase() === 'atrasada' ? (
                    <IoIosCloseCircle fill='#ff5c60' size={24} />
                  ) : (
                    <BiSolidDollarCircle
                      size={24}
                      className='!fill-yellow-400'
                    />
                  )}
                  <span className='text-0027bd text-base uppercase font-bold'>
                    {item.statusFatura}
                  </span>
                </div>
                <span className='text-0027bd text-[28px] mb-1'>
                  {formatPrice(item.valorFatura)}
                </span>
                <p className='text-495057 text-sm'>
                  Consumo: <span className='font-bold'>{item.consumo} m3</span>
                </p>
                <p className='text-495057 text-sm mb-3'>
                  Vencimento:{' '}
                  <span className='font-bold'>
                    {handleFormateDate(item.dataVencimento)}
                  </span>
                </p>
                <button
                  type='button'
                  className='flex items-center justify-center gap-3 h-10 text-white rounded-[24px] bg-0027db'
                  onClick={() =>
                    handlePaymentGatewayAura(
                      item.valorFatura,
                      handleFormateDate(item.dataVencimento)
                    )
                  }
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={22}
                    height={22}
                    viewBox='0 0 25 24'
                    fill='none'
                  >
                    <mask
                      id='a'
                      style={{
                        maskType: 'alpha',
                      }}
                      maskUnits='userSpaceOnUse'
                      x={0}
                      y={0}
                      width={25}
                      height={24}
                    >
                      <path
                        fill='#D9D9D9'
                        d='M0.388672 0H24.388672V24H0.388672z'
                      />
                    </mask>
                    <g mask='url(#a)'>
                      <path
                        d='M11.766 13.745a.68.68 0 01.944 0l3.614 3.618a3.503 3.503 0 002.492 1.034h.709l-4.558 4.563a3.713 3.713 0 01-5.153 0l-4.577-4.577h.437c.938 0 1.826-.366 2.492-1.034l3.6-3.604zm.944-3.458c-.3.258-.686.263-.944 0l-3.6-3.605c-.666-.71-1.554-1.034-2.492-1.034h-.437L9.81 1.07a3.645 3.645 0 015.158 0l4.562 4.564h-.713c-.939 0-1.826.367-2.492 1.034l-3.614 3.619zM5.674 6.706c.647 0 1.244.263 1.741.723l3.6 3.605c.338.296.78.507 1.225.507.441 0 .883-.211 1.22-.507l3.615-3.619a2.493 2.493 0 011.741-.719h1.77l2.736 2.74a3.653 3.653 0 010 5.16l-2.736 2.74h-1.77a2.477 2.477 0 01-1.741-.724l-3.614-3.619c-.653-.653-1.793-.653-2.446.005l-3.6 3.6c-.497.46-1.094.723-1.741.723H4.18l-2.723-2.725a3.65 3.65 0 010-5.16l2.723-2.73h1.494z'
                        fill='#FFF'
                      />
                    </g>
                  </svg>{' '}
                  Emitir segunda via
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className='text-[45px] text-111799 font-light'>
          Nenhuma fatura encontrada para esta conta
        </h1>
      )}
      {QRCodeStatic.value && QRCodeStatic.show && (
        <QRCodePixStatic
          client={{
            document: customer.document,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            maturity: currentInvoice.maturity,
            total: QRCodeStatic.value,
          }}
          pixKey={pixKey}
          pixName={pixName}
          setQRCodeStatic={setQRCodeStatic}
          value={QRCodeStatic.value}
        />
      )}
      {qrcode && (
        <QRCodePix
          qrcode={qrcode}
          handleCloseQRCode={handleCloseQRCode}
          currentInvoice={currentInvoice}
        />
      )}
      {QRCodeInstallments.show && QRCodeInstallments.value && (
        <QRCodePixInstallments
          client={{
            document: customer.document,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            maturity: new Date().toLocaleDateString('pt-BR', {
              dateStyle: 'short',
            }),
            total: QRCodeInstallments.value,
          }}
          setQRCodeInstallments={setQRCodeInstallments}
        />
      )}
    </>
  );
}
