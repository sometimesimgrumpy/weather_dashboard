var cityNameText = document.querySelector('.city-name')
var temperatureText = document.querySelector('#temperature')
var windText = document.querySelector('#wind')
var humidityText = document.querySelector('#humidity')
var weatherIcon = document.querySelector('.weather-icon')
var uvIndexText = document.querySelector('#uv-index')

var weather = {
    apiKey: "018014f6ca200b5c0f974433f44b03ea",
    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + this.apiKey + "&units=imperial")
        .then((response) => response.json())
        .then((data) => this.showWeatherData(data))
    },
    showWeatherData: function(data) {
        var { name } = data
        var { icon } = data.weather[0]
        var { speed } = data.wind
        var { temp, humidity } = data.main
        
        console.log(name, icon, temp, humidity, speed)

        cityNameText.innerText = name
        temperatureText.innerText = Math.floor(temp)
        weatherIcon.src = "https://openweatehrmap.org/img/wn/" + icon + ".png"
        windText.innerText = Math.floor(speed)
        humidityText.innerText = humidity

    }
}