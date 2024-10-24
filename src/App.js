import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import { Grid, Box, Paper, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { BatteryFull, AccessTime } from '@mui/icons-material';
import WeatherDisplay from './components/WeatherDisplay';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import RecentConsumptions from './components/RecentConsumptions';
import RecentTariffs from './components/RecentTariffs'; // Import the RecentTariffs component
import { Line } from 'react-chartjs-2'; // Import Chart.js components

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictedTariffs, setPredictedTariffs] = useState([]); // State for predicted tariffs

  const API_KEY = 'f24b4a280e5a809e46ca765aa9d2275e'; // Replace with your API key
  const CITY_NAME = 'Jabalpur';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch weather data');
        }

        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPredictedTariffs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/predicted_tariffs');
        const data = await response.json();
        setPredictedTariffs(data);
      } catch (error) {
        console.error('Error fetching predicted tariffs:', error.message);
      }
    };

    fetchWeatherData();
    fetchPredictedTariffs(); // Fetch predicted tariffs
  }, [API_KEY, CITY_NAME]);

  // Extract weather data here
  const temperature = weatherData?.main?.temp || 'N/A';
  const weatherDescription = weatherData?.weather?.[0]?.description || 'N/A';
  const weatherIcon = weatherData?.weather?.[0]?.icon;

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  // Get the current hour tariff
  const currentHour = new Date().getHours();
  const currentTariff = predictedTariffs.find((data) => data.hour === currentHour)?.tariff || 'N/A';
  
  // Filter predicted tariffs for current time to midnight
  const filteredPredictedTariffs = predictedTariffs.filter((data) => data.hour >= currentHour);

  return (
    <BrowserRouter> {/* Wrap your app in BrowserRouter */}
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
        <Sidebar />
        <Box sx={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={(
              <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Paper className="card">
                    <Typography variant="h6">Current Mode</Typography>
                    <Typography>SOLAR</Typography>
                  </Paper>
                  <Paper className="card">
                    <Typography variant="h6">Savings</Typography>
                    <Typography>40 RS</Typography>
                  </Paper>
                  <Paper className="tariff-card"sx={{ padding: '10px', height: '400px', position: 'relative' }}>
                    <Typography variant="h5">Predicted Tariff</Typography>
                    <Typography variant="body1">Current Hour Tariff Rate : {currentTariff.toFixed(3)} RS / kWh</Typography>

                    {/* Mini-sized graph for predicted tariffs */}
                    <Box sx={{ marginTop: '10px', height: '300px', width: '100%', position: 'absolute', bottom: '10px' }}>
                      <Line
                        data={{
                          labels: filteredPredictedTariffs.map((data) => `${data.hour}:00`),
                          datasets: [
                            {
                              label: 'Predicted Tariff (INR/kWh)',
                              data: filteredPredictedTariffs.map((data) => data.tariff), // Use the original values
                              borderColor: 'rgba(75, 192, 192, 1)',
                              backgroundColor: 'rgba(75, 192, 192, 0.2)',
                              borderWidth: 2,
                              pointRadius: 3, // Show points on the graph
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => `${Math.round(value)}`, // Show whole numbers on y-axis
                              },
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Time of Day',
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: (tooltipItem) => {
                                  return `₹${tooltipItem.raw.toFixed(3)} per kWh`; // Custom tooltip formatting
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <WeatherDisplay 
                    temperature={temperature} 
                    weatherDescription={weatherDescription} 
                    city_name={CITY_NAME} 
                  />
                  <Paper className="card">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <BatteryFull sx={{ marginRight: '8px' }} /> Remaining Charge: 75%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ height: '10px', borderRadius: '5px', marginTop: '10px' }} 
                    />
                  </Paper>
                  <Paper className="card">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ marginRight: '8px' }} /> Next Possible Switch:
                    </Typography>
                    <Typography variant="body1">20:30, October 19</Typography>
                    <Typography variant="body2">Remaining Time: 3 hours</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )} />
            <Route path="/recent-consumptions" element={<RecentConsumptions />} />
            <Route path="/recent-tariffs" element={<RecentTariffs />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
