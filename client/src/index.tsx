import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import ConfigWizard from './components/ConfigWizard';
import CustomerInfo from './components/CustomerInfo';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d14c4c',
    },
    secondary: {
      main: '#424242',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const App = () => {
  const [customerInfo, setCustomerInfo] = useState<string>('');

  const handleCustomerInfoSubmit = (info: string) => {
    setCustomerInfo(info);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerInfo onCustomerInfoSubmit={handleCustomerInfoSubmit} />} />
          <Route 
            path="/configure" 
            element={
              customerInfo ? 
                <ConfigWizard customerInfo={customerInfo} /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />); 