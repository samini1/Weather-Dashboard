let currentTemp =document.querySelector("#temperature");
let currentWind =document.querySelector("#wind");
let currentHumidity = document.querySelector("#humidity");
let currentUV = document.querySelector("#uvIndex")
let cityName = document.querySelector("#city-name");
let now = moment().format('M/D/YYYY');
let searchEl = document.querySelector('#search-btn');
let inputEl = document.querySelector("#city-search");
let historyEl = document.querySelector("#history");
let searchHistory =JSON.parse(localStorage.getItem("search") || "[]");


let apiKey= "49aaa9cebdeb3319c68121d355139835";
//get weather api for search

let displaySearchHistory = function(){
    historyEl.innerHTML = "";
    //loop through search history
    for (let i=0; i<searchHistory.length; i++) {
        let prevSearch = document.createElement("button");
        prevSearch.textContent = searchHistory[i];
        prevSearch.setAttribute("type", "button");
        prevSearch.setAttribute("class", "history-btn btn");
        //allow user to call using previous search
        prevSearch.addEventListener("click", function() {
            findCity(searchHistory[i]);
        //display under search form   
    }) 
    historyEl.append(prevSearch);
}
}

if (searchHistory.length>0) {
    findCity(searchHistory[searchHistory.length-1]);
    displaySearchHistory();
} else {(findCity("San Antonio"))
};


function displayWeather(lat, lon) {
        
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,&appid=" + apiKey;
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            console.log(data);
            // weather info from response
            let WeatherEl = document.createElement("img");
            WeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
            WeatherEl.setAttribute("alt",data.current.weather[0].description);
            cityName.append(WeatherEl);
            let farenheit = ((data.current.temp -273.15) * 9/5 + 32).toFixed(1);
            let celsius = (data.current.temp -273.15).toFixed(1);
            //current info
            currentTemp.textContent = "Temperature: "+ farenheit + '\u00B0' + "F"  + "/" + celsius + '\u00B0' + "C" ;
            currentWind.textContent = "Wind Speed: " + data.current.wind_speed + "MPH" ;
            currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
            currentUV.textContent = "UV Index: " + data.current.uvi;    
            
            //five day forecast appended through for loop
            let forecastEls = document.querySelectorAll(".forecast");

            for (let i=0; i<forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";                             
                // console.log(forecastEls[i])

                let forecastDateEl = document.createElement("p");            
                forecastDateEl.innerHTML = moment().add(i, 'days').format('M/D/YYYY');
                forecastEls[i].append(forecastDateEl);

                let forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt",data.daily[i].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);

                let farenheitF = ((data.daily[i].temp.day - 273.15) * 9/5 + 32).toFixed(1);
                let celsiusF = (data.daily[i].temp.day - 273.15).toFixed(1);
                
                let forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temperature: "+ (farenheitF) + '\u00B0' + "F"  + "/" + celsiusF + '\u00B0' + "C" ;
                forecastEls[i].append(forecastTempEl);

                let forecastWindEl = document.createElement("p");
                forecastWindEl.innerHTML = "Wind Speed: " + data.daily[i].wind_speed + "MPH" ;
                forecastEls[i].append(forecastWindEl);

                let forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
                forecastEls[i].append(forecastHumidityEl);                

            }
        })      
    });
};

// call city info using search input to access longitude and latitude

function findCity (searchInput) {
    let searchURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&appid=' + apiKey;       

    fetch(searchURL)
        .then(function(response) {
        response.json().then(function(data){            
            let lat = data[0].lat;
            let lon = data[0].lon;            
            //add city name and current date
            cityName.textContent = data[0].name + " (" + now + ")";
            //call display weather with latitude and longitude values obtained from search function
            displayWeather(lat, lon) 
        
        });
       
    });
    
}


// push previous search results to display below search bar

// let displaySearchHistory = function() {
//     displayWeather(searchHistory[searchHistory.length]);
// }

//5-day forecast



searchEl.addEventListener("click", function() {
    let searchInput = inputEl.value;
    console.log(inputEl.value);
    //run search paramaters through first api call function to get lon and lat
    findCity(searchInput);
    //push search into search history
    searchHistory.push(searchInput);
    //save searchHistory array as JSON string
    localStorage.setItem("search",JSON.stringify(searchHistory));
    //display updated search history from local storage
    displaySearchHistory();
})

