let currentTemp =document.querySelector("#temperature");
let currentWind =document.querySelector("#wind");
let currentHumidity = document.querySelector("#humidity");
let currentUV = document.querySelector("#uvIndex")
let cityName = document.querySelector("#city-name");
let now = moment().format('M/D/YYYY');
let searchEl = document.querySelector('#search-btn');
let inputEl = document.querySelector("#city-search");
let searchHistory =JSON.parse(localStorage.getItem("search"))

apiKey= "49aaa9cebdeb3319c68121d355139835";
//get weather api for search

function displayWeather(lat, lon) {
        
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,&appid=" + apiKey;
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            console.log(data);
            // weather info from response
        let farenheit = ((data.current.temp -273.15) * 9/5 + 32).toFixed(1);
        let celsius = (data.current.temp -273.15).toFixed(1);
        currentTemp.textContent = "Temperature: "+ farenheit +"F/" + celsius + "C";
        currentWind.textContent = "Wind Speed: " + data.current.wind_speed + "MPH" ;
        currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
        currentUV.textContent = "UV Index: " + data.current.uvi;    
        
        //five day forecast
        let forecastEls = document.querySelectorAll(".forecast");

        for (i=1; i<forecastEls.length; i++) {
            forecastEls[i].

        }
        })
        
        

        //date info
         
          
    });
};

// let searchURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&appid=' + apiKey;

function findCity () {
    let searchURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + "paris" + '&appid=' + apiKey;
    console.log(searchURL)    

    fetch(searchURL)
        .then(function(response) {
        response.json().then(function(data){
            console.log(data);
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log(lat);
            console.log(lon); 

            cityName.textContent = data[0].name;
            displayWeather(lat, lon) 
        
        });
       
    });
    
}

findCity();




//push previous search results to display below search bar

let displaySearchHistory = function() {
    displayWeather(searchHistory[searchHistory.length]);
}

//5-day forecast

searchEl.addEventListener("click", function() {
    let searchInput = inputEl.value;
    displayWeather(searchInput);
    searchHistory.push(searchInput);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    displaySearchHistory();
})

