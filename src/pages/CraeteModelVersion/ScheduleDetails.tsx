import { Box, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';

const ScheduleDetails = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  error,
  validateDates,
}: any) => {
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    validateDates(value, endDate);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    validateDates(value, startDate);
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" gutterBottom>
        Schedule
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Chart Period
      </Typography>

      <Box display="flex" gap={2} marginTop={2}>
        <TextField
          label="Start Date"
          type="date"
          fullWidth
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!error}
        />
        <TextField
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!error}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ScheduleDetails;
