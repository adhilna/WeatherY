let id = '9505fd1df737e20152fbd78cdb289b6a';
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id;
let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (valueSearch.value !== '') {
        fetchWeatherByCity(valueSearch.value);
    }
});

const fetchWeatherByCity = (cityName) => {
    fetch(`${baseUrl}&q=${cityName}`)
        .then(response => response.json())
        .then(updateWeatherData)
        .catch(handleError);
};

const fetchWeatherByCoords = (lat, lon) => {
    fetch(`${baseUrl}&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(updateWeatherData)
        .catch(handleError);
};

const updateWeatherData = (data) => {
    if (data.cod === 200) {
        city.querySelector('figcaption').innerText = data.name;
        city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
        temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        temperature.querySelector('span').innerText = `${data.main.temp}°C`;
        description.innerText = data.weather[0].description;

        clouds.innerText = `${data.clouds.all}`;
        humidity.innerText = `${data.main.humidity}`;
        pressure.innerText = `${data.main.pressure} `;
    } else {
        handleError();
    }
};

const handleError = () => {
    main.classList.add('error');
    setTimeout(() => {
        main.classList.remove('error');
    }, 1000);
};


// Get current location using Geolocation API
const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
                // Fallback to a default location if geolocation fails
                fetchWeatherByCity('Washington');
            }
        );
    } else {
        console.error('Geolocation not supported by this browser.');
        fetchWeatherByCity('Washington'); // Fallback if geolocation isn't supported
    }
};



// Initialize App
const initApp = () => {
    getCurrentLocationWeather();
};
initApp();

const darkModeToggle = document.getElementById('darkModeToggle');
const mainSection = document.querySelector('main');

darkModeToggle.addEventListener('click', () => {
    mainSection.classList.toggle('dark-mode');
});




// for place suggstions

// const apiKey = "9e4b05aa0123402e844d0cbd7c93f0bb"; // Your API key
// const inputField = document.getElementById('name'); // The search input field
// const suggestionBox = document.createElement('ul'); // Container for suggestions
// document.body.appendChild(suggestionBox); // Add it to the body or another container

// inputField.addEventListener('input', function () {
//     const query = inputField.value.trim();

//     // Only make the API request if the query is not empty
//     if (query) {
//         fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&language=en&limit=5`)
//             .then(response => response.json())
//             .then(data => {
//                 suggestionBox.innerHTML = '';
//                 if (data.results && data.results.length) {
//                     data.results.forEach(result => {
//                         const suggestion = document.createElement('li');
//                         suggestion.textContent = result.formatted;
//                         suggestion.addEventListener('click', () => {
//                             inputField.value = result.formatted;
//                             suggestionBox.innerHTML = ''; // Clear suggestions after selection
//                         });
//                         suggestionBox.appendChild(suggestion);
//                     });
//                 } else {
//                     suggestionBox.innerHTML = 'No results found.';
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//                 suggestionBox.innerHTML = 'Error fetching data.';
//             });
//     } else {
//         suggestionBox.innerHTML = ''; // Clear suggestions when input is empty
//     }
// });

// // Styling for the suggestions box
// suggestionBox.style.position = 'absolute';
// suggestionBox.style.top = '50px'; // Adjust based on input field's position
// suggestionBox.style.left = '0';
// suggestionBox.style.width = '100%';
// suggestionBox.style.backgroundColor = '#fff';
// suggestionBox.style.border = '1px solid #ccc';
// suggestionBox.style.listStyle = 'none';
// suggestionBox.style.padding = '0';
// suggestionBox.style.margin = '0';
// suggestionBox.style.zIndex = '1000';
// suggestionBox.style.maxHeight = '200px';
// suggestionBox.style.overflowY = 'auto';
