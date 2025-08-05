'use client';

import * as React from 'react';

import { useToastContext } from '@/utils/toastContext/useContext';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

export default function Toast() {
  const { toast, setToast } = useToastContext();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast(state => ({ ...state, open: false }));
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <Alert
        onClose={handleClose}
        severity={toast.severity}
        variant='filled'
        sx={{ width: '100%', color: '#fff' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
