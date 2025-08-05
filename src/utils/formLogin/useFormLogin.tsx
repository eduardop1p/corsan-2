'use client';

import { FormEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import encryptData from '@/actions/encryptData';
import getNameDocument from '@/actions/getNameDocument';
import setCookie from '@/actions/setCookie';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLoadingApplicationContext } from '../loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '../toastSweetalert2Context/useContext';
import { zodSchema, BodyProtocol } from './validation';

export default function useFormLogin() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(zodSchema) });
  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();

  const handleFormSubmit: SubmitHandler<BodyProtocol> = async body => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const authorization = await encryptData(body);
      const res = await fetch('/api/scrape', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const error = data.error;
        setToast({
          icon: 'error',
          message: error.message,
          description: error.description,
        });
        return;
      }
      await setCookie('user-document', body.idDocument);
      await setCookie('user-registration', body.registration);
      const userName = await getNameDocument(body.idDocument);
      if (userName) await setCookie('user-name', userName);
      const userId = data.userId;
      location.href = `/segunda-via/${userId}`;
    } catch {
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido',
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFInput = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    currentTarget.value = value;
  };

  const handleCNPJInput = (event: FormEvent<HTMLInputElement>) => {
    // 12.345.678/0001-95
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 14);
    // Aplica a formatação de CNPJ usando regex em etapas
    value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Formata os dois primeiros dígitos
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Formata os próximos três dígitos
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Formata os próximos três dígitos e adiciona a barra
    value = value.replace(/(\d{4})(\d)/, '$1-$2'); // Formata os quatro dígitos e adiciona o hífen

    currentTarget.value = value;
  };

  return {
    handleSubmit: handleSubmit(handleFormSubmit),
    register,
    errors,
    handleCPFInput,
    handleCNPJInput,
  };
}
