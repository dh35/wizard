import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

interface CPU {
  id: number;
  model: string;
  manufacturer: string;
  tdp: number;
  cores: number;
  threads: number;
  baseSpeed: number;
  boostSpeed: number;
  price: number;
  socket: string;
  dualCapable: boolean;
}

export interface CPUSelectionProps {
  onSelect: (cpu: CPU | null) => void;
  selectedCPU: CPU | null;
  onRestart: () => void;
  onDualCPUChange: (isDual: boolean) => void;
}

const CPUSelection: React.FC<CPUSelectionProps> = ({ 
  onSelect, 
  selectedCPU,
  onDualCPUChange,
  onRestart 
}) => {
  const [cpus, setCPUs] = useState<CPU[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDualCPU, setIsDualCPU] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: '',
    minCores: 1
  });

  const fetchCPUs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);
      params.append('minCores', filters.minCores.toString());

      const response = await axios.get(`/api/cpus?${params.toString()}`);
      const sortedCPUs = response.data.sort((a: CPU, b: CPU) => a.tdp - b.tdp);
      setCPUs(sortedCPUs);
    } catch (error) {
      console.error('Failed to fetch CPUs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCPUs();
  }, [fetchCPUs]);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCPUSelect = (cpu: CPU) => {
    onSelect(cpu);
    onDualCPUChange(isDualCPU);
  };

  const calculateTotalPrice = (cpu: CPU) => {
    return isDualCPU ? cpu.price * 2 : cpu.price;
  };

  const calculateTotalCores = (cpu: CPU) => {
    return isDualCPU ? cpu.cores * 2 : cpu.cores;
  };

  const calculateTotalThreads = (cpu: CPU) => {
    return isDualCPU ? cpu.threads * 2 : cpu.threads;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        CPU Selection
      </Typography>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Manufacturer</InputLabel>
            <Select
              value={filters.manufacturer}
              label="Manufacturer"
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="AMD">AMD</MenuItem>
              <MenuItem value="Intel">Intel</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Minimum Cores (Per CPU)</Typography>
          <Slider
            value={filters.minCores}
            min={1}
            max={128}
            step={1}
            onChange={(_, value) => handleFilterChange('minCores', Array.isArray(value) ? value[0] : value)}
            valueLabelDisplay="auto"
            marks={[
              { value: 1, label: '1' },
              { value: 32, label: '32' },
              { value: 64, label: '64' },
              { value: 128, label: '128' }
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography component="legend">CPU Configuration</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="Single CPU"
                onClick={() => setIsDualCPU(false)}
                color={!isDualCPU ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="Dual CPU"
                onClick={() => setIsDualCPU(true)}
                color={isDualCPU ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </FormControl>
        </Grid>
      </Grid>

      {/* CPU List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cpus.map((cpu) => (
            <Grid item xs={12} md={6} key={cpu.id}>
              <Card
                sx={{
                  cursor: cpu.dualCapable || !isDualCPU ? 'pointer' : 'not-allowed',
                  border: selectedCPU?.id === cpu.id ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  opacity: cpu.dualCapable || !isDualCPU ? 1 : 0.5,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: cpu.dualCapable || !isDualCPU ? 'scale(1.02)' : 'none'
                  }
                }}
                onClick={() => {
                  if (cpu.dualCapable || !isDualCPU) {
                    handleCPUSelect(cpu);
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cpu.model}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`${cpu.cores} Cores`} size="small" />
                    <Chip label={`${cpu.threads} Threads`} size="small" />
                    <Chip label={`${cpu.tdp}W TDP`} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Base: {cpu.baseSpeed} GHz | Boost: {cpu.boostSpeed} GHz
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CPUSelection; 