import React, { useState, useEffect } from 'react';
import './App.css';
import storm from './storm.svg';
import cloudy from './cloudy.svg';
import drizzle from './drizzle.svg';
import clear from './clear.svg';
import partlycloudy from './partlycloudy.svg';
import rain from './rain.svg';

function WeatherApp() {
  const [cityName, setCityName] = useState('Beirut');
  const [temperatureC, setTemperatureC] = useState(30);
  const [temperatureF, setTemperatureF] = useState(86);
  const [humidity, setHumidity] = useState(60);
  const [pressure, setPressure] = useState('1atm');
  const [status, setStatus] = useState('cloudy');
  const [forecast, setForecast] = useState([
    { time: '12:00', icon: clear, temperature: 28 },
    { time: '14:00', icon: partlycloudy, temperature: 30 },
    { time: '16:00', icon: cloudy, temperature: 25 },
    { time: '18:00', icon: partlycloudy, temperature: 22 },
    { time: '20:00', icon: rain, temperature: 20 },
    { time: '22:00', icon: drizzle, temperature: 17 },
  ]);

  const handleCityNameChange = () => {
    const cityName = document.getElementById('cityName');
    setCityName(cityName.value.toUpperCase());
    cityName.value = '';
  };

  async function fetchData(cityName) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=11a8b3654238eacc78180f3e05e63e9a`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setTemperatureC(Math.round(data.list[0].main.temp - 273.15));
      setTemperatureF(Math.round((data.list[0].main.temp - 273.15) * 9 / 5 + 32));
      setHumidity(data.list[0].main.humidity);
      setPressure(data.list[0].main.pressure);
      setStatus(data.list[0].weather[0].description);
      const newForecast = [
        { time: new Date(data.list[0].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[0].weather[0].id), temperature: Math.round(data.list[0].main.temp - 273.15) },
        { time: new Date(data.list[1].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[1].weather[0].id), temperature: Math.round(data.list[1].main.temp - 273.15) },
        { time: new Date(data.list[2].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[2].weather[0].id), temperature: Math.round(data.list[2].main.temp - 273.15) },
        { time: new Date(data.list[3].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[3].weather[0].id), temperature: Math.round(data.list[3].main.temp - 273.15) },
        { time: new Date(data.list[4].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[4].weather[0].id), temperature: Math.round(data.list[4].main.temp - 273.15) },
        { time: new Date(data.list[5].dt_txt).getHours() + ':00', icon: getWeatherIcon(data.list[5].weather[0].id), temperature: Math.round(data.list[5].main.temp - 273.15) },
      ];

      setForecast(newForecast);

      const cityNameInput = document.getElementById('cityName');
      cityNameInput.style.border = '5px solid #125696';
      cityNameInput.placeholder = 'Type city or country here...';
    } catch (error) {
      const cityNameInput = document.getElementById('cityName');
      cityNameInput.placeholder = 'Type a valid city or country';
      cityNameInput.style.border = '5px solid red';
      document.querySelector('h1').innerHTML = '';
    }
  }

  useEffect(() => {
    fetchData(cityName);
  }, [cityName]);

  function getWeatherIcon(conditionCode) {
    switch (conditionCode) {
      case 800:
        return clear;
      case 801:
      case 802:
      case 803:
        return partlycloudy;
      case 804:
        return cloudy;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        return rain;
      case 300:
      case 301:
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 321:
        return drizzle;
      default:
        return partlycloudy;
    }
  }

  return (
    <div>
      <header>
        <input
          type="text"
          id="cityName"
          placeholder="Type city or country name here..."
        />
        <input type="button" value="Search" id="forSearch" onClick={handleCityNameChange} />
      </header>
      <main>
        <div className="box">
          <div className="imgp"><img src={forecast[0].icon} className="first" alt="Weather Icon" /></div>
          <h1 id="city">{cityName}</h1>
          <div className="grid">
            <h2>
              Weather status:{status}
              <br />
              {temperatureC}&deg;C/{temperatureF}&deg;F
            </h2>
            <p className="humidity">
              Humidity: {humidity}% <br />
              Pressure: {pressure}mb
            </p>
          </div>
          <p>All day weather forecast</p>
          <div className="forecast">
            {forecast.map((item, index) => (
              <div key={index}>
                <p>{item.time}</p>
                <img src={item.icon} alt="Weather Icon" />
                <p>{item.temperature}&deg;</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default WeatherApp;
