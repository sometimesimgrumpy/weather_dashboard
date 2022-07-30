//define elements
var cityNameText = document.getElementById("city-name");
var temperatureText = document.getElementById("temperature");
var windText = document.getElementById("wind");
var humidityText = document.getElementById("humidity");
var weatherIcon = document.getElementById("main-weather-icon");
var uvIndexText = document.getElementById("uv-index");
var searchForm = document.getElementById("search");
var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");
var cityHistory = document.getElementById("cities-history");

var apiKey = "5911de58d825147b5fa891cd55dfb5c0";

//empty array for local storage
var searchedCities = [];

//show current seattle weather first
init();

//click function to search button
searchBtn.addEventListener("click", handleCitySearch);

//refactor this handler so it can pass the historical search cities
function handleCitySearch(event) {
  event.preventDefault();
  var search = searchInput.value.trim();
  getData(search);
}

function getData(city) {
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
          showFiveDays(data, city);
          savedCities(city);
        });
    });
}

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
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  windText.innerText = Math.floor(speed);
  humidityText.innerText = humidity;
}

//pass the data to get the uv index
// display the uv index text
function getUVIndex(data) {
  var uvIndexNum = data.current.uvi;
  console.log(uvIndexNum);

  //conditionally change the color of the index number displayed based on conditions
  if (uvIndexNum <= 2) {
    uvIndexText.className = "btn-sm btn-success";
  } else if (uvIndexNum < 5) {
    uvIndexText.className = "btn-sm btn-warning";
  } else {
    uvIndexText.className = "btn-sm btn-danger";
  }
  uvIndexText.innerText = uvIndexNum;
}

//return 5 day forecast into the elements
function showFiveDays(data) {
  for (let i = 0; i < 5; i++) {
    let index = i + 1;
    var dayJS = dayjs();
    var date = dayJS.add(index, "d").format("MM/DD/YY");

    var icon = data.daily[index].weather[0].icon;
    var temp = data.daily[index].temp.day;
    var wind = data.daily[index].wind_speed;
    var humidity = data.daily[index].humidity;

    document.getElementById(`date${i}`).innerHTML = date;
    document.getElementById(`date${index}`).innerHTML = date;
    document.getElementById(`temp${index}`).innerHTML = Math.floor(temp);
    document.getElementById(
      `weather-icon${index}`
    ).src = `https://openweathermap.org/img/w/${icon}.png`;
    document.getElementById(`wind${index}`).innerHTML = Math.floor(wind);
    document.getElementById(`humid${index}`).innerHTML = humidity;
  }
}

//save cities in local storage
function savedCities(city) {
  console.log("test");
  if (localStorage.getItem("searchedCities") !== null) {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    console.log("not null");
  }
  while (searchedCities.length > 9) {
    searchedCities.pop();
    console.log("test");
  }
  for (let i = 0; i < searchedCities.length; i++) {
    console.log("loop search city length");
    if (city === searchedCities[i]) {
      return;
    }
  }
  // fix the order of the saved cities so they cascade properly
  console.log("reverse push reverse");
  searchedCities.reverse();
  searchedCities.push(city);
  searchedCities.reverse();

  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
  console.log("test set item");
  updateCities();
}

//save previously searched cities and update buttons
function updateCities() {
  if (searchedCities.length < 10) {
    console.log("test update cities");
    let button = document.createElement("button");
    button.innerHTML = searchedCities[0];

    console.log(button.innerHTML);

    button.setAttribute("class", "d-block p-auto btn btn-secondary my-2");
    cityHistory.append(button);
  } else {
    for (let i = 0; i < 10; i++) {
      button.innerHTML = searchedCities[i];
    }
  }
  //makes history buttons clickable
  cityHistory.addEventListener("click", function (event) {
    //get city text from button itself
    var city = event.target.innerText;
    getData(city);
    console.log(`saved city: ${city}`);
  });
}

//show current seattle weather first before search
function init() {
  getData("Seattle");
}
