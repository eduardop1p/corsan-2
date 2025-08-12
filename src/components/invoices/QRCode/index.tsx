'use cliente';

import { FaLock } from 'react-icons/fa6';

import { QRCodeCanvas } from 'qrcode.react';

import formatPrice from '@/services/formatPrice';
import { useToastSweetalert2Context } from '@/utils/toastSweetalert2Context/useContext';

interface Props {
  qrcode: string;
  currentInvoice: {
    name: string;
    total: number;
    maturity: string;
  };
  handleCloseQRCode(): void;
}

export default function QRCodePix({
  qrcode,
  currentInvoice,
  handleCloseQRCode,
}: Props) {
  const { setToast } = useToastSweetalert2Context();

  const handleCopy = async () => {
    try {
      if (qrcode) navigator.clipboard.writeText(qrcode);
      setToast({
        icon: 'success',
        message: 'Código PIX copiado!',
        description: '',
      });
    } catch (err) { } // eslint-disable-line
  };

  return (
    <div
      className='fixed h-screen w-full z-40 bg-0006 flex items-center justify-center inset-0 font-roboto'
      onClick={handleCloseQRCode}
    >
      <div className='w-full max-w-[500px] px-6 relative'>
        <button
          type='button'
          className='self-end p-2 absolute -top-4 right-0 z-10'
          onClick={handleCloseQRCode}
        >
          <svg
            width={33}
            height={33}
            viewBox='0 0 33 33'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x={1}
              y={1.00781}
              width={31}
              height={31}
              rx={15.5}
              fill='#fff'
            />
            <rect
              x={1}
              y={1.00781}
              width={31}
              height={31}
              rx={15.5}
              stroke='#231F20'
              strokeWidth={2}
            />
            <path
              d='M24 10.518l-1.51-1.51-5.99 5.99-5.99-5.99L9 10.518l5.99 5.99L9 22.498l1.51 1.51 5.99-5.99 5.99 5.99 1.51-1.51-5.99-5.99 5.99-5.99z'
              fill='#231F20'
            />
          </svg>
        </button>
        <div
          className='bg-white shadow-card-payment rounded-[4px] overflow-hidden w-full'
          onClick={event => event.stopPropagation()}
        >
          <div className='w-full max-h-[95vh] overflow-x-hidden overflow-y-auto flex flex-col bg-inherit items-center relative'>
            <svg
              viewBox='0 0 500 100'
              xmlns='http://www.w3.org/2000/svg'
              width={100}
              height={50}
              fill='#17E3CB'
              className='ng-star-inserted flex-none'
            >
              <path d='M487.944.006c-9.263-.038-13.501 8.652-13.718 8.955V.255h-4.17v2.751C467.522.91 464.963-.07 462.257.004c-6.196.182-11.374 5.23-11.813 11.596-.499 7.297 5.126 13.398 12.106 13.398 1.731 0 4.261-.382 7.504-3.243v2.709h4.174v-5.107s-3.618-4.867-3.618-4.862c0 0-3.086 6.204-8.06 6.204-4.389 0-7.96-3.678-7.96-8.197 0-4.52 3.571-8.197 7.96-8.197 3.699 0 6.681 3.393 9.676 7.434C476.631 17.674 481.061 25 487.866 25c4.17 0 8.37-2.159 10.614-5.787 0 0 .603-.866.884-1.59h-4.902c-1.499 1.933-4.123 3.069-6.562 3.08h-.032c-3.762 0-6.928-4.171-10.247-8.735.851-1.71 1.978-3.6 3.481-5.033 1.851-1.764 4.066-2.62 6.768-2.62 3.666 0 6.761 2.566 7.68 6.046h-13.82v4.3H500v-2.105C500.004 5.676 494.622.04 487.946.01l-.002-.005zM233.529 30.948c-12.986 0-23.198 10.252-23.198 23.218s10.212 23.219 23.198 23.219c12.989 0 23.201-10.253 23.201-23.219 0-12.966-10.212-23.218-23.201-23.218zm0 38.235c-8.028 0-14.344-6.513-14.344-15.017 0-8.563 6.139-15.016 14.344-15.016 8.03 0 14.345 6.513 14.345 15.017 0 8.563-6.138 15.016-14.345 15.016zM194.628 60.499h9.091c-2.006 9.166-9.74 16.886-21.309 16.886-13.402 0-22.788-10.313-22.788-23.158 0-12.906 9.563-23.279 23.2-23.279 12.338 0 19.127 8.323 20.662 16.826h-8.974c-1.358-4.885-5.43-8.624-11.983-8.624-8.264 0-14.108 6.393-14.108 15.017 0 8.684 5.903 15.016 14.226 15.016 6.199 0 10.389-3.438 11.983-8.684zM386.304 32.034v5.729c-3.188-4.221-8.028-6.815-14.286-6.815-12.397 0-21.901 10.011-21.901 23.218 0 13.208 9.504 23.219 21.96 23.219 6.258 0 11.039-2.594 14.286-6.815v5.73h8.677V32.033h-8.736zm-13.873 37.39c-7.734 0-13.518-6.573-13.518-15.258 0-8.684 5.784-15.257 13.518-15.257 7.792 0 13.637 6.573 13.637 15.258.059 8.684-5.845 15.257-13.637 15.257zM446.28 49.945v26.837h-8.856V51.875c0-7.538-3.777-12.001-9.976-12.001-7.556 0-12.928 5.428-12.928 16.102v20.866h-8.854V32.637h8.677v6.151c3.483-4.945 8.147-7.236 14.404-7.236 10.803-.06 17.533 7.78 17.533 18.393zM343.683 63.273c0 8.986-7.439 14.112-18.183 14.112-10.684 0-17.297-5.428-18.653-14.112h8.736c1.358 4.342 4.369 6.573 10.035 6.573 6.021 0 9.209-2.231 9.209-5.79 0-2.713-1.653-4.341-5.725-5.185l-9.327-1.93c-7.616-1.629-11.985-5.97-11.985-12.363 0-7.72 7.262-13.57 17.887-13.57 11.512 0 16.884 6.453 17.711 13.75h-8.62c-.943-3.618-3.718-6.271-9.268-6.271-5.902 0-8.618 2.472-8.618 5.488 0 2.472 1.476 4.16 5.548 5.005l10.096 2.231c7.083 1.508 11.157 5.73 11.157 12.062zM290.733 59.715l.118-.06c6.14-1.93 9.917-6.694 9.917-12.966 0-7.78-5.904-14.655-16.233-14.655h-19.599V76.24h8.736V61.343h8.324l9.681 14.896h10.095l-11.039-16.524zm-5.845-6.212h-11.157V39.995h11.157c5.136 0 7.439 3.136 7.439 6.754.059 3.8-2.657 6.754-7.439 6.754zM23.198 32.034H126.74c0 5.307-4.25 9.65-9.445 9.65H32.644V66.59h84.651c5.195 0 9.445 4.342 9.445 9.65H23.198V32.033z' />
              <path d='M127.509 90.35V100H23.613C10.567 100 0 89.205 0 75.877v-43.42C0 19.127 10.567 8.332 23.613 8.332h103.896v9.65H23.613c-7.792 0-14.168 6.452-14.168 14.473v43.421c0 8.021 6.376 14.474 14.168 14.474h103.896z' />
            </svg>
            <h2 className='text-sm text-black text-center font-semibold my-1'>
              PIX
            </h2>
            <div className='bg-e7f9f4 py-2 px-4 rounded-[30px] flex items-center gap-1 text-[10px] text-000000de mb-2'>
              <FaLock className='fill-green-500' size={13} />
              Você está em um ambiente de pagamento seguro
            </div>
            <div className='p-3 bg-f6f7f9 flex flex-col w-full'>
              <h2 className='text-base text-black font-semibold mb-1'>
                Resumo da fatura
              </h2>
              <div className='w-full bg-white rounded-2xl p-3 flex flex-col mb-2'>
                {currentInvoice.name.toLowerCase() !== 'pagamentos online' && (
                  <p className='flex items-center justify-between text-black text-base font-bold mb-1'>
                    Titular:{' '}
                    <span className='text-base font-semibold'>
                      {currentInvoice.name}
                    </span>
                  </p>
                )}
                <div className='flex items-center justify-between text-black text-base font-bold mb-1'>
                  Total da fatura:{' '}
                  <span className='text-base font-semibold'>
                    {formatPrice(currentInvoice.total)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-black text-base font-bold'>
                  Vencimento:{' '}
                  <span className='text-base font-semibold'>
                    {currentInvoice.maturity}
                  </span>
                </div>
              </div>
              <div className='self-center flex-none mb-2'>
                <QRCodeCanvas value={qrcode} size={200} />
              </div>
              <button
                type='button'
                className='w-full h-10 rounded-[4px] bg-0027db flex items-center justify-center text-base font-medium text-white'
                onClick={handleCopy}
              >
                Copiar código pix
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
