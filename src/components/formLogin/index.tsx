'use client';

import { FormEvent } from 'react';

import { twMerge } from 'tailwind-merge';

import useFormLogin from '@/utils/formLogin/useFormLogin';

import Input from './input';

interface Props {
  className?: string;
}

export default function FormLogin({ className }: Props) {
  const { handleSubmit, register, errors, handleCNPJInput, handleCPFInput } =
    useFormLogin();

  const handleInputDocument = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    if (value.length > 14) {
      handleCNPJInput(event);
      return;
    }
    handleCPFInput(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={twMerge(className, 'w-full flex flex-col')}
    >
      <Input
        errors={errors}
        name='idDocument'
        placeholder='CPF/CNPJ'
        register={register}
        onInput={handleInputDocument}
        className='mb-4'
      />
      <Input
        errors={errors}
        name='registration'
        placeholder='Matrícula sem o dígito'
        register={register}
        className='mb-4'
      />
      <p className='text-xs font-bold text-white text-left mb-8'>
        *Verifique o número da Matrícula em uma de suas faturas ou contrato.
      </p>
      <button
        type='submit'
        className='bg-9deee7 w-full max-w-[320px] mx-auto h-12 rounded-[48px] text-sm text-0027bd uppercase'
      >
        Consultar débitos
      </button>
    </form>
  );
}
