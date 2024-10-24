import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const DeviceScheduling = () => {
  const [schedules, setSchedules] = useState([]);

  // Fetch scheduled tasks from the API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('https://solar-dashboard-backend-1.onrender.com/api/savings');
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Device Scheduling
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: '80%', marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hour</strong></TableCell>
              <TableCell><strong>Current Mode</strong></TableCell>
              <TableCell><strong>Battery Level (%)</strong></TableCell>
              <TableCell><strong>Scheduled Device</strong></TableCell>
              <TableCell><strong>Savings (₹)</strong></TableCell>
              <TableCell><strong>Remaining Battery (kWh)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell>{schedule.hour}</TableCell>
                  <TableCell>{schedule.current_mode}</TableCell>
                  <TableCell>{schedule.battery_level.toFixed(2)}</TableCell>
                  <TableCell>{schedule.scheduled_device}</TableCell>
                  <TableCell>{schedule.savings.toFixed(2)}</TableCell>
                  <TableCell>{schedule.remaining_battery.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No scheduled tasks available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeviceScheduling;
