import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';

const SolarForecast = () => (
  <Paper sx={{ padding: '20px' }}>
    <Typography variant="h6">Today's Solar Power Forecast</Typography>
    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
      {['6:00 AM', '9:00 AM', '12:00 PM'].map((time, index) => (
        <Grid item xs={4} key={index}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography>{time}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default SolarForecast;
