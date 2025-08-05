'use client';

import { FormEventHandler } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { twMerge } from 'tailwind-merge';

import { BodyProtocol } from '@/utils/formLogin/validation';

interface Props {
  className?: string;
  placeholder: string;
  register: UseFormRegister<BodyProtocol>;
  name: keyof BodyProtocol;
  errors: FieldErrors<BodyProtocol>;
  onInput?: FormEventHandler<HTMLInputElement>;
}

export default function Input({
  className,
  placeholder,
  register,
  name,
  errors,
  onInput,
}: Props) {
  const error = errors[name];

  return (
    <div className={twMerge(className, 'w-full flex flex-col gap-1')}>
      <input
        type='text'
        {...register(name)}
        placeholder={placeholder}
        className='focus:ring-2 focus:ring-17e3cb h-[56px] w-full border border-solid border-17e3cb bg-transparent rounded-[16px] text-base text-white p-2 placeholder:text-white placeholder:font-light'
        onInput={onInput}
      />
      {error && <span className='text-red-500 text-sm'>{error.message}</span>}
    </div>
  );
}
