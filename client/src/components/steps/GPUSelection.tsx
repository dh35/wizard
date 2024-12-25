import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { GPU, GPUQuantity } from '../../types/GPU';
import { Chassis } from '../../types/Chassis';

export interface GPUSelectionProps {
  onSelect: (gpus: GPUQuantity[]) => void;
  selectedGPUs: GPUQuantity[];
  selectedChassis: Chassis | null;
  onRestart: () => void;
}

const GPUSelection: React.FC<GPUSelectionProps> = ({
  onSelect,
  selectedGPUs,
  selectedChassis,
  onRestart
}) => {
  const [gpus, setGPUs] = useState<GPU[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGPUs = async () => {
      try {
        const response = await axios.get('/api/gpu');
        setGPUs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch GPUs');
      } finally {
        setLoading(false);
      }
    };

    fetchGPUs();
  }, []);

  const getMaxQuantity = (gpu: GPU): number => {
    // If no chassis is selected, use default max quantities
    if (!selectedChassis) {
      switch (gpu.model) {
        case 'Tesla P4':
          return 1;
        case 'RTX A4000':
          return 8;
        case 'RTX 3090':
          return 4;
        default:
          return 0;
      }
    }

    // If chassis is selected, use chassis-specific limits
    switch (gpu.model) {
      case 'Tesla P4':
        return 1;
      case 'RTX A4000':
        if (selectedChassis.model === 'Tyan FT77D-B7109' || selectedChassis.model === 'Asus ESC4000 G3') {
          return 8;
        }
        return Math.min(selectedChassis.maxGPUSlots, 8);
      case 'RTX 3090':
        if (selectedChassis.model === 'ZhenLoong X412 4U GPU') {
          return 4;
        }
        return 0;
      default:
        return 0;
    }
  };

  const handleQuantityChange = (gpu: GPU, change: number) => {
    const currentQuantity = selectedGPUs.find(g => g.gpu.id === gpu.id)?.quantity || 0;
    const newQuantity = Math.max(0, Math.min(currentQuantity + change, getMaxQuantity(gpu)));

    let newSelectedGPUs: GPUQuantity[];
    
    // If we're adding a GPU (newQuantity > 0) and there are already other GPU types selected
    if (newQuantity > 0 && selectedGPUs.length > 0 && selectedGPUs[0].gpu.model !== gpu.model) {
      setError('Cannot mix different GPU types. Please remove existing GPUs first.');
      return;
    }

    if (newQuantity === 0) {
      newSelectedGPUs = selectedGPUs.filter(g => g.gpu.id !== gpu.id);
    } else {
      const existingIndex = selectedGPUs.findIndex(g => g.gpu.id === gpu.id);
      if (existingIndex >= 0) {
        newSelectedGPUs = [...selectedGPUs];
        newSelectedGPUs[existingIndex] = { gpu, quantity: newQuantity };
      } else {
        newSelectedGPUs = [...selectedGPUs, { gpu, quantity: newQuantity }];
      }
    }

    setError(null);
    onSelect(newSelectedGPUs);
  };

  const getQuantity = (gpu: GPU): number => {
    return selectedGPUs.find(g => g.gpu.id === gpu.id)?.quantity || 0;
  };

  const isDisabled = (gpu: GPU): boolean => {
    return selectedGPUs.length > 0 && selectedGPUs[0].gpu.model !== gpu.model;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        GPU Selection
      </Typography>
      {selectedChassis && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Selected chassis: {selectedChassis.model}. GPU quantities may be adjusted when chassis is changed.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {gpus.map((gpu) => {
          const maxQuantity = getMaxQuantity(gpu);
          const currentQuantity = getQuantity(gpu);
          const isCompatible = maxQuantity > 0;
          const disabled = isDisabled(gpu);

          return (
            <Grid item xs={12} md={6} key={gpu.id}>
              <Card
                sx={{
                  opacity: (isCompatible && !disabled) ? 1 : 0.5,
                  position: 'relative'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {gpu.model}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={`${gpu.vram}GB VRAM`} />
                    <Chip label={`${gpu.tdp}W TDP`} />
                  </Box>
                  {isCompatible ? (
                    disabled ? (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Cannot mix different GPU types
                      </Alert>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <IconButton
                          onClick={() => handleQuantityChange(gpu, -1)}
                          disabled={currentQuantity === 0}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>
                          {currentQuantity} / {maxQuantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(gpu, 1)}
                          disabled={currentQuantity === maxQuantity}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    )
                  ) : (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Not compatible
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GPUSelection; 