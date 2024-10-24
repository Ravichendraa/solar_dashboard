import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Grid, Paper, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BatteryFull, AccessTime } from '@mui/icons-material';
import Sidebar from './components/Sidebar';
import WeatherDisplay from './components/WeatherDisplay';
import RecentConsumptions from './components/RecentConsumptions';
import RecentTariffs from './components/RecentTariffs';
import SolarTracker from './components/SolarTracker'; // Import SolarTracker
import { Line } from 'react-chartjs-2';

const theme = createTheme({
  typography: {
    fontFamily: 'San Francisco, monospace',
  },
});

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictedTariffs, setPredictedTariffs] = useState([]);

  const API_KEY = 'f24b4a280e5a809e46ca765aa9d2275e'; // Replace with your valid key
  const CITY_NAME = 'Jabalpur';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch weather data');
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPredictedTariffs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/predicted_tariffs');
        const data = await response.json();
        setPredictedTariffs(data);
      } catch (err) {
        console.error('Error fetching predicted tariffs:', err.message);
      }
    };

    fetchWeatherData();
    fetchPredictedTariffs();
  }, [API_KEY, CITY_NAME]);

  const currentHour = new Date().getHours();
  const currentTariff = predictedTariffs.find((item) => item.hour === currentHour)?.tariff || 'N/A';
  const filteredPredictedTariffs = predictedTariffs.filter((item) => item.hour >= currentHour);

  const temperature = weatherData?.main?.temp || 'N/A';
  const weatherDescription = weatherData?.weather?.[0]?.description || 'N/A';

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
          <Sidebar />
          <Box sx={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6">Current Mode</Typography>
                        <Typography>SOLAR</Typography>
                      </Paper>
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6">Savings</Typography>
                        <Typography>40 RS</Typography>
                      </Paper>
                      <Paper
                        className="tariff-card"
                        sx={{ padding: 2, height: '400px', position: 'relative' }}
                      >
                        <Typography variant="h5">Predicted Tariff</Typography>
                        <Typography variant="body1">
                          Current Hour Tariff Rate: {currentTariff.toFixed(3)} RS / kWh
                        </Typography>
                        <Box
                          sx={{
                            marginTop: 2,
                            height: '300px',
                            position: 'absolute',
                            bottom: 10,
                            width: '100%',
                          }}
                        >
                          <Line
                            data={{
                              labels: filteredPredictedTariffs.map((item) => `${item.hour}:00`),
                              datasets: [
                                {
                                  label: 'Predicted Tariff (INR/kWh)',
                                  data: filteredPredictedTariffs.map((item) => item.tariff),
                                  borderColor: 'rgba(75, 192, 192, 1)',
                                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                  borderWidth: 2,
                                  pointRadius: 3,
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
                                    callback: (value) => `${Math.round(value)}`,
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
                                legend: { display: true, position: 'top' },
                                tooltip: {
                                  callbacks: {
                                    label: (tooltipItem) =>
                                      `₹${tooltipItem.raw.toFixed(3)} per kWh`,
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <WeatherDisplay
                        temperature={temperature}
                        weatherDescription={weatherDescription}
                        city_name={CITY_NAME}
                      />
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          <BatteryFull sx={{ marginRight: 1 }} /> Remaining Charge: 75%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{ height: 10, borderRadius: 1, marginTop: 1 }}
                        />
                      </Paper>
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ marginRight: 1 }} /> Next Possible Switch:
                        </Typography>
                        <Typography>20:30, October 19</Typography>
                        <Typography variant="body2">Remaining Time: 3 hours</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                }
              />
              <Route path="/recent-consumptions" element={<RecentConsumptions />} />
              <Route path="/recent-tariffs" element={<RecentTariffs />} />
              <Route path="/solar-tracker" element={<SolarTracker />} /> {/* Added SolarTracker Route */}
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
