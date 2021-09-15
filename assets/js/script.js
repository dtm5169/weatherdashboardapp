function initialize_main(){
let searchStorage = JSON.parse(localStorage.getItem("search")) || [];
let citySearch = document.getElementById("city-search");
let searchButton = document.getElementById("search-button");
let clearButton = document.getElementById("clear-history");
let History = document.getElementById("search-history");
let city_Name = document.getElementById("city-name");
let todayWeather = document.getElementById("today-weather");
let todayTemp = document.getElementById("today-temperature");
let todayHumid = document.getElementById("today-humidity");
let todayWind = document.getElementById("today-wind");
let todayUVI = document.getElementById("today-UVI");
let todayIcon = document.getElementById("weather-icon-today");
let fivedayForecast = document.getElementById('5-day-forecast');


    const API_Key = "a21452e46a01e033140bf735eec1ff6e";

    function getForecast(cityName) {
        let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_Key;
        axios.get(weatherURL)
            .then(function (res) {
                todayWeather.classList.remove("d-none");
                //Date
                const todayDate = new Date(res.data.dt * 1000);
                const day = todayDate.getDate();
                const month = todayDate.getMonth() + 1;
                const year = todayDate.getFullYear();

                //Weather
                city_Name.innerHTML = res.data.name + " (" + month + "/" + day + "/" + year + ") ";

                let currentIcon = res.data.weather[0].icon;

                todayIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
        
                todayTemp.innerHTML = "Temperature: " + k2f(res.data.main.temp) + " &#176F";
                todayHumid.innerHTML = "Humidity: " + res.data.main.humidity + "%";
                todayWind.innerHTML = "Wind Speed: " + res.data.wind.speed + " MPH";
    
                let lon = res.data.coord.lon;
                let lat = res.data.coord.lat;
    
                let uviURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key + "&cnt=1";
                axios.get(uviURL).then(function (res) {
                    let uvIndex = document.createElement("span");
                    if (res.data[0].value < 4) {
                        uvIndex.setAttribute("class", "badge badge-success")
                    }
                    else if (res.data[0].value < 8) {
                        uvIndex.setAttribute("class", "badge badge-warning")
                    }
                    else {
                        uvIndex.setAttribute("class", "badge badge-danger")
                    }
                    uvIndex.innerHTML = res.data[0].value;
                    todayUVI.innerHTML = "UV Index: "
                    todayUVI.append(uvIndex);
                });

                let cityID = res.data.id;
                let fivedayAPI = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + API_Key;
                axios.get(fivedayAPI).then(function (res) {

                    let futureForecast = document.querySelectorAll(".forecast");
                    for (i = 0; i < futureForecast.length; i++) {
                        futureForecast[i].innerHTML = "";
                        var ffIndex = i * 8 + 4;
                        var ffDate = new Date(res.data.list[ffIndex].dt * 1000);
                        var ffDay = ffDate.getDate();
                        var ffMonth = ffDate.getMonth() + 1;
                        var ffYear = ffDate.getFullYear();
                        var ffDateEle = document.createElement("p");

                        ffDateEle.setAttribute("class", "mt-3 mb-0 forecast-date");
                        ffDateEle.innerHTML = ffMonth + "/" + ffDay + "/" + ffYear;
                        futureForecast[i].append(ffDateEle);

                        const ffWeatherEle = document.createElement("img");
                        ffWeatherEle.setAttribute("src", "https://openweathermap.org/img/wn/" + res.data.list[ffIndex].weather[0].icon + "@2x.png");
                        ffWeatherEle.setAttribute("alt", res.data.list[ffIndex].weather[0].description);
                        futureForecast[i].append(ffWeatherEle);
                        const forecastTempEle = document.createElement("p");
                        forecastTempEle.innerHTML = "Temp: " + k2f(res.data.list[ffIndex].main.temp) + " &#176F";
                        futureForecast[i].append(forecastTempEle);
                        const forecastHumidEle = document.createElement("p");
                        forecastHumidEle.innerHTML = "Humidity: " + res.data.list[ffIndex].main.humidity + "%";
                        futureForecast[i].append(forecastHumidEle);
                    }
                })
            });
    }
    // local storage
    searchButton.addEventListener("click", function () {
        const searchCity = citySearch.value;
        getForecast(searchCity);
        searchStorage.push(searchCity);
        localStorage.setItem("search", JSON.stringify(searchStorage));
        renderSearchStorage();
    })

    //clear the city history
    clearButton.addEventListener("click", function () {
        localStorage.clear();
        searchStorage = [];
        renderSearchStorage();
    })

    function renderSearchStorage() {
        History.innerHTML = "";
        for (let i = 0; i < searchStorage.length; i++) {
            const historyEle = document.createElement("input");
            historyEle.setAttribute("type", "text");
            historyEle.setAttribute("readonly", true);
            historyEle.setAttribute("class", "form-control d-block bg-white");
            historyEle.setAttribute("value", searchStorage[i]);
            historyEle.addEventListener("click", function () {
                getForecast(historyEle.value);
            })
            History.append(historyEle);
        }
    }

    renderSearchStorage();
    if (searchStorage.length > 0) {
        getForecast(searchStorage[searchStorage.length - 1]);
    }
    
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }
}

initialize_main();

    
