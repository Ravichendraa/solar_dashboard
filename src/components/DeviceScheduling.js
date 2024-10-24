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

  // Fetch scheduled tasks from your backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          'https://solar-dashboard-backend-1.onrender.com/api/savings'
        );
        const data = await response.json();

        // Filter out entries with no scheduled device ("None")
        const scheduledDevices = data.filter(
          (item) => item.scheduled_device && item.scheduled_device !== 'None'
        );

        setSchedules(scheduledDevices);
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
        padding:8,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
        Scheduled Devices
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: '60%',
          marginTop: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>Device Name</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Time</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {schedule.scheduled_device}
                  </TableCell>
                  <TableCell align="center">
                    {schedule.hour}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No scheduled devices available
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
