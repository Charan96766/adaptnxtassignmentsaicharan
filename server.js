const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


function getWeatherImage(description) {
  const desc = description.toLowerCase();
  if (desc.includes('sunny')) {
    return "/images/weather-sunny.png";  
  } else if (desc.includes('cloudy')) {
    return "/images/weather-cloudy.png";  
  } else if (desc.includes('rain') || desc.includes('rainy')) {
    return "/images/rainy.png";  
  } else if (desc.includes('snow')) {
    return "/images/weather-snow.png";  
  } else if (desc.includes('fog')) {
    return "/images/weather-fog.png"; 
  } else {
    return "/images/weather-default.png";  
  }
}


app.get('/', (req, res) => {
  res.render('index', { weatherData: null, error: null, weatherImage: null });
});


app.get('/climate', async (req, res) => {
  const city = req.query.city;
  const options = {
    method: 'GET',
    url: 'https://api.weatherstack.com/current',
    params: {
      access_key: process.env.ACCESS_KEY,
      query: city,
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data.error) {
      res.render('index', { weatherData: null, error: 'Failed to fetch weather data', weatherImage: null });
    } else {
      const weatherImage = getWeatherImage(response.data.current.weather_descriptions[0]);
      res.render('index', { weatherData: response.data, error: null, weatherImage });
    }
  } catch (error) {
    console.error(error);
    res.render('index', { weatherData: null, error: 'Unable to fetch data. Please try again.', weatherImage: null });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
