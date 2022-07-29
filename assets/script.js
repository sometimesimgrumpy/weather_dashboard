//define elements
var cityNameText = document.getElementById("city-name");
var temperatureText = document.getElementById("temperature");
var windText = document.getElementById("wind");
var humidityText = document.getElementById("humidity");
var weatherIcon = document.getElementById("weather-icon");
var uvIndexText = document.getElementById("uv-index");
var searchForm = document.getElementById("search");
var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");

var apiKey = "ec0a797efaebf445c668b2e3e33670a7";

var searchedCities = [];

//click function to button/form
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var city = searchInput.value;
  console.log(city);

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=imperial"
  )
    .then((response) => response.json())
    .then((data) => showWeatherData(data));

  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      apiKey
  )
    .then((response) => response.json())
    .then((data) => getUVIndex(data));
});

//display weather data in main section
function showWeatherData(data) {
  var name = data.name;
  var icon = data.weather[0].icon;
  var speed = data.wind.speed;
  var temp = data.main.temp;
  var humidity = data.main.humidity;

  console.log(name, icon, temp, humidity, speed);

  cityNameText.innerText = name;
  temperatureText.innerText = Math.floor(temp);
  weatherIcon.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
  windText.innerText = Math.floor(speed);
  humidityText.innerText = humidity;
}

//pass the data to get the uv index
function getUVIndex(data) {
  var { lon, lat } = data[0];
  console.log(lon, lat);

  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      apiKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon
  )
    .then((response) => response.json())
    .then((data) => pass(data));

  // display the uv index text
  function pass(data) {
    var { value } = data;
    console.log(value);

    uvIndexText.innerText = value;
    uvColor(value);
  }
}

//conditional formatting for the UVindex
function uvColor() {
  if (uvIndexText.textContent <= 2) {
    uvIndexText.classList.add("bg-success");
  } else if (uvIndexText.textContent >= 3 && uvIndexText.textContent < 5) {
    uvIndexText.classList.add("bg-warning");
  } else if (uvIndexText.textContent >= 5) {
    uvIndexText.classList.add("bg-danger");
  } else {
    return;
  }
}

function showFiveDays(data) {}

//uvColor()
