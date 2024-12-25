import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CustomerInfoProps {
  onCustomerInfoSubmit: (customerInfo: string) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onCustomerInfoSubmit }) => {
  const [customerInfo, setCustomerInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.trim()) {
      onCustomerInfoSubmit(customerInfo.trim());
      navigate('/configure'); // Navigate to the configuration page
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Crunchbits
        </Typography>
        <Typography variant="h6" gutterBottom color="textSecondary">
          Server Configuration Wizard
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Who is this quote for?"
            variant="outlined"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
            placeholder="Enter customer name or company"
            sx={{ mb: 3 }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!customerInfo.trim()}
            sx={{ mt: 2 }}
          >
            Start Configuration
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerInfo; 