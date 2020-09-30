const init = () => {
  const temp = document.getElementById('temp');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');
  const uvIndex = document.getElementById('uvIndex');
  const citySearch = document.getElementById('citySearch');
  const searchButton = document.getElementById('searchButton');
  const cityDate = document.getElementById('cityDate');
  const weatherPic = document.getElementById('weatherPic');
  const forecastHeader = document.getElementById('forecastHeader');
  const searchHistory = document.getElementById('searchHistory');

  const date = new Date();
  const dayNum = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const APIKey = '0897df4826cf39b28a9509bd893236a1';

  getInfo = (cityName) => {
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIKey;
    // Run the AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
        //console.log(response);
        let fullCityName = response.name;
        console.log(fullCityName);
        let weatherIcon = response.weather[0].icon;
        weatherPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');
        weatherPic.setAttribute('alt', 'Weather Icon');
        cityDate.innerHTML =  response.name + ' (' + month + '/' + dayNum + '/' + year + ')';
        // Convert temp to fahrenheit then round to 2 decimal places
        const tempF = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
        temp.innerHTML = 'Temperature: ' + tempF + '&#176F';
        humidity.innerHTML = 'Humidity: ' + response.main.humidity + '%';
        windSpeed.innerHTML = 'Wind Speed: ' + response.wind.speed + ' MPH';
        
      // Initializing for UV Index info
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
      const uvQueryURL = 'https://api.openweathermap.org/data/2.5/uvi/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + APIKey + '&cnt=1';
      //Getting UV Index through another API Call
      $.ajax({
        url: uvQueryURL,
        method: 'GET'
      })
        .then(function(response) {
          //console.log(response);
          let uvIndexBadge = document.createElement('span')
          uvIndexBadge.setAttribute('class', 'badge badge-danger');
          uvIndexBadge.innerHTML = response[0].value;
          uvIndex.innerHTML = 'UV Index: ';
          uvIndex.append(uvIndexBadge);
        });
      
      // Forecast Weather API for every 3 hours of 5 Days
      forecastHeader.innerHTML = '5-Day Forecast:';
      const forecastQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid='+ APIKey;
      $.ajax({
        url: forecastQueryURL,
        method: 'GET'
      })
        .then(function(response) {
          console.log(response);
          const forecast = document.querySelectorAll('#forecast');
          for(let i = 0; i < 5; i++) {
            // Getting mid-day reading for each day
            const forecastIndex = i * 8 + 2;
            forecast[i].innerHTML = '';
            const forecastDateEl = document.createElement('h2');
            let forecastDate = new Date(response.list[forecastIndex].dt_txt);
            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth();
            const forecastYear = forecastDate.getFullYear();
            forecastDateEl.setAttribute('class', 'mt-2');
            forecastDateEl.innerHTML = forecastMonth + '/' + forecastDay + '/' + forecastYear;
            forecast[i].append(forecastDateEl);
        
            const forecastImgEl = document.createElement('img');
            const forecastImg = response.list[forecastIndex].weather[0].icon;
            forecastImgEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + forecastImg + '@2x.png')
            forecast[i].append(forecastImgEl);

            const forecastTempEl = document.createElement('p');
            const forecastTemp = ((response.list[forecastIndex].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            forecastTempEl.innerHTML = 'Temp: ' + forecastTemp + ' &#176F';
            forecast[i].append(forecastTempEl);

            const forecastHumidityEl = document.createElement('p');
            const forecastHumidity = response.list[forecastIndex].main.humidity;
            forecastHumidityEl.innerHTML = 'Humidity: ' + forecastHumidity + '%';
            forecast[i].append(forecastHumidityEl);
          }
        });
        //Render search history after each search
        renderHistory(fullCityName);
      });

  }
  
  searchButton.addEventListener('click', function() {
    const city = citySearch.value;
    getInfo(city);
  });

  // Function to render the search history
  // Gets called at the end of the getInfo function
  renderHistory = (fullCityName) => {
    const historyEl = document.createElement('li');
    historyEl.setAttribute('class', 'list-group-item btn-link');
    historyEl.innerHTML = fullCityName;
    searchHistory.append(historyEl);
    historyEl.addEventListener('click', function() {
      getInfo(fullCityName);
    });
  }
}
init();