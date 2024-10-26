import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Select, MenuItem, CircularProgress, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Enable custom parsing with dayjs
dayjs.extend(customParseFormat);

const SolarTracker = () => {
  const [energyData, setEnergyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch energy data from backend API
  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get('https://solar-dashboard-backend-1.onrender.com/api/energy-data');
        console.log('Fetched energy data:', response.data);
        setEnergyData(response.data);
      } catch (err) {
        console.error('Error fetching energy data:', err);
        setError('Failed to fetch energy data');
      } finally {
        setLoading(false);
      }
    };
    fetchEnergyData();
  }, []);

  // Handle date selection change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Prepare total solar energy generation for each day
  const prepareDailyData = () => {
    const dailyData = {};

    energyData.forEach(item => {
      const date = dayjs(item.sendDate, 'DD-MM-YY HH:mm').format('DD-MM-YYYY');
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += item.solarEnergyGeneration;
    });

    return Object.keys(dailyData).map(date => ({
      date,
      total: dailyData[date], // Store total instead of average
    }));
  };

  // Prepare hourly data for the selected date
  const prepareHourlyData = (date) => {
    const hourlyData = {};

    energyData.forEach(item => {
      const itemDate = dayjs(item.sendDate, 'DD-MM-YY HH:mm');
      const itemDateString = itemDate.format('DD-MM-YYYY');
      const time = itemDate.format('hh:mm A');

      if (itemDateString === date) {
        if (!hourlyData[time]) {
          hourlyData[time] = 0;
        }
        hourlyData[time] += item.solarEnergyGeneration;
      }
    });

    return Object.keys(hourlyData).map(time => ({
      time,
      total: hourlyData[time], // Store total instead of average
    }));
  };

  const dailyData = prepareDailyData();
  const hourlyData = selectedDate
    ? prepareHourlyData(dayjs(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'))
    : [];

  // Prepare data for the chart
  const prepareChartData = (data, isHourly) => ({
    labels: data.map(item => (isHourly ? item.time : item.date)),
    datasets: [
      {
        label: isHourly
          ? 'Hourly Solar Generation (kWh)'
          : 'Total Daily Solar Generation (kWh)',
        data: data.map(item => item.total), // Use total instead of average
        fill: false,
        backgroundColor: 'rgba(255, 165, 0, 1)',
        borderColor: 'rgba(255, 165, 0, 1)',
      },
    ],
  });

  const chartData = selectedDate
    ? prepareChartData(hourlyData, true)
    : prepareChartData(dailyData, false);

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: selectedDate ? 'Time of Day' : 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Solar Generation (kWh)',
        },
        beginAtZero: true,
      },
    },
  };

  // Center loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Typography variant="h4">Solar Tracker</Typography>
      <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
        <MenuItem value="" disabled>
          Select a Date
        </MenuItem>
        {dailyData.map(({ date }) => (
          <MenuItem key={date} value={date}>
            {date}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="h6" style={{ marginTop: '20px' }}>
        {selectedDate
          ? 'Hourly Solar Generation'
          : 'Total Daily Solar Generation'}
      </Typography>
      <div style={{ width: '80%', height: '400px', margin: '0 auto' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SolarTracker;
