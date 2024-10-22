import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { parseISO, format } from 'date-fns';

const RecentConsumptions = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('last30Days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/consumptions');
        console.log('API Response:', response.data);

        const transformedData = response.data.map(item => ({
          date: format(parseISO(item.Date), 'yyyy-MM-dd'),
          Lighting: item['Lighting (kWh)'] || 0,
          Refrigerator: item['Refrigerator (kWh)'] || 0,
          'Washing Machine': item['Washing Machine (kWh)'] || 0,
          Television: item['Television (kWh)'] || 0,
          'Air Conditioner': item['Air Conditioner (kWh)'] || 0,
          Microwave: item['Microwave (kWh)'] || 0,
          Laptop: item['Laptop (kWh)'] || 0,
          'Water Heater': item['Water Heater (kWh)'] || 0,
          'Other Devices': item['Other Devices (kWh)'] || 0,
        }));

        setData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (timePeriod) => setFilter(timePeriod);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
          {`${payload[0].value} kWh`}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" width="100%">
      <ResponsiveContainer width="80%" height={400}>
        <BarChart data={filteredData}>
          <XAxis dataKey="appliance" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="consumption" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RecentConsumptions;
