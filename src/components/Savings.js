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
  Button,
  Modal,
} from '@mui/material';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch savings data from backend
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await fetch(
          'https://solar-dashboard-backend-1.onrender.com/api/savings'
        );
        const data = await response.json();

        // Sum the 'savings (INR)' field correctly
        const total = data.reduce((acc, item) => {
          const savingsValue = parseFloat(item["savings (INR)"]) || 0;
          return acc + savingsValue;
        }, 0);

        setSavings(data);
        setTotalSavings(total);
      } catch (error) {
        console.error('Error fetching savings:', error);
      }
    };

    fetchSavings();
  }, []);

  // Open and close the modal
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 6,  // Adjust this value to raise or lower the table
        paddingX: 2,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Today's Savings
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: '80%', marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Day</strong></TableCell>
              <TableCell><strong>Total Savings (₹)</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Today</TableCell>
              <TableCell>{totalSavings.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={handleOpenModal}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ textAlign: 'center', color: '#616161', mt: 2 }}>
        Not Enough Data To Show Historical Savings and Performance Metrics For Previous Days
      </Typography>

      {/* Scrollable Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Hourly Savings
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Hour</strong></TableCell>
                <TableCell><strong>Savings (₹)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savings.length > 0 ? (
                savings.map((saving) => (
                  <TableRow key={saving._id}>
                    <TableCell>{saving.hour}</TableCell>
                    <TableCell>{parseFloat(saving["savings (INR)"]).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hourly savings available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Modal>
    </Box>
  );
};

export default Savings;
