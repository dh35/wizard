import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Chassis } from '../../types/Chassis';
import { Config } from '../../types/Config';
import { GPUQuantity } from '../../types/GPU';
import { Storage } from '../../types/Storage';

interface ChassisSelectionProps {
  onSelect: (chassis: Chassis | null) => void;
  selectedChassis: Chassis | null;
  totalPower: number;
  config: Config;
  onRestart: () => void;
}

const ChassisSelection: React.FC<ChassisSelectionProps> = ({
  onSelect,
  selectedChassis,
  totalPower,
  config,
  onRestart
}) => {
  const [chassis, setChassis] = useState<Chassis[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLTO, setIsLTO] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChassis = async () => {
      try {
        const response = await axios.get('/api/chassis');
        console.log('Loaded chassis data:', JSON.stringify(response.data, null, 2));
        console.log('ASUS ESC4000 G3 data:', JSON.stringify(response.data.find((c: Chassis) => c.model === 'ESC4000 G3'), null, 2));
        setChassis(response.data);
      } catch (error) {
        console.error('Failed to fetch chassis options:', error);
        setError('Failed to load chassis options');
      } finally {
        setLoading(false);
      }
    };

    fetchChassis();
  }, []);

  const isChassisCompatible = (chassis: Chassis) => {
    console.log('\n=== Checking compatibility for chassis:', chassis.model, '===');
    console.log('Chassis specs:', {
      maxGPUSlots: chassis.maxGPUSlots,
      compatibleCPUs: chassis.compatibleCPUs,
      compatibleGPUs: chassis.compatibleGPUs,
      driveBays: chassis.driveBays,
      maxNvmeDrives: chassis.maxNvmeDrives,
      maxSffDrives: chassis.maxSffDrives,
      maxLffDrives: chassis.maxLffDrives,
      maxPowerSupply: chassis.maxPowerSupply
    });
    console.log('Current config:', {
      cpu: config.cpu?.model,
      gpus: config.gpu.map((g: GPUQuantity) => `${g.quantity}x ${g.gpu.model}`),
      storage: config.storage.map((s: Storage) => `${s.capacity}GB ${s.type} ${s.formFactor}`),
      totalPower
    });

    // Check LTO compatibility
    if (isLTO && !chassis.isLtoCompatible) {
      console.log('❌ Failed LTO check - chassis is not LTO compatible');
      return false;
    }

    // Check CPU compatibility
    if (config.cpu && chassis.compatibleCPUs) {
      const cpuModel = config.cpu.model;
      let cpuFamily = 'Unknown';
      
      if (cpuModel.includes('EPYC')) {
        const modelMatch = cpuModel.match(/\d+/);
        console.log('CPU Model:', cpuModel);
        console.log('Model Match:', modelMatch);
        if (modelMatch) {
          const modelNumber = modelMatch[0];
          console.log('Model Number:', modelNumber);
          console.log('Third digit:', modelNumber[3]);
          if (modelNumber[3] === '2') {
            cpuFamily = 'EPYC 7002';  // Rome
            console.log('Detected as Rome (7002)');
          } else if (modelNumber[3] === '3') {
            cpuFamily = 'EPYC 7003';  // Milan
            console.log('Detected as Milan (7003)');
          } else {
            console.log('Not detected as either Rome or Milan');
          }
        }
      } else if (cpuModel.includes('Gold')) {
        cpuFamily = 'Xeon Gold';
      } else if (cpuModel.includes('E5')) {
        cpuFamily = 'Xeon E5';
      }

      console.log(`CPU Check - Model: ${cpuModel}, Family: ${cpuFamily}, Compatible with:`, chassis.compatibleCPUs);
      if (!chassis.compatibleCPUs.includes(cpuFamily)) {
        console.log(`❌ Failed CPU compatibility - ${cpuFamily} not in [${chassis.compatibleCPUs.join(', ')}]`);
        return false;
      }
      console.log('✓ CPU compatibility check passed');
    }

    // Check GPU compatibility
    if (config.gpu && config.gpu.length > 0) {
      // Check if chassis has enough GPU slots
      const totalGPUs = config.gpu.reduce((sum: number, gpuQuantity: GPUQuantity) => sum + gpuQuantity.quantity, 0);
      console.log(`GPU Slots Check - Required: ${totalGPUs}, Available: ${chassis.maxGPUSlots}`);
      if (!chassis.maxGPUSlots || chassis.maxGPUSlots < totalGPUs) {
        console.log('❌ Failed GPU slot check - not enough slots');
        return false;
      }
      console.log('✓ GPU slots check passed');

      // Check if chassis supports the GPU models
      if (!chassis.compatibleGPUs || chassis.compatibleGPUs.length === 0) {
        console.log('❌ Failed GPU compatibility - chassis has no GPU support');
        return false;
      }

      for (const gpuQuantity of config.gpu) {
        console.log(`GPU Model Check - ${gpuQuantity.gpu.model} against [${chassis.compatibleGPUs.join(', ')}]`);
        if (!chassis.compatibleGPUs.includes(gpuQuantity.gpu.model)) {
          console.log(`❌ Failed GPU model compatibility - ${gpuQuantity.gpu.model} not supported`);
          return false;
        }
      }
      console.log('✓ GPU model compatibility check passed');
    }

    // Check storage compatibility
    if (config.storage && config.storage.length > 0) {
      let nvmeCount = 0;
      let sffCount = 0;
      let lffCount = 0;

      config.storage.forEach((drive: Storage) => {
        if (drive.interface === 'U.2') {
          nvmeCount++;
        } else if (drive.formFactor === 'SFF') {
          sffCount++;
        } else {
          lffCount++;
        }
      });

      console.log('Storage Check:', {
        required: { nvme: nvmeCount, sff: sffCount, lff: lffCount },
        available: {
          total: chassis.driveBays,
          nvme: chassis.maxNvmeDrives,
          sff: chassis.maxSffDrives,
          lff: chassis.maxLffDrives
        }
      });

      // Check total bay count first
      const totalDrivesNeeded = nvmeCount + sffCount + lffCount;
      if (totalDrivesNeeded > chassis.driveBays) {
        console.log('❌ Failed storage check - total drives exceed available bays');
        return false;
      }

      // Check NVMe compatibility
      if (nvmeCount > chassis.maxNvmeDrives) {
        console.log('❌ Failed storage check - too many NVMe drives');
        return false;
      }

      // First allocate LFF drives since they can only go in LFF bays
      console.log('Checking LFF compatibility:', {
        lffCount,
        maxLffDrives: chassis.maxLffDrives,
        chassis: {
          model: chassis.model,
          driveBays: chassis.driveBays,
          maxNvmeDrives: chassis.maxNvmeDrives,
          maxSffDrives: chassis.maxSffDrives,
          maxLffDrives: chassis.maxLffDrives
        }
      });
      if (lffCount > chassis.maxLffDrives) {
        console.log('❌ Failed storage check - too many LFF drives');
        console.log('LFF drives needed:', lffCount);
        console.log('LFF bays available:', chassis.maxLffDrives);
        return false;
      }

      // Then check if remaining LFF bays can accommodate SFF drives
      const lffBaysRemaining = chassis.maxLffDrives - lffCount;
      console.log('Checking SFF compatibility:', {
        sffCount,
        maxSffDrives: chassis.maxSffDrives,
        lffBaysRemaining,
        sffDrivesNeedingLffBays: Math.max(0, sffCount - chassis.maxSffDrives)
      });
      const sffDrivesNeedingLffBays = Math.max(0, sffCount - chassis.maxSffDrives);
      if (sffDrivesNeedingLffBays > lffBaysRemaining) {
        console.log('❌ Failed storage check - not enough bays for SFF drives');
        console.log('Additional SFF bays needed:', sffDrivesNeedingLffBays);
        console.log('LFF bays remaining:', lffBaysRemaining);
        return false;
      }

      console.log('✓ Storage compatibility check passed');
    }

    // Check power requirements
    if (totalPower > chassis.maxPowerSupply * 0.8) { // 80% power capacity rule
      console.log(`❌ Failed power check - Required: ${totalPower}W, Max: ${chassis.maxPowerSupply * 0.8}W`);
      return false;
    }
    console.log('✓ Power check passed');

    console.log('✓ All compatibility checks passed');
    return true;
  };

  const compatibleChassis = chassis.filter(isChassisCompatible);

  const handleLTOChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLTO(event.target.checked);
    // Clear selection if current chassis is not compatible with new LTO setting
    if (selectedChassis && event.target.checked && !selectedChassis.isLtoCompatible) {
      onSelect(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chassis Selection
      </Typography>

      {/* LTO Question */}
      <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={isLTO}
                onChange={handleLTOChange}
                name="lto"
                color="primary"
              />
            }
            label="Is this a Lease-to-Own (LTO) quote?"
          />
          {isLTO && (
            <Alert severity="info" sx={{ mt: 2 }}>
              LTO configurations require an independent chassis. Multi-node chassis options are not available.
            </Alert>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : compatibleChassis.length === 0 ? (
        <Alert severity="warning">
          No compatible chassis found for your configuration. Please review your component selections.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {compatibleChassis.map((chassis) => (
            <Grid item xs={12} md={6} key={chassis.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedChassis?.id === chassis.id ? '2px solid #d14c4c' : 'none',
                  '&:hover': {
                    borderColor: '#d14c4c',
                  },
                }}
                onClick={() => onSelect(chassis)}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {chassis.manufacturer} {chassis.model}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip label={`${chassis.formFactor}`} size="small" />
                      <Chip label={`${chassis.driveBays} Drive Bays`} size="small" />
                      <Chip label={`${chassis.maxGPUSlots} GPU Slots`} size="small" />
                      <Chip label={`${chassis.maxPowerSupply}W PSU`} size="small" />
                      {chassis.multiNode && (
                        <Chip label="Multi-Node" color="primary" size="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Storage Configuration:
                    </Typography>
                    {chassis.maxNvmeDrives > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        • {chassis.maxNvmeDrives} NVMe U.2 Bays
                      </Typography>
                    )}
                    {chassis.maxSffDrives > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        • {chassis.maxSffDrives} 2.5" SFF Bays
                      </Typography>
                    )}
                    {chassis.maxLffDrives > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        • {chassis.maxLffDrives} 3.5" LFF Bays (also compatible with 2.5" drives)
                      </Typography>
                    )}
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

export default ChassisSelection; 