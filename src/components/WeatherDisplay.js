// import React, { useState, useEffect } from 'react';
// import { Paper, Typography, Box } from '@mui/material';

// // Import your GIFs based on weather conditions
// import clearSkyGif from './gifs/sunny.gif';
// // import fewCloudsGif from './gifs/few-clouds.gif';
// import overcastCloudsGif from './gifs/partlycloudy.gif';
// import drizzleGif from './gifs/partlyrainy.gif';
// import rainGif from './gifs/partlyrainy.gif';
// import showerRainGif from './gifs/partlyrainy.gif';
// import thunderstormGif from './gifs/thunderstorm.gif';
// import snowGif from './gifs/snowy.gif';
// // import mistGif from './gifs/mist.gif';
// import windyGif from './gifs/windy.gif'; // Add windy GIF import
// import partlyCloudyGif from './gifs/partlycloudy.gif'; // Add partly cloudy GIF import
// import defaultGif from './gifs/sunny.gif'; // Optional: default GIF
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';

// Import your GIFs (day and night versions)
import clearSkyDay from './gifs/day/sunny.gif';
import clearSkyNight from './gifs/night/night.gif';
import fewCloudsDay from './gifs/day/windy.gif';
import fewCloudsNight from './gifs/night/windy.gif';
import overcastCloudsDay from './gifs/day/overcast-clouds.gif';
import overcastCloudsNight from './gifs/night/overcast-clouds.gif';
import drizzleDay from './gifs/day/drizzle.gif';
import drizzleNight from './gifs/night/drizzle.gif';
import rainDay from './gifs/day/partlyrainy.gif';
import rainNight from './gifs/night/rain.gif';
import thunderstormDay from './gifs/day/thunderstorm.gif';
import thunderstormNight from './gifs/night/thunderstorm.gif';
import snowDay from './gifs/day/snow.gif';
import snowNight from './gifs/night/snow.gif';
import mistDay from './gifs/day/mist.gif';
import mistNight from './gifs/night/mist.gif';

const WeatherDisplay = ({ temperature, weatherDescription,city_name }) => {
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
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Check if it's day or night
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;

  // Function to get the correct GIF based on weather and time
  const getBackgroundGif = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return isDayTime ? clearSkyDay : clearSkyNight;
      case 'few clouds':
        return isDayTime ? fewCloudsDay : fewCloudsNight;
      case 'overcast clouds':
        return isDayTime ? overcastCloudsDay : overcastCloudsNight;
      case 'drizzle':
        return isDayTime ? drizzleDay : drizzleNight;
      case 'rain':
        return isDayTime ? rainDay : rainNight;
      case 'thunderstorm':
        return isDayTime ? thunderstormDay : thunderstormNight;
      case 'snow':
        return isDayTime ? snowDay : snowNight;
      case 'mist':
        return isDayTime ? mistDay : mistNight;
      default:
        return isDayTime ? clearSkyDay : clearSkyNight; // Default GIFs
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
        color: isDayTime ? 'black' : 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDayTime ? 'rgba(255, 255, 255, 0.9)' : 'rgba(1, 1, 1, 0.7)', // Day/Night Background
      }}
    >
      {/* Weather Information Section */}
      <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
      {/* <Typography variant="h4">{city_name}</Typography> */}
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
          backgroundColor: isDayTime ? 'skyblue' : 'black', // Background color based on time
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
      />
      
      {/* Display Weather Description below the GIF */}
      <Typography variant="body2" sx={{ color: isDayTime ? 'black' : 'white', fontWeight: 'bold' }}>
        {weatherDescription}
      </Typography>
    </Paper>
  );
};

export default WeatherDisplay;
