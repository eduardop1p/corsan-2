'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createContext } from 'react';

import delay from '@/services/delay';

interface CaptchaContextProtocol {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const defaultState = true;

export const CaptchaContext = createContext<CaptchaContextProtocol>({
  isLoading: defaultState,
  setIsLoading: () => { }, // eslint-disable-line
});

export default function CaptchaContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(defaultState);

  useEffect(() => {
    (async () => {
      await delay(3000);
      setIsLoading(false);
    })();
  }, []);

  return (
    <CaptchaContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? (
        <h1 className='text-center mt-2'>Carregando aguarde...</h1>
      ) : (
        children
      )}
    </CaptchaContext.Provider>
  );
}
