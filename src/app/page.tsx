import Image from 'next/image';

import Insights from '@/components/admin/insights';
import Footer from '@/components/footer';
import FormLogin from '@/components/formLogin';
import Header from '@/components/header';

export default function Page() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-center bg-cover bg-no-repeat bg-[url('/assets/imgs/background_logoff_screen.a6bfea403d09ec19.png')]">
      <Header />
      <div className='my-[80px] w-full max-w-[1200px] mx-auto px-6'>
        <main className='w-full flex items-center justify-center'>
          {/* <div className='bg-white p-[60px] rounded-[20px] w-full max-w-[500px] flex flex-col items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={120}
            height={59}
            viewBox='0 0 120 59'
            fill='none'
            className='mb-8'
          >
            <g clipPath='url(#clip0_2227_41284)'>
              <path
                d='M90.824.014C68.408-.075 58.154 20.26 57.627 20.97V.597h-10.09v6.437C41.401 2.13 35.21-.164 28.661.01 13.667.434 1.136 12.25.075 27.144c-1.21 17.075 12.404 31.35 29.297 31.35 4.188 0 10.312-.892 18.159-7.586v6.337h10.102v-11.95s-8.757-11.389-8.757-11.378c0 0-7.468 14.518-19.504 14.518-10.623 0-19.264-8.606-19.264-19.18 0-10.575 8.641-19.18 19.264-19.18 8.95 0 16.167 7.938 23.415 17.394C63.446 41.357 74.168 58.5 90.635 58.5c10.091 0 20.256-5.051 25.686-13.541 0 0 1.461-2.027 2.139-3.723h-11.863c-3.626 4.526-9.975 7.183-15.878 7.21h-.079c-9.103 0-16.766-9.761-24.797-20.441 2.06-4.001 4.788-8.422 8.425-11.777 4.478-4.127 9.839-6.133 16.377-6.133 8.873 0 16.362 6.007 18.586 14.15H75.787v10.06H120v-4.924C120.011 13.282 106.986.093 90.83.025l-.006-.01z'
                fill='#0027BD'
              />
            </g>
            <defs>
              <clipPath id='clip0_2227_41284'>
                <path fill='#fff' d='M0 0H120V58.5H0z' />
              </clipPath>
            </defs>
          </svg>
          <h2 className='text-[28px] text-0027bd mb-5'>Bem-vindo</h2>
          <p className='text-center text-lg text-0027bd'>
            Tenha acesso às suas faturas, pagamentos, serviços e muito mais.
          </p>
        </div> */}

          <div className='bg-0027bd p-[30px] rounded-[16px] w-full max-w-[500px] flex flex-col items-center shadow-card-accounts'>
            <div className='w-full flex items-center gap-4 justify-between mb-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-2'>
              <Image
                src='/assets/svgs/invoice.svg'
                alt='invoice'
                width={90}
                height={90}
              />
              <div className='flex flex-col gap-2'>
                <h2 className='text-17e3cb text-[28px]'>
                  2ª via rápida de fatura
                </h2>
                <p className='text-white text-sm'>
                  Somente para faturas em aberto ou atrasadas.
                </p>
              </div>
            </div>
            <FormLogin />
          </div>
        </main>
      </div>
      <Footer />
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={80}
        height={80}
        viewBox='0 0 80 80'
        fill='none'
        className='fixed z-10 right-5 bottom-5 shadow-card-accounts rounded-full'
      >
        <circle cx={40} cy={40} r={40} fill='#17E3CB' />
        <path
          d='M30.107 55.688c1.978 0 6.02-1.992 8.995-4.116 10.21.279 17.87-5.58 17.87-13.257C56.973 30.947 49.59 25 40.363 25c-9.23 0-16.612 5.947-16.612 13.315 0 4.805 3.076 9.068 7.705 11.207-.66 1.274-1.89 3.002-2.549 3.867-.776 1.025-.307 2.3 1.201 2.3zm1.538-2.431c-.117.044-.16-.044-.087-.147.82-1.01 1.992-2.534 2.49-3.471.41-.762.307-1.436-.63-1.875-4.6-2.139-7.236-5.552-7.236-9.449 0-6.005 6.284-10.898 14.18-10.898 7.91 0 14.194 4.893 14.194 10.898 0 5.992-6.284 10.884-14.195 10.884-.293 0-.747-.014-1.333-.03-.615 0-1.084.191-1.64.63-1.802 1.304-4.41 2.916-5.742 3.458z'
          fill='#111799'
        />
      </svg>
      <Insights page='Home' />
    </div>
  );
}
