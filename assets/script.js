const cities = [];
const cityFormEl = document.querySelector("#city-search-form");
const cityInputEl = document.querySelector("#city");
const weatherContainerEl = document.querySelector("#current-weather-container");
const citySearchInputEl = document.querySelector("#searched-city");
const forecastTitle = document.querySelector("#forecast");
const forecastContainerEl = document.querySelector("#fiveday-container");
const pastSearchButtonEl = document.querySelector("#past-search-buttons");

const formSumbitHandler = function (event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

const saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

const getCityWeather = function (city) {
    let apiKey = "731c58b4a9b4d9c445930f5744a98024"
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city);
            });
        });
};

const displayWeather = function (weather, searchCity) {

    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    console.log(weather);

    const currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    const weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    const temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    const humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    const windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    //append to container
    weatherContainerEl.appendChild(temperatureEl);

    weatherContainerEl.appendChild(humidityEl);

    weatherContainerEl.appendChild(windSpeedEl);

    const lat = weather.coord.lat;
    const lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

const getUvIndex = function (lat, lon) {
    let apiKey = "731c58b4a9b4d9c445930f5744a98024"
    let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUvIndex(data)
                // console.log(data)
            });
        });
    console.log(lat);
    console.log(lon);
}

const displayUvIndex = function (index) {
    let uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate "
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
}

const get5Day = function (city) {
    let apiKey = "731c58b4a9b4d9c445930f5744a98024"
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data);
            });
        });
};

const display5Day = function (weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    const forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        let dailyForecast = forecast[i];


        let forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        console.log(dailyForecast)

        let forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

        let weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        forecastEl.appendChild(weatherIcon);

        let forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        forecastEl.appendChild(forecastTempEl);

        let forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        forecastEl.appendChild(forecastHumEl);
        console.log(forecastEl);

        forecastContainerEl.appendChild(forecastEl);
    }

}

const pastSearch = function (pastSearch) {

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


const pastSearchHandler = function (event) {
    let city = event.target.getAttribute("data-city")
    if (city) {
        getCityWeather(city);
        get5Day(city);
    }
}


cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);


// const searchbutton = document.getElementById("button");
// const searchInput = document.getElementById("search");
// const API = "731c58b4a9b4d9c445930f5744a98024"
// // const date = moment().format('dddd, MMMM Do YYYY');
// // const dateTime = moment().format('YYYY-MM-DD HH:MM:SS')



// function getLocation(city) {
//     const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API}`
//     fetch(url).then(function (data) {
//         return data.json()
//     }).then(function (data) {
//         console.log(data)
//         const lat = data[0].lat
//         const lon = data[0].lon
//         getCurrent(lat, lon)
//     })
// }
// function getCurrent(lat, lon) {
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`
//     fetch(url).then(function (data) {
//         return data.json()
//     }).then(function (data) {
//         console.log(data)
//     })
// }
// searchbutton.addEventListener("click", function () {
//     const searchCity = searchInput.value
//     if (searchCity !== "") {
//         getLocation(searchCity)
//     }
// });