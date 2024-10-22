import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // UV Index
import AirIcon from '@mui/icons-material/Air'; // Wind Speed
import OpacityIcon from '@mui/icons-material/Opacity'; // Humidity
import VisibilityIcon from '@mui/icons-material/Visibility'; // Visibility
import ThermostatIcon from '@mui/icons-material/Thermostat'; // Feels Like
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff'; // Chance of Rain
import SpeedIcon from '@mui/icons-material/Speed'; // Pressure
import WbTwilightIcon from '@mui/icons-material/WbTwilight'; // Sunset

const metrics = [
  { label: 'UV Index', value: '3', icon: <WbSunnyIcon /> },
  { label: 'Wind Speed', value: '0.2 km/h', icon: <AirIcon /> },
  { label: 'Humidity', value: '56%', icon: <OpacityIcon /> },
  { label: 'Visibility', value: '12 km', icon: <VisibilityIcon /> },
  { label: 'Feels like', value: '30°', icon: <ThermostatIcon /> },
  { label: 'Chance of rain', value: '0%', icon: <InvertColorsOffIcon /> },
  { label: 'Pressure', value: '1008 hPa', icon: <SpeedIcon /> },
  { label: 'Sunset', value: '20:58', icon: <WbTwilightIcon /> },
];

const Metrics = () => (
  <Grid container spacing={2}>
    {metrics.map((metric, index) => (
      <Grid item xs={6} sm={3} key={index}>
        <Paper sx={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {metric.icon}
            <Typography variant="h6">{metric.label}</Typography>
          </Box>
          <Typography variant="h5">{metric.value}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default Metrics;
