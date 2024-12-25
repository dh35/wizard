import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Box,
  Button,
  Container
} from '@mui/material';
import CPUSelection from './steps/CPUSelection';
import GPUSelection from './steps/GPUSelection';
import RAMSelection from './steps/RAMSelection';
import StorageSelection from './steps/StorageSelection';
import ChassisSelection from './steps/ChassisSelection';
import Summary from './steps/Summary';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { CPU } from '../types/CPU';
import { GPUQuantity } from '../types/GPU';
import { RAM } from '../types/RAM';
import { Storage } from '../types/Storage';
import { Chassis } from '../types/Chassis';

const steps = [
  'CPU Selection',
  'GPU Selection',
  'RAM Configuration',
  'Storage Configuration',
  'Chassis Selection',
  'Summary'
];

interface Config {
  cpu: CPU | null;
  gpu: GPUQuantity[];
  ram: RAM | null;
  storage: Storage[];
  chassis: Chassis | null;
  isDualCPU: boolean;
}

interface ConfigWizardProps {
  customerInfo: string;
}

const ConfigWizard: React.FC<ConfigWizardProps> = ({ customerInfo }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<Config>({
    cpu: null,
    gpu: [],
    ram: null,
    storage: [],
    chassis: null,
    isDualCPU: false
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleUpdateConfig = (section: keyof Config, data: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: data
    }));
  };

  const calculateTotalPower = () => {
    let total = 0;
    if (config.cpu) {
      total += config.cpu.tdp * (config.isDualCPU ? 2 : 1);
    }
    if (config.gpu.length > 0) {
      total += config.gpu.reduce((sum, gpuQuantity) => sum + (gpuQuantity.gpu.tdp * gpuQuantity.quantity), 0);
    }
    return total;
  };

  const handleRestart = () => {
    navigate('/');
  };

  const commonProps = {
    onRestart: handleRestart
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CPUSelection
            {...commonProps}
            onSelect={(cpu) => handleUpdateConfig('cpu', cpu)}
            onDualCPUChange={(isDual) => handleUpdateConfig('isDualCPU', isDual)}
            selectedCPU={config.cpu}
          />
        );
      case 1:
        return (
          <GPUSelection
            {...commonProps}
            onSelect={(gpus) => handleUpdateConfig('gpu', gpus)}
            selectedGPUs={config.gpu}
            selectedChassis={config.chassis}
          />
        );
      case 2:
        return (
          <RAMSelection
            {...commonProps}
            onSelect={(ram) => handleUpdateConfig('ram', ram)}
            selectedRAM={config.ram}
            selectedCPU={config.cpu}
          />
        );
      case 3:
        return (
          <StorageSelection
            {...commonProps}
            onSelect={(storage) => handleUpdateConfig('storage', storage)}
            selectedStorage={config.storage}
            selectedChassis={config.chassis}
          />
        );
      case 4:
        return (
          <ChassisSelection
            {...commonProps}
            onSelect={(chassis) => handleUpdateConfig('chassis', chassis)}
            selectedChassis={config.chassis}
            totalPower={calculateTotalPower()}
            config={config}
          />
        );
      case 5:
        return <Summary {...commonProps} config={config} customerInfo={customerInfo} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Crunchbits Server Configuration Wizard
          </Typography>
          <Typography variant="subtitle1" align="center" color="primary" gutterBottom>
            For: {customerInfo}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ position: 'relative', minHeight: '60vh' }}>
            {renderStep()}
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <Button
                startIcon={<RestartAltIcon />}
                onClick={handleRestart}
                color="primary"
                variant="outlined"
                size="small"
              >
                Start Over
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="contained"
              color="secondary"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConfigWizard; 