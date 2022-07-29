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

var apiKey = "5911de58d825147b5fa891cd55dfb5c0";

var searchedCities = [];

//click function to button/form
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var city = searchInput.value;
  console.log(city);

  //fix link references and nesting
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then(function (data) {
      var lon = data[0].lon;
      var lat = data[0].lat;
      console.log(lon, lat);

      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial
        `
      )
        .then((response) => response.json())
        .then(function (data) {
          showWeatherData(data, city);
          getUVIndex(data);
          showFiveDays(data);
        });
    });
});

//display weather data in main section
function showWeatherData(data, city) {
  var name = city;
  var icon = data.current.weather[0].icon;
  var speed = data.current.wind_speed;
  var temp = data.current.temp;
  var humidity = data.current.humidity;

  console.log(name, icon, temp, humidity, speed);

  cityNameText.innerText = name;
  temperatureText.innerText = Math.floor(temp);
  weatherIcon.src = "https://openweathermap.org/img/w/" + icon + "@2x.png";
  windText.innerText = Math.floor(speed);
  humidityText.innerText = humidity;
}

//pass the data to get the uv index
// display the uv index text
function getUVIndex(data) {
  var uvIndexNum = data.current.uvi;
  console.log(uvIndexNum);

  if (uvIndexNum <= 2) {
    uvIndexText.className = "btn-sm btn-success";
  } else if (uvIndexNum < 5) {
    uvIndexText.className = "btn-sm btn-warning";
  } else {
    uvIndexText.className = "btn-sm btn-danger";
  }
  uvIndexText.innerText = uvIndexNum;
}

function showFiveDays(data) {
  var weatherCard = document.getElementById("weather-card");
  var date = new Date().toLocaleDateString();
  console.log(date);

  for (let i = 0; i < 5; i++) {
    let index = i + 1;
    var icon = data.daily[index].weather[0].icon;
    var temp = data.daily[index].wind_speed;
    var humidity = data.daily[index].humidity;
  }
}
