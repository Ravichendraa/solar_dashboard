import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto'; // Import Chart.js autoloader
import { TextField, MenuItem, Button, CircularProgress } from '@mui/material';

const RecentConsumptions = () => {
  const [data, setData] = useState([]); // Full data from API
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on time range
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [timeRange, setTimeRange] = useState(30); // Default time range: 30 days
  const [selectedDate, setSelectedDate] = useState(''); // Selected date for filtering

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://solar-dashboard-backend-1.onrender.com/api/consumptions');
        console.log('Fetched Data:', response.data);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };
    fetchData();
  }, []); // Only fetch data once on mount

  // Filter the data based on the selected time range or date
  const filterData = (allData, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days - 1); // Calculate cutoff date for filtering

    const filtered = allData.filter(item => {
      const itemDate = new Date(item.Date); // Use the correct field for date
      return itemDate >= cutoffDate; // Compare item date with cutoff date
    });

    console.log('Filtered Data:', filtered); // Debugging filtered data
    setFilteredData(filtered);
  };

  // Use another useEffect to filter data whenever timeRange or data changes
  useEffect(() => {
    if (data.length > 0) {
      if (selectedDate) {
        const specificDate = new Date(selectedDate).toLocaleDateString();
        const filtered = data.filter(item => new Date(item.Date).toLocaleDateString() === specificDate);
        setFilteredData(filtered);
      } else {
        filterData(data, timeRange); // Filter data based on the current time range
      }
    }
  }, [timeRange, data, selectedDate]); // Add timeRange, data, and selectedDate as dependencies

  // Handle time range change
  const handleTimeRangeChange = (days) => {
    setTimeRange(days); // Update timeRange state
    setSelectedDate(''); // Reset selected date
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setTimeRange(0); // Reset time range to show specific date data
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: [
      'Lighting',
      'Refrigerator',
      'Washing Machine',
      'Television',
      'Air Conditioner',
      'Microwave',
      'Laptop',
      'Water Heater',
      'Dishwasher',
      'EV Charger',
      'Other Devices',
    ],
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: filteredData.reduce((acc, item) => {
          acc[0] += item['Lighting (kWh)'] || 0;
          acc[1] += item['Refrigerator (kWh)'] || 0;
          acc[2] += item['Washing Machine (kWh)'] || 0;
          acc[3] += item['Television (kWh)'] || 0;
          acc[4] += item['Air Conditioner (kWh)'] || 0;
          acc[5] += item['Microwave (kWh)'] || 0;
          acc[6] += item['Laptop (kWh)'] || 0;
          acc[7] += item['Water Heater (kWh)'] || 0;
          acc[8] += item['Dishwasher (kWh)'] || 0;
          acc[9] += item['EV Charger (kWh)'] || 0;
          acc[10] += item['Other Devices (kWh)'] || 0;
          return acc;
        }, Array(11).fill(0)), // Initialize array with zeros
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Energy Consumption for Last ${timeRange} Days` },
    },
    scales: {
      x: {
        title: { display: true, text: 'Appliance Type' },
      },
      y: {
        title: { display: true, text: 'Energy Consumption (kWh)' },
        beginAtZero: true,
      },
    },
  };

  if (loading) return <CircularProgress />; // Display loading message
  if (error) return <p>{error}</p>; // Display error message if any

  return (
    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
      <h2>Recent Consumptions</h2>

      {/* Time Range Filter Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          variant="contained" 
          onClick={() => handleTimeRangeChange(1)}
          style={{ margin: '0 5px' }}
        >
          Today
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleTimeRangeChange(7)} 
          style={{ margin: '0 5px' }}
        >
          Last 7 Days
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleTimeRangeChange(30)} 
          style={{ margin: '0 5px' }}
        >
          Last 30 Days
        </Button>
      </div>

      {/* Date Picker for Specific Date */}
      <TextField
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />

      {/* Bar Graph */}
      {filteredData.length ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data available for the selected time range.</p>
      )}
    </div>
  );
};

export default RecentConsumptions;
