var getCityCoordinates = function (cityName) {
  var apiUrlCity =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=4e120b4c8c570f41284a95ee04ea96f3";

  // make a fetch request to OpenWeather GeogCode API
  fetch(apiUrlCity).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        getCityWeather(data, cityName);
      });
    } else {
      // if not successful
      alert("Error: City not found");
    }
  });
};

var getCityWeather = function (geoCode, citySearch) {
  // check if city exists
  if (geoCode.length === 0) {
    alert("Error: City not found");
    return;
  }

  var cityLat = geoCode[0].lat;
  var cityLon = geoCode[0].lon;
  var cityCountry = geoCode[0].country;

  var apiUrlWeather =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=4e120b4c8c570f41284a95ee04ea96f3";

  fetch(apiUrlWeather).then(function (response) {
    if (response.ok) {
      // request was successful
      response.json().then(function (data) {
        displayWeather(data, citySearch);
      });
    } else {
      // if not successful
      alert("Error: City not found");
    }
  });
};

var displayWeather = function (weather, city) {
  var currentWeather = weather.current;
  var currentDate = new Date(currentWeather.dt * 1000);

  console.log(weather);
  console.log(currentDate.toLocaleDateString());

  for (var i = 0; i < 5; i++) {
    var dailyWeather = weather.daily[i];
    var dailyDate = new Date(dailyWeather.dt * 1000);

    console.log(dailyDate.toLocaleDateString());
    console.log(dailyWeather.temp.day);
    console.log(dailyWeather.wind_speed);
    console.log(dailyWeather.humidity);
  }
};

getCityCoordinates("Chicago");
