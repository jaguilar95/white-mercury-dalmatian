// form element declaration
var formEl = document.getElementById("city-form");
var searchEl = document.getElementById("form-search");
var citySubmitEl = document.getElementById("form-search");

var cityArr = [];

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
  var cityFull = citySearch + ", " + geoCode[0].country;

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
        displayWeather(data, cityFull);
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
  var currentWeatherIcon = currentWeather.weather[0].icon;
  var currentWeatherMain = currentWeather.weather[0].main;

  // current weather dom declarations
  var cityTitleEl = document.getElementById("current-city");
  var cityTempEl = document.getElementById("current-city-temp");
  var cityWindEl = document.getElementById("current-city-wind");
  var cityHumidityEl = document.getElementById("current-city-humidity");
  var cityUvEl = document.getElementById("current-city-uv");

  // assign text content from API search
  cityTitleEl.innerHTML =
    city +
    " (" +
    currentDate.toLocaleDateString() +
    ")<img src='http://openweathermap.org/img/wn/" +
    currentWeatherIcon +
    "@2x.png' alt='" +
    currentWeatherMain +
    "'>";
  cityTempEl.textContent = "Temp: " + currentWeather.temp;
  cityWindEl.textContent = "Wind: " + currentWeather.wind_speed;
  cityHumidityEl.textContent = "Humidity: " + currentWeather.humidity;
  cityUvEl.textContent = "UV Index: " + currentWeather.uvi;

  for (var i = 1; i < 6; i++) {
    var dailyWeather = weather.daily[i];
    var dailyDate = new Date(dailyWeather.dt * 1000);

    console.log(dailyWeather);

    // declare 5-day dom elements
    var cityForecastDate = document.getElementById("day-" + i + "-date");
    var cityForecastTemp = document.getElementById("day-" + i + "-temp");
    var cityForecastWind = document.getElementById("day-" + i + "-wind");
    var cityForecastHumidity = document.getElementById(
      "day-" + i + "-humidity"
    );

    cityForecastDate.innerHTML =
      dailyDate.toLocaleDateString() +
      "<img src='http://openweathermap.org/img/wn/" +
      dailyWeather.weather[0].icon +
      "@2x.png' alt='" +
      dailyWeather.weather[0].main +
      "'>";
    cityForecastTemp.textContent = "Temp: " + dailyWeather.temp.day;
    cityForecastWind.textContent = "Wind: " + dailyWeather.wind_speed;
    cityForecastHumidity.textContent = "Humidity: " + dailyWeather.humidity;
  }
};

var logCityName = function (event) {
  var citySubmit = citySubmitEl.value;

  getCityCoordinates(citySubmit);
  event.preventDefault();

  displayRecent(citySubmit);
};

var displayRecent = function (recentCity) {
  cityArr.unshift(recentCity);

  // set cityArr max to 5
  if (cityArr.length > 5) {
    cityArr.pop();
  }

  saveCities();
  loadCities();
};

var saveCities = function () {
  localStorage.setItem("cities", JSON.stringify(cityArr));
};

var loadCities = function () {
  var recentCitiesEl = document.getElementById("button-container");

  // remove any existing buttons
  while (recentCitiesEl.firstChild) {
    recentCitiesEl.removeChild(recentCitiesEl.firstChild);
  }

  cityArr = JSON.parse(localStorage.getItem("cities"));

  if (!cityArr) {
    cityArr = [];
  }

  cityArr.forEach((element) => {
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute("type", "submit");
    buttonEl.setAttribute(
      "class",
      "search-result btn btn-secondary my-2 w-100"
    );
    buttonEl.textContent = element;
    recentCitiesEl.appendChild(buttonEl);

    buttonEl.addEventListener("click", function () {
      citySubmitEl.value = buttonEl.textContent;
      formEl.requestSubmit();
    });
  });
};

loadCities();
formEl.addEventListener("submit", logCityName);
