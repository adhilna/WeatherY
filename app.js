// --- API Setup ---
const API_KEY = '9505fd1df737e20152fbd78cdb289b6a';
let currentUnit = 'metric';

// --- DOM Elements ---
const cityNameElem = document.getElementById('cityName');
const countryFlagElem = document.getElementById('countryFlag');
const weatherIconElem = document.getElementById('weatherIcon');
const tempElem = document.getElementById('temp');
const weatherDescElem = document.getElementById('weatherDesc');
const cloudsElem = document.getElementById('clouds');
const humidityElem = document.getElementById('humidity');
const pressureElem = document.getElementById('pressure');
const windSpeedElem = document.getElementById('windSpeed');
const visibilityElem = document.getElementById('visibility');
const uvIndexElem = document.getElementById('uvIndex');
const form = document.getElementById('weatherForm');
const valueSearch = document.getElementById('name');
const main = document.querySelector('main');
const resultSection = document.getElementById('resultSection');
const darkModeToggle = document.getElementById('darkModeToggle');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesPanel = document.getElementById('favorites');
const addToFavorites = document.getElementById('addToFavorites');
const forecastDays = document.getElementById('forecastDays');
const refreshBtn = document.getElementById('refreshBtn');
const unitButtons = document.querySelectorAll('.unit-btn');
const input = document.getElementById('name');
const suggestionBox = document.getElementById('suggestionBox');

// --- Floating Particles ---
function createParticles() {
    const container = document.querySelector('.floating-particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}

// --- Dark Mode ---
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('darkMode', isDark);
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// --- Unit Toggle ---
unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        unitButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.dataset.unit;
        if (cityNameElem.textContent) {
            fetchWeatherByCity(cityNameElem.textContent);
        }
    });
});

// --- Favorites ---
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
favoritesToggle.addEventListener('click', () => {
    favoritesPanel.classList.toggle('show');
});
addToFavorites.addEventListener('click', () => {
    const cityName = cityNameElem.textContent;
    if (!favorites.includes(cityName)) {
        favorites.push(cityName);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        updateFavoritesList();
        addToFavorites.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
});
function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    favorites.forEach(city => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <span>${city}</span>
            <button style="background: none; border: none; color: white; cursor: pointer;">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        item.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            favorites = favorites.filter(fav => fav !== city);
            localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
            updateFavoritesList();
        });
        item.addEventListener('click', () => {
            valueSearch.value = city;
            fetchWeatherByCity(city);
            favoritesPanel.classList.remove('show');
        });
        favoritesList.appendChild(item);
    });
}
updateFavoritesList();

// --- Refresh ---
refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 500);
    if (cityNameElem.textContent) {
        fetchWeatherByCity(cityNameElem.textContent);
    }
});

// --- Weather Fetching ---
async function fetchWeatherByCity(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.cod !== 200) {
            weatherDescElem.textContent = "City not found.";
            return;
        }
        updateWeatherData(data);
        fetchUVIndex(data.coord.lat, data.coord.lon);
        fetchForecast(city);
    } catch (e) {
        weatherDescElem.textContent = "Error fetching weather.";
    }
}
function updateWeatherData(data) {
    cityNameElem.textContent = data.name;
    countryFlagElem.src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
    weatherIconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    tempElem.textContent = Math.round(data.main.temp);
    weatherDescElem.textContent = data.weather[0].description;
    cloudsElem.textContent = data.clouds.all;
    humidityElem.textContent = data.main.humidity;
    pressureElem.textContent = data.main.pressure;
    windSpeedElem.textContent = data.wind.speed;
    visibilityElem.textContent = data.visibility ? (data.visibility / 1000).toFixed(1) : "-";
    addToFavorites.innerHTML = favorites.includes(data.name)
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
}

// --- UV Index (placeholder, as OWM's new free API does not provide a direct UV endpoint) ---
function fetchUVIndex(lat, lon) {
    uvIndexElem.textContent = "-"; // Placeholder
    // To get real UV index, use a third-party API or OWM's One Call API (requires paid plan)
}

// --- Forecast (placeholder, you can implement real forecast with OWM's /forecast endpoint) ---
async function fetchForecast(city) {
    // First, get city coordinates from current weather API
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`;
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();
    if (!currentData.coord) return;

    const { lat, lon } = currentData.coord;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;
    const res = await fetch(forecastUrl);
    const data = await res.json();

    // Group forecast list by day
    const days = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
    });

    // Only keep the next 5 days
    const dayKeys = Object.keys(days).slice(0, 5);

    // Build forecast HTML
    let html = '';
    dayKeys.forEach(date => {
        const items = days[date];
        // Get min/max temp for the day
        const temps = items.map(i => i.main.temp);
        const min = Math.round(Math.min(...temps));
        const max = Math.round(Math.max(...temps));

        // Pick the icon and description from the midday forecast if possible, else first
        const midday = items[Math.floor(items.length / 2)];
        const icon = midday.weather[0].icon;
        const desc = midday.weather[0].main;

        // Format day name
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

        html += `
            <div class="forecast-day">
                <div>${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" style="width:40px; height:40px; margin:0.5rem 0;">
                <div>${max}°/${min}°</div>
            </div>
        `;
    });

    forecastDays.innerHTML = html;
}


// --- Form Submission ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = valueSearch.value.trim();
    if (city) {
        fetchWeatherByCity(city);
        valueSearch.value = '';
    }
});

// --- On Page Load ---
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    fetchWeatherByCity('London');
});

input.addEventListener('input', async function() {
    const query = input.value.trim();
    if (query.length < 2) {
        suggestionBox.innerHTML = '';
        return;
    }
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const res = await fetch(url);
    const places = await res.json();
    suggestionBox.innerHTML = '';
    places.forEach(place => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`;
        item.addEventListener('click', () => {
            input.value = item.textContent;
            suggestionBox.innerHTML = '';
            // Optionally, store place.lat and place.lon for weather queries
        });
        suggestionBox.appendChild(item);
    });
});
