const apiKey = "7faf298c372fa761af0612574989e682";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const suggestionsContainer = document.querySelector('.suggestions');

async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else{
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if(data.weather[0].main == "Clouds"){
            weatherIcon.src = "Images/cloudy.png";
        }
        else if(data.weather[0].main == "Clear"){
            weatherIcon.src = "Images/sun.png";
        }
        else if(data.weather[0].main == "Rain"){
            weatherIcon.src = "Images/Rain.png";
        }
        else if(data.weather[0].main == "Drizzle"){
            weatherIcon.src = "Images/drizzle.png";
        }
        else if(data.weather[0].main == "Mist"){
            weatherIcon.src = "Images/haze.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

async function fetch7DayForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`);

    if (response.status === 200) {
        const forecastData = await response.json();
        const forecastDetails = document.querySelector('.forecast-details');
        forecastDetails.innerHTML = ''; // Clear previous forecast details

        const today = new Date().getDay(); // Get the current day (0 = Sunday, 6 = Saturday)

        for (let i = 1; i <= 5; i++) {
            const forecast = forecastData.list[i * 8];
            const forecastDay = (today + i) % 7; // Calculate the day index for the forecast
            const forecastDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][forecastDay]; // Get day name
            const forecastIcon = forecast.weather[0].icon;
            const forecastTemp = Math.round(forecast.main.temp);

            const forecastDayElement = document.createElement('div');
            forecastDayElement.classList.add('forecast-day');
            forecastDayElement.innerHTML = `
                <p>${forecastDayName}</p>
                <img src="http://openweathermap.org/img/w/${forecastIcon}.png" alt="Weather Icon">
                <p>${forecastTemp}°C</p>`;

            forecastDetails.appendChild(forecastDayElement);
        }
    } else {
        console.error('Error fetching forecast data');
    }
}

async function fetchCitySuggestions(query) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`);
    if (response.status === 200) {
        const data = await response.json();
        return data.list;
    } else {
        return [];
    }
}

function displayCitySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    suggestions.forEach((city) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = city.name;
        suggestionItem.classList.add('suggestion-item');

        suggestionItem.addEventListener('click', () => {
            searchBox.value = city.name;
            suggestionsContainer.innerHTML = '';
            searchBtn.click(); // Trigger search button click
        });

        suggestionsContainer.appendChild(suggestionItem);
    });
}

function clearSuggestions() {
    suggestionsContainer.innerHTML = '';
}

searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    
    if (query.length >= 2) {
        const suggestions = await fetchCitySuggestions(query);
        displayCitySuggestions(suggestions);
    } else {
        clearSuggestions();
    }
});

const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);
document.querySelector('.date').textContent = formattedDate;

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city !== '') {
        checkWeather(city);
        fetch7DayForecast(city);
        document.querySelector('.forecast').style.display = 'block';
    }
});

checkWeather();