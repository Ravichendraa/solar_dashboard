import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Select, MenuItem, CircularProgress, Typography } from '@mui/material';

const RecentTariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tariffs'); // Adjust the endpoint as needed
        setTariffs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tariff data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Prepare daily average tariff data
  const prepareDailyData = () => {
    const dailyTariffs = {};

    tariffs.forEach(item => {
      const date = new Date(item.DateTime).toLocaleDateString();
      if (!dailyTariffs[date]) {
        dailyTariffs[date] = { sum: 0, count: 0 };
      }
      dailyTariffs[date].sum += item['Tariff (INR/kWh)'];
      dailyTariffs[date].count++;
    });

    return Object.keys(dailyTariffs).map(date => ({
      date,
      average: dailyTariffs[date].sum / dailyTariffs[date].count,
    }));
  };

  // Prepare hourly data for a specific date
  const prepareHourlyData = (date) => {
    const hourlyTariffs = {};

    tariffs.forEach(item => {
      const itemDate = new Date(item.DateTime);
      const time = itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const itemDateString = itemDate.toLocaleDateString();

      if (itemDateString === date) {
        if (!hourlyTariffs[time]) {
          hourlyTariffs[time] = { sum: 0, count: 0 };
        }
        hourlyTariffs[time].sum += item['Tariff (INR/kWh)'];
        hourlyTariffs[time].count++;
      }
    });

    return Object.keys(hourlyTariffs).map(time => ({
      time,
      average: hourlyTariffs[time].sum / hourlyTariffs[time].count,
    }));
  };

  const dailyData = prepareDailyData();

  // Prepare data for the Line chart
  const prepareChartData = (data, isHourly) => ({
    labels: data.map(item => isHourly ? item.time : item.date),
    datasets: [
      {
        label: isHourly ? 'Hourly Tariff (INR/kWh)' : 'Average Tariff (INR/kWh)',
        data: data.map(item => item.average),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  });

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  // Get hourly data for the selected date
  const hourlyData = selectedDate ? prepareHourlyData(new Date(selectedDate).toLocaleDateString()) : [];
  const chartData = selectedDate ? prepareChartData(hourlyData, true) : prepareChartData(dailyData, false);
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
          text: 'Tariff (INR/kWh)',
        },
        beginAtZero: selectedDate ? true : false,
      },
    },
  };
  return (
    <div>
      <Typography variant="h4">Recent Tariffs</Typography>
      <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
        <MenuItem value="" disabled>Select a Date</MenuItem>
        {dailyData.map(({ date }) => (
          <MenuItem key={date} value={new Date(date).toISOString()}>
            {date}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="h6" style={{ marginTop: '20px' }}>
        {selectedDate ? 'Hourly Tariff Rate' : 'Daily Average Tariff Rate'}
      </Typography>
      <div style={{ width: '80%', height: '400px', margin: '0 auto' }}>
      <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RecentTariffs;

