'use client';

import { useCallback, useEffect, useState } from 'react';

import { deburr } from 'lodash';
import { QrCodePix } from 'qrcode-pix';

import getCookie from '@/actions/getCookie';
import createPayment from '@/db/actions/payments/createPayment';
import updatePayment from '@/db/actions/payments/updatePayment';
import getClientLocation from '@/functions/getClientLocation';
import PixProtocol from '@/interfaces/pixProtocol';

import { useToastSweetalert2Context } from '../toastSweetalert2Context/useContext';

interface Props extends PixProtocol {
  value: number;
}

export default function useQRCode({ pixKey, pixName, value }: Props) {
  const [QRData, seQRData] = useState({
    src: '',
    name: '',
  });
  const [initialRender, setInitialRender] = useState(true);
  const [paymentId, setPaymentId] = useState('');
  const { setToast } = useToastSweetalert2Context();

  const handleQRCode = useCallback(
    async (qrCodePix: {
      payload: () => string;
      base64: (options?: any) => Promise<string>;
    }) => {
      try {
        const name = qrCodePix.payload();
        let src = await qrCodePix.base64();
        seQRData({
          name,
          src,
        });
        const userDocument = await getCookie('user-document');
        const userRegistration = await getCookie('user-registration');
        const clientLocation = await getClientLocation();
        const createdPaymentId = await createPayment({
          copied: false,
          location: clientLocation,
          idDocument: userDocument,
          registration: userRegistration,
          value,
        });
        if (createdPaymentId) setPaymentId(createdPaymentId);
      } catch (err) { } //eslint-disable-line
    },
    [value]
  );

  useEffect(() => {
    if (initialRender) {
      const clearName = deburr(pixName.replace(/\s/g, ''));
      const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey, //or any PIX key
        name: clearName,
        city: 'CURITIBA-PR',
        transactionId: Date.now().toString(), //max 25 characters
        cep: '80630200',
        value,
      });
      handleQRCode(qrCodePix);
      setInitialRender(false);
    }
  }, [initialRender, pixKey, pixName, value, handleQRCode]);

  const handleCopy = async () => {
    try {
      if (QRData) navigator.clipboard.writeText(QRData.name);
      setToast({
        icon: 'success',
        message: 'Código PIX copiado!',
        description: '',
      });
      await updatePayment(paymentId, { copied: true });
    } catch (err) { } // eslint-disable-line
  };

  return { QRData, handleCopy };
}
