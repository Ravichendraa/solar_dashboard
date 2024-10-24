import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Savings = () => {
  const [savings, setSavings] = useState([]);

  // Fetch hourly savings data from backend
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await fetch('https://solar-dashboard-backend-1.onrender.com/api/hourly-savings');
        const data = await response.json();
        setSavings(data);
      } catch (error) {
        console.error('Error fetching savings:', error);
      }
    };

    fetchSavings();
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
        Hourly Savings
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: '80%', marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hour</strong></TableCell>
              <TableCell><strong>Savings (₹)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savings.length > 0 ? (
              savings.map((saving, index) => (
                <TableRow key={index}>
                  <TableCell>{`${saving.hour}:00`}</TableCell>
                  <TableCell>{saving.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No savings data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Savings;
