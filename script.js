const searchbutton = document.getElementById("button");
const searchInput = document.getElementById("search");
const API = "731c58b4a9b4d9c445930f5744a98024"



function getLocation(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API}`
    fetch(url).then(function (data) {
        return data.json()
    }).then(function (data) {
        console.log(data)
        const lat = data[0].lat
        const lon = data[0].lon
        getCurrent(lat, lon)
    })
}

function getCurrent(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`
    fetch(url).then(function (data) {
        return data.json()
    }).then(function (data) {
        console.log(data)
    })
}
searchbutton.addEventListener("click", function () {
    const searchCity = searchInput.value
    if (searchCity !== "") {
        getLocation(searchCity)
    }
});