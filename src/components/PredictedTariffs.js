// src/components/PredictedTariffs.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgress, Typography } from '@mui/material';

const PredictedTariffs = () => {
  const [predictedTariffs, setPredictedTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictedTariffs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/predicted_tariffs'); // Adjust the endpoint as needed
        setPredictedTariffs(response.data);
      } catch (err) {
        console.error('Error fetching predicted tariff data:', err);
        setError('Failed to fetch predicted data');
      } finally {
        setLoading(false);
      }
    };
    fetchPredictedTariffs();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  // Prepare data for the Line chart
  const chartData = {
    labels: predictedTariffs.map(item => item.date), // Ensure your data has a date field
    datasets: [
      {
        label: 'Predicted Tariff (INR/kWh)',
        data: predictedTariffs.map(item => item.tariff), // Ensure your data has a tariff field
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tariff (INR/kWh)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Typography variant="h4">Predicted Tariffs</Typography>
      <div style={{ width: '80%', height: '400px', margin: '0 auto' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PredictedTariffs;
