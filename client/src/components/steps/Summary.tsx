import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Chip, Button, Stack } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CPU } from '../../types/CPU';
import { RAM } from '../../types/RAM';
import { GPUQuantity } from '../../types/GPU';
import { Storage } from '../../types/Storage';
import { Chassis } from '../../types/Chassis';
import axios from 'axios';

export interface SummaryProps {
  config: {
    cpu: CPU | null;
    gpu: GPUQuantity[];
    ram: RAM | null;
    storage: Storage[];
    chassis: Chassis | null;
    isDualCPU: boolean;
  };
  customerInfo: string;
}

const Summary: React.FC<SummaryProps> = ({ config, customerInfo }) => {
  // Calculate total GPU specifications
  const calculateGPUTotals = () => {
    if (!config.gpu || config.gpu.length === 0) return { totalVram: 0, totalTdp: 0 };
    
    return config.gpu.reduce((acc, gpuConfig) => {
      const { gpu, quantity } = gpuConfig;
      return {
        totalVram: acc.totalVram + (gpu.vram * quantity),
        totalTdp: acc.totalTdp + (gpu.tdp * quantity)
      };
    }, { totalVram: 0, totalTdp: 0 });
  };

  const calculateTotalPower = () => {
    let total = 0;
    if (config.cpu) {
      total += config.cpu.tdp * (config.isDualCPU ? 2 : 1);
    }
    if (config.gpu.length > 0) {
      total += config.gpu.reduce((sum, gpuConfig) => sum + (gpuConfig.gpu.tdp * gpuConfig.quantity), 0);
    }
    return total;
  };

  const calculateCosts = () => {
    // Calculate base hardware cost
    const hardwareCost = (config.chassis?.price || 0) + 
      (config.cpu ? (config.cpu.price * (config.isDualCPU ? 2 : 1)) : 0) +
      config.gpu.reduce((sum, gpuConfig) => sum + (gpuConfig.gpu.price * gpuConfig.quantity), 0) +
      (config.ram?.price || 0) +
      config.storage.reduce((sum, drive) => sum + drive.price, 0);

    // Get rack units from chassis form factor
    const rackUnits = parseInt(config.chassis?.formFactor?.replace('U', '') || '0');
    
    // For multi-node chassis, halve the effective rack units for cost calculation
    const effectiveRackUnits = config.chassis?.multiNode ? rackUnits / 2 : rackUnits;
    
    // Calculate amperage (watts/208)
    const totalPower = calculateTotalPower();
    const amperage = totalPower / 208;

    // Calculate yearly costs
    const yearlyRackCost = effectiveRackUnits * 420;
    const yearlyPowerCost = amperage * 420;
    const yearlyTotal = hardwareCost + yearlyRackCost + yearlyPowerCost;
    
    // Calculate monthly cost (non-discounted)
    const monthlyCost = yearlyTotal / 12;
    
    // Calculate discounted yearly total
    const discountedYearlyTotal = yearlyTotal * 0.95;

    return {
      monthlyCost,
      yearlyTotal: discountedYearlyTotal,
      totalPower,
      amperage
    };
  };

  const gpuTotals = calculateGPUTotals();
  const costs = calculateCosts();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Crunchbits Server Configuration Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1976d2; margin-bottom: 30px; }
            h2 { color: #1976d2; margin-top: 20px; }
            .section { margin-bottom: 20px; }
            .chip { 
              display: inline-block;
              background: #e0e0e0;
              padding: 4px 8px;
              border-radius: 16px;
              margin: 4px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>Crunchbits Server Configuration Summary</h1>
          <h2>Quote For: ${customerInfo}</h2>

          <div class="section">
            <h2>CPU Configuration</h2>
            ${config.cpu ? `
              <p>${config.isDualCPU ? '2x ' : ''}${config.cpu.model}</p>
              <div>
                <span class="chip">${config.isDualCPU ? config.cpu.cores * 2 : config.cpu.cores} Cores</span>
                <span class="chip">${config.isDualCPU ? config.cpu.threads * 2 : config.cpu.threads} Threads</span>
                <span class="chip">${config.isDualCPU ? config.cpu.tdp * 2 : config.cpu.tdp}W TDP</span>
              </div>
            ` : 'No CPU selected'}
          </div>

          <div class="section">
            <h2>GPU Configuration</h2>
            ${config.gpu && config.gpu.length > 0 ? `
              ${config.gpu.map(gpuConfig => `
                <p>${gpuConfig.quantity}x ${gpuConfig.gpu.model}</p>
              `).join('')}
              <div>
                <span class="chip">${gpuTotals.totalVram}GB VRAM Total</span>
                <span class="chip">${gpuTotals.totalTdp}W TDP Total</span>
              </div>
            ` : 'No GPU selected'}
          </div>

          <div class="section">
            <h2>Memory Configuration</h2>
            ${config.ram ? `
              <p>${config.ram.capacity}GB ${config.ram.type} ${config.ram.speed}MHz</p>
              ${config.ram.ecc ? '<span class="chip">ECC</span>' : ''}
            ` : 'No RAM selected'}
          </div>

          <div class="section">
            <h2>Storage Configuration</h2>
            ${config.storage && config.storage.length > 0 ? `
              ${config.storage.map(drive => `
                <p>${drive.model} - ${drive.capacity}GB ${drive.type}</p>
                <div>
                  <span class="chip">${drive.interface}</span>
                  <span class="chip">${drive.formFactor}</span>
                </div>
              `).join('')}
            ` : 'No storage selected'}
          </div>

          <div class="section">
            <h2>Chassis Configuration</h2>
            ${config.chassis ? `
              <p>${config.chassis.manufacturer} ${config.chassis.model}</p>
              <div>
                <span class="chip">${config.chassis.formFactor}</span>
                <span class="chip">${config.chassis.maxPowerSupply}W PSU</span>
                ${config.chassis.multiNode ? '<span class="chip">Multi-Node</span>' : ''}
              </div>
            ` : 'No chassis selected'}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const generateDiscordQuote = () => {
    const quote = `🔧 __**Crunchbits Server Configuration**__ | [Register for an account!](https://get.crunchbits.com) \`\`\`ini
[Customer] ${customerInfo}

[CPU] ${config.cpu ? `${config.isDualCPU ? '2x ' : ''}${config.cpu.model} (${config.isDualCPU ? config.cpu.cores * 2 : config.cpu.cores}C/${config.isDualCPU ? config.cpu.threads * 2 : config.cpu.threads}T)` : 'None'}

[GPU] ${config.gpu && config.gpu.length > 0 ? 
  config.gpu.map(gpuConfig => `${gpuConfig.quantity}x ${gpuConfig.gpu.model}`).join(', ') : 'None'}

[RAM] ${config.ram ? `${config.ram.capacity}GB ${config.ram.type} ${config.ram.speed}MHz${config.ram.ecc ? ' ECC' : ''}` : 'None'}

[Storage] ${config.storage && config.storage.length > 0 ? 
  config.storage.map(drive => `${drive.capacity}GB ${drive.type}`).join(', ') : 'None'}

[Chassis] ${config.chassis ? `${config.chassis.manufacturer} ${config.chassis.model} (${config.chassis.formFactor})` : 'None'}

[System Totals]
• Power: ${costs.totalPower}W (${costs.amperage.toFixed(2)}A @ 208V)
• Monthly Cost: $${Math.round(costs.monthlyCost)}
• Yearly Cost: $${Math.round(costs.yearlyTotal)} (includes 5% discount)\`\`\``;

    // Copy to clipboard
    navigator.clipboard.writeText(quote).then(() => {
      // Save the configuration to the server
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${customerInfo.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}`;
      
      axios.post('/api/quotes/save-quote', {
        filename,
        customerInfo,
        config,
        costs,
        quote
      }).catch(error => {
        console.error('Failed to save quote:', error);
      });
    }).catch(error => {
      console.error('Failed to copy to clipboard:', error);
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Configuration Summary for {customerInfo}</Typography>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={generateDiscordQuote}
          >
            Copy Discord Quote
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Summary
          </Button>
        </Stack>
      </Box>

      {/* CPU Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            CPU Configuration
          </Typography>
          {config.cpu && (
            <>
              <Typography variant="body1">
                {config.isDualCPU ? '2x ' : ''}{config.cpu.model}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip 
                  label={`${config.isDualCPU ? config.cpu.cores * 2 : config.cpu.cores} Cores`} 
                  size="small" 
                />
                <Chip 
                  label={`${config.isDualCPU ? config.cpu.threads * 2 : config.cpu.threads} Threads`} 
                  size="small" 
                />
                <Chip 
                  label={`${config.isDualCPU ? config.cpu.tdp * 2 : config.cpu.tdp}W TDP`} 
                  size="small" 
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* GPU Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            GPU Configuration
          </Typography>
          {config.gpu && config.gpu.length > 0 ? (
            <>
              {config.gpu.map((gpuConfig, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    {gpuConfig.quantity}x {gpuConfig.gpu.model}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label={`${gpuTotals.totalVram}GB VRAM Total`} size="small" />
                <Chip label={`${gpuTotals.totalTdp}W TDP Total`} size="small" />
              </Box>
            </>
          ) : (
            <Typography variant="body1">No GPU selected</Typography>
          )}
        </CardContent>
      </Card>

      {/* RAM Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Memory Configuration
          </Typography>
          {config.ram ? (
            <>
              <Typography variant="body1">
                {config.ram.capacity}GB {config.ram.type} {config.ram.speed}MHz
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {config.ram.ecc && <Chip label="ECC" size="small" />}
              </Box>
            </>
          ) : (
            <Typography variant="body1">No RAM selected</Typography>
          )}
        </CardContent>
      </Card>

      {/* Storage Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Storage Configuration
          </Typography>
          {config.storage && config.storage.length > 0 ? (
            <>
              {config.storage.map((drive, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    {drive.model} - {drive.capacity}GB {drive.type}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label={drive.interface} size="small" />
                    <Chip label={drive.formFactor} size="small" />
                  </Box>
                </Box>
              ))}
            </>
          ) : (
            <Typography variant="body1">No storage selected</Typography>
          )}
        </CardContent>
      </Card>

      {/* Cost Summary Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Cost Summary
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">
              <strong>Power Consumption:</strong> {calculateTotalPower()}W ({costs.amperage.toFixed(2)}A @ 208V)
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1">
              <strong>Monthly Cost:</strong> ${Math.round(costs.monthlyCost)}
            </Typography>
            <Typography variant="body1">
              <strong>Yearly Cost:</strong> ${Math.round(costs.yearlyTotal)} (includes 5% discount)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Chassis Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Chassis Configuration
          </Typography>
          {config.chassis ? (
            <>
              <Typography variant="body1">
                {config.chassis.manufacturer} {config.chassis.model}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label={`${config.chassis.formFactor}`} size="small" />
                <Chip label={`${config.chassis.maxPowerSupply}W PSU`} size="small" />
                {config.chassis.multiNode && <Chip label="Multi-Node" size="small" />}
              </Box>
            </>
          ) : (
            <Typography variant="body1">No chassis selected</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Summary; 