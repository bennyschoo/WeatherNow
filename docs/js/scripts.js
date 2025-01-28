// 
// This is the code for updating the weather data on the page
// 
// 

fetch("./js/data.json").then(response => response.json()).then( data => {
    var currentCity = "Halifax";
    var cities = data;

    function getCityData(city){
        for(let i=0; i<cities.length; i++){
            if(cities[i].name == city){
                return cities[i];
            }
        }
    }

    async function getWeatherData(cityData, timeframe){
        let latitude = cityData.latitude
        let longitude = cityData.longitude
        let url = ``;
        if(timeframe == "daily"){
            url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,weather_code,is_day,wind_speed_10m&daily=temperature_2m_max,precipitation_probability_max,sunrise,sunset,precipitation_sum,rain_sum,temperature_2m_min,uv_index_max,wind_speed_10m_max,snowfall_sum&timezone=auto&forecast_days=1`
        }
        else if(timeframe = "sevenday"){
            url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=&daily=temperature_2m_max,weather_code,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max`
        }
        let response = await fetch(url, {
            method: "GET"
        });
        let data = await response.json();
        return data;
    }


    // Index is used to determine what day the weather data is for, if it's not 
    // daily data, specify -1 for index.
    // For some status', the weather codes are used to determined the status of the weather.
    // The meaning of the weather codes can be found here: https://open-meteo.com/en/docs
    function getStatusCode(weatherData, index){
        let basePath = "./assets/"
        if(index==-1){
            if(weatherData.weather_code<=77 && weatherData.weather_code>=72){
                return { 
                    "imgPath":basePath + "white-snowing.png",
                    "status":"Snowing" 
                };
            }
            if(weatherData.weather_code<=67 && weatherData.weather_code>=51){
                return { 
                    "imgPath":basePath + "white-rainy.png",
                    "status":"Rainy" 
                };
            }
            if(weatherData.wind_speed_10m>28){
                return { 
                    "imgPath":basePath + "white-windy.png",
                    "status":"Windy" 
                };
            }
            if(weatherData.cloud_cover>50){
                return {
                    "imgPath":basePath + "white-cloudy.png",
                    "status":"Cloudy"
                };
            }
            if(weatherData.is_day==1){
                return { 
                    "imgPath":basePath + "white-sunny.png",
                    "status":"Sunny" 
                };
            }
            else{
                return { 
                    "imgPath":basePath + "white-moon.png",
                    "status":"Clear Skies" 
                };
            }
        }

        if(index>-1){
            if(weatherData.weather_code[index]<=77 && weatherData.weather_code[index]>=72){
                return { 
                    "imgPath":basePath + "white-snowing.png",
                    "status":"Snowing" 
                };
            }
            if(weatherData.weather_code[index]<=67 && weatherData.weather_code[index]>=51){
                return { 
                    "imgPath":basePath + "white-rainy.png",
                    "status":"Rainy" 
                };
            }
            if(weatherData.wind_speed_10m_max[index]>22){
                return { 
                    "imgPath":basePath + "white-windy.png",
                    "status":"Windy" 
                };
            }
            return { 
                "imgPath":basePath + "white-sunny.png",
                "status":"Sunny" 
            };
            
        }
    }



    function updateTitle(cityData){
        let titleContainer = document.querySelector("#city-title-container");

        let title = document.createElement("h1");
        title.textContent = cityData.name;
        title.id = "city-title";
        title.classList = "m-sm-2 mx-auto";
        titleContainer.innerHTML = "";
        titleContainer.appendChild(title);
    }



    function updateCurrentStatus(weatherData){
        let currentStatsContainer = document.querySelector("#current-stats-container");
        currentStatsContainer.innerHTML = "";

        let stats = [];
        for(let i=0; i<4; i++){
            stats[i] = document.createElement("h5");
            stats[i].classList = "stat-text my-2 mx-auto";
            currentStatsContainer.appendChild(stats[i]);
        }

        stats[0].textContent = "Feels like: " + weatherData.current.apparent_temperature + weatherData.current_units.apparent_temperature;
        stats[1].textContent = "Cloud Cover: " + weatherData.current.cloud_cover + "%";
        stats[2].textContent = "Wind Speed: " + weatherData.current.wind_speed_10m + weatherData.current_units.wind_speed_10m;
        stats[3].textContent = "Humidity: " + weatherData.current.relative_humidity_2m + "%";


        let currentStatusContainer = document.querySelector("#current-weather-status-container");
        currentStatusContainer.innerHTML = "";
        
        let currentStatus = document.createElement("h3");
        let currentTemp = document.createElement("h3");
        

        currentStatus.classList = "m-auto my-sm-4 my-2";
        currentTemp.classList = "m-auto my-sm-4 my-2";

        currentStatus.textContent = getStatusCode(weatherData.current, -1).status;
        currentTemp.textContent = weatherData.current.temperature_2m + weatherData.current_units.temperature_2m;

        currentStatusContainer.appendChild(currentStatus);
        currentStatusContainer.appendChild(currentTemp);
    }



    function updateWeatherIcon(weatherData){
        let statusIcon = document.querySelector("#weather-status-icon");
        let weatherCode = weatherData.current.weather_code;
        let isDay = weatherData.current.is_day;
        let status = getStatusCode(weatherData.current, -1);
        statusIcon.src = status.imgPath;
    }



    async function updateDailyStats(weatherData){
        let statsContainer = document.querySelector("#daily-stats-container");
        statsContainer.innerHTML = '<h2 class="m-auto my-1 fw-bold" id="daily-stats-title">Daily Stats</h2>';
        let stats = [];
        for(let i=0; i<10; i++){
            stats[i] = document.createElement("h5");
            stats[i].classList = "stat-text mx-auto my-2";
            statsContainer.appendChild(stats[i]);
        }
        

        stats[0].textContent = "Max Temp: " + weatherData.daily.temperature_2m_max + weatherData.daily_units.temperature_2m_max;
        stats[1].textContent = "Min Temp: " + weatherData.daily.temperature_2m_min + weatherData.daily_units.temperature_2m_min;
        stats[2].textContent = "Rain: " + weatherData.daily.rain_sum + weatherData.daily_units.rain_sum;
        stats[3].textContent = "Snowfall: " + weatherData.daily.snowfall_sum + weatherData.daily_units.snowfall_sum;
        stats[4].textContent = "Wind Speed: " + weatherData.daily.wind_speed_10m_max + weatherData.daily_units.wind_speed_10m_max;
        stats[5].textContent = "UV Index: " + weatherData.daily.uv_index_max;
        stats[6].textContent = "Sunrise: " + weatherData.daily.sunrise[0].substring(11, 16);
        stats[7].textContent = "Sunset: " + weatherData.daily.sunset[0].substring(11, 16);
        stats[8].textContent = "Precipitation Chance: " + weatherData.daily.precipitation_probability_max + "%";
        stats[9].textContent = "Precipitation: " + weatherData.daily.precipitation_sum + weatherData.daily_units.precipitation_sum;
    }

    async function updateWeatherSection(cityData){
        
        updateTitle(cityData);
        let weatherData = await getWeatherData(cityData, "daily");
        updateCurrentStatus(weatherData);
        updateWeatherIcon(weatherData);
        updateDailyStats(weatherData);
    }

    async function updateSevenDay(cityData){
        let sevenDayContainer = document.querySelector("#sevenday-container");
        sevenDayContainer.innerHTML = '';
        let weatherData = await getWeatherData(cityData, "sevenday");
        let sevenDayItems = [];

        for(let i=0; i<7; i++){
            sevenDayItems[i] = document.createElement("div");
            sevenDayItems[i].classList = "sevenday-item d-flex flex-column align-items-center border p-1 rounded m-2";
            sevenDayContainer.appendChild(sevenDayItems[i]);

        
            let dayHeader = document.createElement("h4");
            let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
            let weekday = weekdays[new Date(weatherData.daily.time[i]).getDay()];
            let month = months[new Date(weatherData.daily.time[i]).getMonth()];
            dayHeader.innerText = weekday + ", " + month + " " + (new Date(weatherData.daily.time[i]).getDate() + 1);
            sevenDayItems[i].appendChild(dayHeader);

            let dataDiv = document.createElement("div");
            dataDiv.classList = "d-flex flex-xl-column flex-md-row flex-sm-column flex-row align-items-center m-1";
            sevenDayItems[i].appendChild(dataDiv);

            let imgSection = document.createElement("div");
            imgSection.classList = "d-flex flex-column align-items-center";
            dataDiv.appendChild(imgSection);

            let img = document.createElement("img");
            let status = getStatusCode(weatherData.daily, i);
            img.src = status.imgPath;
            img.alt = "'Current Date' weather status icon";
            img.classList = "sevenday-img m-3";
            imgSection.appendChild(img);

            let statusText = document.createElement("h5");
            statusText.innerText = status.status;
            statusText.classList = "fw-bold";
            imgSection.appendChild(statusText);


            let statsDiv = document.createElement("div");
            statsDiv.classList = "d-flex flex-column align-items-center m-2";
            dataDiv.appendChild(statsDiv);

            let stats = [];
            for(let j=0; j<5; j++){
                stats[j] = document.createElement("p");
                statsDiv.appendChild(stats[j]);
            }
            stats[0].textContent = "High: " + weatherData.daily.temperature_2m_max[i] + weatherData.daily_units.temperature_2m_max;
            stats[1].textContent = "Low: " + weatherData.daily.temperature_2m_min[i] + weatherData.daily_units.temperature_2m_min;
            stats[2].textContent = "Precipitation: " + weatherData.daily.precipitation_sum[i] + weatherData.daily_units.precipitation_sum;
            stats[3].textContent = "Snowfall: " + weatherData.daily.snowfall_sum[i] + weatherData.daily_units.snowfall_sum;
            stats[4].textContent = "Wind Speed: " + Math.round(weatherData.daily.wind_speed_10m_max[i]) + weatherData.daily_units.wind_speed_10m_max;
        }
    }

    function updatePage(cityName){
        currentCity = cityName;
        updateWeatherSection(getCityData(cityName));
        updateSevenDay(getCityData(cityName));
    }

    updatePage(currentCity);



    // 
    // This is the code for the search bar
    // 
    //
    let searchInput = document.getElementById("search-bar");
    let searchSuggestions = document.getElementById("search-suggestions");

    //Make sure the search suggestions stay under the search bar
    function updatePosition(){
        setTimeout(() => {
        let results = document.getElementById("search-suggestions");
        let searchBarBottom = document.getElementById("search-bar").getBoundingClientRect().bottom;
        results.style = `top:${searchBarBottom + 5}px;`;
        }, 50);
    }

    //Get the names of all the cities
    var cityNames=[];
    for(let i=0; i<cities.length; i++){
        cityNames.push(cities[i].name);
    }

    //Update the search suggestions based on the search bar value
    function updateResults(){
        let searchValue = document.getElementById("search-bar").value;
        let resultsList = document.getElementById("results-list");
        resultsList.innerHTML = "";

        for(let i=0; i<cityNames.length; i++){
            

            if(cityNames[i].toLowerCase().substring(0,searchValue.length) == searchValue.toLowerCase() ||searchValue == "" ){
                let result = document.createElement("li");
                result.innerHTML = cityNames[i];
                result.classList = "nav-item text-secondary ms-1 my-2 result-item";
                result.addEventListener("click", () => {
                    document.getElementById("search-bar").value = cityNames[i];
                    updatePage(cityNames[i]);
                    searchSuggestions.style.display = "none";
                });
                resultsList.appendChild(result);
            }
        }

        if(resultsList.innerHTML == ""){
            let result = document.createElement("li");
            result.innerHTML = "No results";
            result.classList = "nav-item text-secondary ms-1 my-2";
            resultsList.appendChild(result);
        }
        updatePosition();
    }

    //appropriate event listeners for each function
    searchInput.addEventListener("input", updateResults);
    searchInput.addEventListener("focus", updateResults);
    window.addEventListener("resize", updatePosition);



    //Make sure the search suggestions stop displaying when not focused on the search bar
    searchInput.addEventListener("focus", () => {
        searchSuggestions.style.display = "block";
    });

    searchInput.addEventListener("focusout", () => {
        setTimeout(() => {
            searchSuggestions.style.display = "none";
        }, 100);
    });

    //when submitted, update the page and clear the search bar
    document.querySelector("#search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        let results = document.getElementById("results-list").children;

        if(results[0] != undefined && results[0].innerHTML != "No results"){
            updatePage(results[0].innerHTML);
            searchInput.value = "";
            searchSuggestions.style.display = "none";
        }
    });
    updatePosition();


// 
// This is the code for the favourites feature
// 
// 
    var favourites = [];
    let addToFavouritesButton = document.getElementById('add-favourite-btn');
    let favouritesList = document.getElementById('favourites-list');
    let cityTitle = document.querySelector("#city-title-container");
    let favouritesImgButton = document.getElementById('favourites-img-button');

    //learned about MutationObserver from a post on stackoverflow
    //Post can be found here: https://stackoverflow.com/questions/36561100/addeventlistener-detect-changes-in-div-elements
    let observer = new MutationObserver(updateButtonIcon);

    observer.observe(cityTitle, {childList: true});

    //Add the current city to the favourites list and update the button icon
    addToFavouritesButton.addEventListener('click', function() {
        let currentlyFavourite = false
        favouritesList.innerHTML = '';

        for (let i = 0; i < favourites.length; i++) {
            if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
                currentlyFavourite = true;
                favourites.splice(i, 1);
                favouritesImgButton.src = './assets/white-star.png';
            }
        }
        if (!currentlyFavourite) {
            favourites.push(currentCity);
            favouritesImgButton.src = './assets/white-check.png';
        }
        if(favourites.length == 0){
            let li = document.createElement('li');
            li.textContent = 'No favourites';
            li.classList = "m-2";
            favouritesList.appendChild(li);
        }
        for (let i = 0; i < favourites.length; i++) {
            let li = document.createElement('li');
            li.textContent = favourites[i];
            li.classList = "dropdown-item";
            li.addEventListener("click", ()=>{
                updatePage(favourites[i]);
            });
            favouritesList.appendChild(li);
        }
        setLocalStorage();
        console.log(localStorage.getItem('favourites'));
    });


    function setLocalStorage() {
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    function getLocalStorage() {
        if (localStorage.getItem('favourites')) {
            favourites = JSON.parse(localStorage.getItem('favourites'));
        }
    }

    function updateButtonIcon(){
        for (let i = 0; i < favourites.length; i++) {
            if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
                favouritesImgButton.src = './assets/white-check.png';
                return;
            }
        }
        favouritesImgButton.src = './assets/white-star.png';
    }

    //Fill the favourites list with the current favourites
    function fillFavouritesList(){
        favouritesList.innerHTML = '';
        if(favourites.length == 0){
            let li = document.createElement('li');
            li.textContent = 'No favourites';
            li.classList = "m-2";
            favouritesList.appendChild(li);
        }
        for (let i = 0; i < favourites.length; i++) {
            let li = document.createElement('li');
            li.textContent = favourites[i];
            li.classList = "dropdown-item";
            li.addEventListener("click", ()=>{
                updatePage(favourites[i]);
            });
            favouritesList.appendChild(li);
        }
    }

    //Get the favourites from local storage and update the button icon
    window.addEventListener('load', getLocalStorage);
    window.addEventListener('load', () => {setTimeout(updateButtonIcon, 100)});
    window.addEventListener('load', () => {setTimeout(fillFavouritesList, 100)});

});
