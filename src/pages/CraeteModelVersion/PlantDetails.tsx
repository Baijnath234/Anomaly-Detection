import { Box, Typography, Alert, TextField, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import React, { useState } from 'react';

const useStyles = makeStyles()((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: theme.spacing(2),
  },
}));

// Define the types for form data, mock data, and props
interface PlantDetailsProps {
  error?: string;
  success?: string;
  handleSubmit: (event: React.FormEvent) => void;
  formData: {
    branch: string;
    powerPlant: string;
    unit: string;
    model: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    branch?: string;
    powerPlant?: string;
    unit?: string;
    model?: string;
  };
}

interface MockData {
  branches: Array<{
    name: string;
    powerPlants: Array<{
      name: string;
      units: Array<{
        name: string;
        models: string[];
      }>;
    }>;
  }>;
}

// Mock data representing hierarchical relationships
const mockData: MockData = {
  branches: [
    {
      name: 'EAST',
      powerPlants: [
        {
          name: 'Power Plant 1',
          units: [
            {
              name: '00',
              models: ['Model A', 'Model B'],
            },
            {
              name: '01',
              models: ['Model C', 'Model D'],
            },
          ],
        },
        {
          name: 'Power Plant 2',
          units: [
            {
              name: '02',
              models: ['Model Z'],
            },
          ],
        },
      ],
    },
    {
      name: 'WEST',
      powerPlants: [
        {
          name: 'Power Plant 3',
          units: [
            {
              name: '03',
              models: ['Model W', 'Model X'],
            },
          ],
        },
        {
          name: 'Power Plant 4',
          units: [
            {
              name: '04',
              models: ['Model Y', 'Model Z'],
            },
          ],
        },
      ],
    },
  ],
};

const PlantDetails: React.FC<PlantDetailsProps> = ({
  error,
  success,
  handleSubmit,
  formData,
  handleInputChange,
  errors,
}) => {
  const { classes } = useStyles();

  // State to manage filtered options
  const [filteredPowerPlants, setFilteredPowerPlants] = useState<
    Array<{ name: string; units: Array<{ name: string; models: string[] }> }>
  >([]);
  const [filteredUnits, setFilteredUnits] = useState<
    Array<{ name: string; models: string[] }>
  >([]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const branchName = e.target.value;
    handleInputChange(e);

    // Filter power plants based on selected branch
    const selectedBranch = mockData.branches.find(
      (branch) => branch.name === branchName
    );
    setFilteredPowerPlants(selectedBranch?.powerPlants || []);
    setFilteredUnits([]);
    setFilteredModels([]);
  };

  const handlePowerPlantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const powerPlantName = e.target.value;
    handleInputChange(e);

    // Filter units based on selected power plant
    const selectedPowerPlant = filteredPowerPlants.find(
      (plant) => plant.name === powerPlantName
    );
    setFilteredUnits(selectedPowerPlant?.units || []);
    setFilteredModels([]);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const unitName = e.target.value;
    handleInputChange(e);

    // Filter models based on selected unit
    const selectedUnit = filteredUnits.find((unit) => unit.name === unitName);
    setFilteredModels(selectedUnit?.models || []);
  };

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5" gutterBottom>
        Plant Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          select
          variant="outlined"
          label="Branch"
          name="branch"
          fullWidth
          required
          className={classes.field}
          value={formData.branch}
          onChange={handleBranchChange}
          error={!!errors.branch}
        >
          {mockData.branches.map((branch) => (
            <MenuItem key={branch.name} value={branch.name}>
              {branch.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          variant="outlined"
          label="Power Plant"
          name="powerPlant"
          fullWidth
          required
          className={classes.field}
          value={formData.powerPlant}
          onChange={handlePowerPlantChange}
          error={!!errors.powerPlant}
          disabled={!filteredPowerPlants.length}
        >
          {filteredPowerPlants.map((plant) => (
            <MenuItem key={plant.name} value={plant.name}>
              {plant.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          variant="outlined"
          label="Unit"
          name="unit"
          fullWidth
          required
          className={classes.field}
          value={formData.unit}
          onChange={handleUnitChange}
          error={!!errors.unit}
          disabled={!filteredUnits.length}
        >
          {filteredUnits.map((unit) => (
            <MenuItem key={unit.name} value={unit.name}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          variant="outlined"
          label="Model"
          name="model"
          fullWidth
          required
          className={classes.field}
          value={formData.model}
          onChange={handleInputChange}
          error={!!errors.model}
          disabled={!filteredModels.length}
        >
          {filteredModels.map((model) => (
            <MenuItem key={model} value={model}>
              {model}
            </MenuItem>
          ))}
        </TextField>

        {/* Description Field */}
        <TextField
          variant="outlined"
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={4}
          className={classes.field}
          value={formData.description}
          onChange={handleInputChange}
        />
      </form>
    </Box>
  );
};

export default PlantDetails;
