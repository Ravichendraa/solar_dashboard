import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Note = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',  // Align content closer to the top
        minHeight: '100vh',
        paddingTop: 8,  // Adjust this padding to position higher or lower on the page
        backgroundColor: '#f5f5f5',
        paddingX: 2,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          maxWidth: '600px', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Important Information
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong> Jabalpur
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Prediction Date:</strong> 21 October 2024
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Data Range Used:</strong> 21 September 2024 - 20 October 2024
        </Typography>
      </Paper>
    </Box>
  );
};

export default Note;
