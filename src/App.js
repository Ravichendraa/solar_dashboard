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
import SolarTracker from './components/SolarTracker';
import DeviceScheduling from './components/DeviceScheduling';
import Note from './components/Note';
import Savings from './components/Savings';
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
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsData, setSavingsData] = useState(null); // Store savings data
  const [mode, setMode] = useState(''); // Store current mode (solar/normal)
  const [batteryPercent, setBatteryPercent] = useState(''); // Store current mode (solar/normal)
  const [saving, setSaving] = useState(''); // Store current mode (solar/normal)
  const [remainingTime, setRemainingTime] = useState(''); // Store remaining time for next switch

  const API_KEY = 'f24b4a280e5a809e46ca765aa9d2275e'; // Replace with your valid key
  const CITY_NAME = 'Jabalpur';

  // Fetch Weather Data

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
    
    // Fetch Predicted Tariffs
    const fetchPredictedTariffs = async () => {
      try {
        const response = await fetch(
          'https://solar-dashboard-backend-1.onrender.com/api/predicted_tariffs'
        );
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setPredictedTariffs(data);
      } catch (err) {
        console.error('Error fetching predicted tariffs:', err.message);
      }
    };

    // Fetch Savings Data for Battery Percentage and Mode
    const formatHourRange = (hour) => {
      const nextHour = (hour + 1) % 24; // Ensure the hour wraps around after 23
      return `${hour}:00 - ${nextHour}:00`;
    };
    const parseHourRange = (hourString) => {
      const [startHour] = hourString.split('-').map(Number);
      return startHour;
    };
    const fetchSavingsData = async () => {
      try {
        const response = await fetch('https://solar-dashboard-backend-1.onrender.com/api/savings');
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    
        const data = await response.json();
    
        // Get the current hour and format it to match the "hour" field in the API
        const currentHour = new Date().getHours();
        const currentHourRange = formatHourRange(currentHour);

        const accumulatedSavings = data
      .filter((item) => parseHourRange(item.hour) <= currentHour) // Filter data up to the current hour
      .reduce(
        (acc, item) => {
          acc.totalSavings += parseFloat(item["savings (INR)"] || 0);
          return acc;
        },
        {  totalSavings: 0 } // Initial accumulator
      );
      setSaving(accumulatedSavings.totalSavings);
      
      const now = new Date();

    // Function to calculate remaining time in hours and minutes
    const calculateTimeDifference = (futureHour) => {
      const futureTime = new Date(now);
      futureTime.setHours(futureHour, 0, 0, 0); // Set to the start of the future hour

      const remainingMillis = futureTime - now;
      const remainingHours = Math.floor(remainingMillis / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMillis % (1000 * 60 * 60)) / (1000 * 60));

      return { remainingHours, remainingMinutes };
    };

    // Traverse from current hour to 24 hours ahead
    const findNextModeSwitch = () => {
      for (let i = 1; i <= 24; i++) {
        const nextHour = (currentHour + i) % 24;

        const nextMode = data.find((item) => item.hour === nextHour)?.mode;

        if (nextMode && nextMode !== mode) {
          return nextHour;
        }
      }
      return null;
    };

    const nextSwitchHour = findNextModeSwitch();

    if (nextSwitchHour !== null) {
      const { remainingHours, remainingMinutes } = calculateTimeDifference(nextSwitchHour);
      setRemainingTime(`${remainingHours}h ${remainingMinutes}m`);
    } else {
      setRemainingTime('No switch found in the next 24 hours');
    }
    
        // Find the entry matching the current hour
        const matchingEntry = data.find((item) => item.hour === currentHourRange);
        setBatteryPercent(matchingEntry["battery_level (%)"] || '100%');
    
        if (matchingEntry) {
          setSavingsData(matchingEntry);
          setMode(matchingEntry["current_mode"] || 'Normal'); // Set the mode (default: Normal)
        } else {
          console.warn('No data found for the current hour');
        }
      } catch (err) {
        console.error('Error fetching savings data:', err.message);
      }
    };
    

    fetchWeatherData();
    fetchPredictedTariffs();
    fetchSavingsData();
  }, [API_KEY, CITY_NAME]);

  // Calculate Remaining Time for Next Switch
  const currentHour = new Date().getHours();
  const currentTariff = predictedTariffs.find((item) => item.hour === currentHour)?.tariff || 'N/A';
  const filteredPredictedTariffs = predictedTariffs.filter((item) => item.hour >= currentHour);

  const temperature = weatherData?.main?.temp || 'N/A';
  const weatherDescription = weatherData?.weather?.[0]?.description || 'N/A';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', backgroundColor: '#f0f0f0' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                        <Typography>{mode.toUpperCase()}</Typography>
                      </Paper>
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6">Potential Savings</Typography>
                        <Typography>₹ {totalSavings.toFixed(2)}</Typography>
                      </Paper>
                      <Paper className="tariff-card" sx={{ padding: 2, height: '400px' }}>
                        <Typography variant="h5">Predicted Tariff</Typography>
                        
                        <Box sx={{ height: '300px', marginTop: 2 }}>
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
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              scales: { y: { beginAtZero: true } },
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
                        <Typography variant="h6">
                          <BatteryFull sx={{ marginRight: 1 }} /> Remaining Charge: {batteryPercent}%
                        </Typography>
                        <LinearProgress variant="determinate" value={batteryPercent} sx={{ height: 10 }} />
                      </Paper>
                      <Paper className="card" sx={{ padding: 2 }}>
                        <Typography variant="h6">
                          <AccessTime sx={{ marginRight: 1 }} /> Next Possible Switch:
                        </Typography>
                        <Typography> 1Hour 30 Minutes</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                }
              />
              <Route path="/recent-consumptions" element={<RecentConsumptions />} />
              <Route path="/recent-tariffs" element={<RecentTariffs />} />
              <Route path="/solar-tracker" element={<SolarTracker />} />
              <Route path="/device-scheduling" element={<DeviceScheduling />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/note" element={<Note />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
