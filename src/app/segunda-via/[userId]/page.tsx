export const dynamic = 'force-dynamic';

/* eslint-disable @next/next/no-html-link-for-pages */
import { redirect } from 'next/navigation';

import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoIosInformationCircle } from 'react-icons/io';

import getPix from '@/actions/getPix';
import Insights from '@/components/admin/insights';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Invoices from '@/components/invoices';
import getUser from '@/db/actions/user/getUser';
import PixProtocol from '@/interfaces/pixProtocol';

interface Props {
  params: Promise<{ userId?: string }>;
}

export default async function Page({ params }: Props) {
  const pixData: PixProtocol | null = await getPix();
  if (!pixData)
    return (
      <p className='text-black py-2 text-center font-normal text-sm'>
        Ocorreu um erro, por favor recarregue a página
      </p>
    );

  const { userId } = await params;
  if (!userId) redirect('/');
  const user = await getUser({ query: { _id: userId } });
  if (!user) redirect('/');
  const registration = user.matricula;
  const customer = {
    name: user.nome,
    email: 'myemail@myemail.com',
    document: user.idDocument,
    phone: '11987654321',
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-center bg-cover bg-no-repeat bg-[url('/assets/imgs/background_logoff_screen.a6bfea403d09ec19.png')]">
      <Header />
      <main className='mt-5 w-full max-w-[1440px] mx-auto flex flex-col'>
        <a
          href='/'
          className='w-full flex items-center gap-4 text-white text-lg mb-5 px-6'
        >
          <FaArrowLeftLong fill='#fff' size={20} /> Voltar para página de Login
        </a>
        <div className='w-full bg-white flex flex-col p-8 rounded-t-[24px] relative before:-bottom-20 before:absolute before:w-full before:h-20 before:bg-white before:left-0'>
          <div className='w-full flex items-center justify-between gap-2 mb-6 max-[600px]:flex-col max-[600px]:items-start'>
            <h1 className='text-[45px] text-111799 font-light'>
              Faturas em aberto
            </h1>
            <div className='border max-[600px]:w-fit flex-none border-solid border-17e3cb p-[10px] flex items-center gap-2 rounded-[18px] overflow-hidden text-base font-medium text-8c91a4'>
              Matrícula:{' '}
              <span className='text-[24px] text-0027bd font-normal'>
                {registration}
              </span>
            </div>
          </div>
          {user.debitos.length > 0 && (
            <p className='text-111799 text-lg font-light mb-2'>
              Somente faturas a vencer e vencidas que ainda não constam
              pagamento.
            </p>
          )}
          <Invoices
            debitos={user.debitos}
            customer={customer}
            className='mb-5'
            {...pixData}
          />
          <div className='text-sm font-light text-495057 flex items-center gap-3'>
            <IoIosInformationCircle fill='#17e3cb' size={32} />
            Para informações sobre seu histórico de consumo, faturas pagas,
            negociação de débitos e outros serviços, faça o login com seu email
            e senha ou cadastra-se.
          </div>
        </div>
      </main>

      <Footer className='relative z-[2]' />
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
      <Insights page='Faturas' />
    </div>
  );
}
