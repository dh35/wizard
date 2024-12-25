import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { Chassis } from '../../types/Chassis';

interface Storage {
  id: number;
  model: string;
  type: string;
  formFactor: string;
  capacity: number;
  interface: string;
  readSpeed: number;
  writeSpeed: number;
  rpm?: number;
}

export interface StorageSelectionProps {
  onSelect: (storage: Storage[]) => void;
  selectedStorage: Storage[];
  selectedChassis: Chassis | null;
  onRestart: () => void;
}

interface BayUsage {
  sffSata: number;
  sffNvme: number;
  lff: number;
  total: number;
}

interface DriveQuantity {
  drive: Storage;
  quantity: number;
}

const StorageSelection: React.FC<StorageSelectionProps> = ({
  onSelect,
  selectedStorage = [],
  selectedChassis,
  onRestart
}) => {
  const [storage, setStorage] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const [driveQuantities, setDriveQuantities] = useState<DriveQuantity[]>([]);
  const [bayUsage, setBayUsage] = useState<BayUsage>({
    sffSata: 0,
    sffNvme: 0,
    lff: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await axios.get('/api/storage');
        setStorage(response.data);
        // Initialize quantities for each drive
        setDriveQuantities(response.data.map((drive: Storage) => ({
          drive,
          quantity: 0
        })));
      } catch (error) {
        console.error('Failed to fetch storage options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorage();
  }, []);

  useEffect(() => {
    // Calculate bay usage whenever quantities change
    const usage: BayUsage = {
      sffSata: 0,
      sffNvme: 0,
      lff: 0,
      total: 0
    };

    driveQuantities.forEach(({ drive, quantity }) => {
      if (drive.formFactor === 'SFF') {
        if (drive.interface === 'U.2') {
          usage.sffNvme += quantity;
        } else {
          usage.sffSata += quantity;
        }
      } else {
        usage.lff += quantity;
      }
    });

    usage.total = usage.sffSata + usage.sffNvme + usage.lff;
    setBayUsage(usage);

    // Update selected storage based on quantities
    const newSelectedStorage: Storage[] = [];
    driveQuantities.forEach(({ drive, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        newSelectedStorage.push(drive);
      }
    });
    onSelect(newSelectedStorage);
  }, [driveQuantities, onSelect]);

  const formatCapacity = (capacity: number) => {
    return capacity >= 1000 ? `${capacity / 1000}TB` : `${capacity}GB`;
  };

  const getSpeedLabel = (drive: Storage) => {
    if (drive.type === 'HDD') {
      return `${drive.rpm} RPM`;
    }
    return `R: ${drive.readSpeed}MB/s | W: ${drive.writeSpeed}MB/s`;
  };

  const handleQuantityChange = (driveId: number, change: number) => {
    setDriveQuantities(prev => {
      const updated = prev.map(item => {
        if (item.drive.id === driveId) {
          const newQuantity = Math.max(0, item.quantity + change);
          // Check if adding would exceed drive bay limit
          const totalOthers = prev.reduce((sum, d) => 
            d.drive.id !== driveId ? sum + d.quantity : sum, 0);
          if (selectedChassis && (totalOthers + newQuantity) > selectedChassis.driveBays) {
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };

  const renderDriveGroup = (type: string, title: string) => {
    const drives = driveQuantities.filter(({ drive }) => drive.type === type);
    if (drives.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {drives.map(({ drive, quantity }) => (
            <Grid item xs={12} key={drive.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        {formatCapacity(drive.capacity)} {drive.type}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Chip label={drive.interface} size="small" />
                        <Chip label={`${drive.formFactor}`} size="small" />
                        <Chip label={getSpeedLabel(drive)} size="small" />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(drive.id, -1)}
                        disabled={quantity === 0}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(drive.id, 1)}
                        disabled={selectedChassis ? bayUsage.total >= (selectedChassis.driveBays || 0) : false}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Storage Selection
      </Typography>

      {/* Bay Usage Summary */}
      <Card sx={{ mb: 4, bgcolor: 'background.default' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Drive Bay Usage
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                2.5" SATA Bays Used:
              </Typography>
              <Typography variant="h6">
                {bayUsage.sffSata}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                2.5" NVMe Bays Used:
              </Typography>
              <Typography variant="h6">
                {bayUsage.sffNvme}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                3.5" SATA Bays Used:
              </Typography>
              <Typography variant="h6">
                {bayUsage.lff}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total Bays Used:
              </Typography>
              <Typography variant="h6">
                {bayUsage.total} / {selectedChassis?.driveBays || '∞'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {renderDriveGroup('SSD', 'Solid State Drives (SSDs)')}
          {renderDriveGroup('NVMe', 'NVMe Drives')}
          {renderDriveGroup('HDD', 'Hard Disk Drives (HDDs)')}
        </Box>
      )}

      {selectedChassis && bayUsage.total >= selectedChassis.driveBays && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Maximum number of drive bays ({selectedChassis.driveBays}) reached
        </Alert>
      )}
    </Box>
  );
};

export default StorageSelection; 