import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
// Import your GIFs based on weather conditions
// import clearSkyGif from './gifs/clear-sky.gif';
// import fewCloudsGif from './gifs/few-clouds.gif';
// import overcastCloudsGif from './gifs/overcast-clouds.gif';
// import drizzleGif from './gifs/drizzle.gif';
// import rainGif from './gifs/rain.gif';
// import showerRainGif from './gifs/shower-rain.gif';
// import thunderstormGif from './gifs/thunderstorm.gif';
// import snowGif from './gifs/snow.gif';
// import mistGif from './gifs/mist.gif';
import defaultGif from './gifs/thunderstorm.gif'; // Optional: default GIF

const WeatherDisplay = ({ temperature, weatherDescription, weatherIcon }) => {
  const [currentTime, setCurrentTime] = useState('');

  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);

    const formattedTime = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    setCurrentTime({ formattedDate, formattedTime });
  };

  useEffect(() => {
    updateTime(); // Update time immediately
    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  const getBackgroundGif = (description) => {
    switch (description) {
      // Add cases for other weather conditions
      default:
        return defaultGif;
    }
  };

  const backgroundGif = getBackgroundGif(weatherDescription);

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        margin: '20px auto',
        height: '400px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Background for readability
      }}
    >
      {/* Weather Information Section */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h4">{currentTime.formattedDate}</Typography>
        <Typography variant="h5">{currentTime.formattedTime}</Typography>
        <Typography variant="body1">{temperature}°C</Typography>
      </Box>

      {/* Circular Weather GIF Section */}
      <Box
        sx={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'skyblue', // Blue background for the circle
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginBottom: '10px',
        }}
      >
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
          {weatherDescription}
        </Typography>
      </Box>

      {/* Weather Icon (Optional) */}
      {weatherIcon && (
        <img
          src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
          alt={weatherDescription}
          style={{ width: '80px', marginTop: '10px' }}
        />
      )}
    </Paper>
  );
};

export default WeatherDisplay;
