import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { RAM } from '../../types/RAM';
import { CPU } from '../../types/CPU';

interface RAMSelectionProps {
  onSelect: (ram: RAM | null) => void;
  selectedRAM: RAM | null;
  selectedCPU: CPU | null;
  onRestart: () => void;
}

const RAMSelection: React.FC<RAMSelectionProps> = ({ 
  onSelect, 
  selectedRAM,
  selectedCPU 
}) => {
  const [rams, setRAMs] = useState<RAM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRAMs = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCPU?.generation) {
          params.append('cpuGeneration', selectedCPU.generation);
        }

        const response = await axios.get(`/api/ram?${params.toString()}`);
        setRAMs(response.data);
      } catch (error) {
        console.error('Failed to fetch RAM options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRAMs();
  }, [selectedCPU]);

  const formatCapacity = (capacity: number) => {
    return capacity >= 1024 ? `${capacity / 1024}TB` : `${capacity}GB`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        RAM Selection
      </Typography>

      {!selectedCPU && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Please select a CPU first to see compatible RAM options
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {rams.map((ram) => (
            <Grid item xs={12} md={6} key={ram.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedRAM?.id === ram.id ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={() => onSelect(ram)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {formatCapacity(ram.capacity)} {ram.type}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`${ram.speed} MHz`} size="small" />
                    <Chip label={ram.generation} size="small" />
                    {ram.ecc && <Chip label="ECC" size="small" color="success" />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RAMSelection; 