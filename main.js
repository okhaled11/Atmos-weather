// Scroll to Top Button
const scrollBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Toast Notifications
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = {
        success: "fa-check-circle",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
    };

    toast.innerHTML = `
    <i class="fa-solid ${iconMap[type]}"></i>
    <span>${message}</span>
    <button class="close">&times;</button>
    `;

    container.appendChild(toast);

    const timeout = setTimeout(() => toast.remove(), 4000);
    toast.querySelector(".close").addEventListener("click", () => {
        clearTimeout(timeout);
        toast.remove();
    });
}

// Elements & State
const cityInpt = document.getElementById("city_input");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const apiKey = "9bd2a3de71da42aace9623643269e672";
const currentWeather = document.querySelectorAll(".weather-left .card")[0];
const fiveDaysFore = document.querySelector(".day-forecast");
const aqiCard = document.querySelectorAll(".highlights .card")[0];
const sunCard = document.querySelectorAll(".highlights .card")[1];
const humidityVal = document.getElementById("humidityval");
const pressureVal = document.getElementById("pressureval");
const visibilityVal = document.getElementById("visibilityval");
const windSpeedVal = document.getElementById("windSpeedval");
const feelsVal = document.getElementById("feelsval");
const hourlyForecastCard = document.querySelector(".hourly-forecast");
const aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

// Fetch & Display Weather Data
function getWeatherDetails(name, lat, lon, country, state) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const AIR_POL_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Air Quality
    fetch(AIR_POL_API_URL)
        .then(res => res.json())
        .then(data => {
            const { co, no, no2, o3, so2, pm2_5, pm10 } = data.list[0].components;
            const aqiIndex = Math.trunc(data.list[0].main.aqi);
            aqiCard.innerHTML = `
            <div class="card-head">
            <p>Air Quality Index</p>
            <p class="air-index aqi-${aqiIndex}">${aqiList[aqiIndex - 1]}</p>
            </div>
            <div class="air-indices">
            <i class="fa-solid fa-wind fa-3x"></i>
            ${[
                    ["PM2.5", pm2_5],
                    ["PM10", pm10],
                    ["SO2", so2],
                    ["CO", co],
                    ["NO", no],
                    ["NO2", no2],
                    ["O3", o3]
                ].map(([label, val]) => `
                <div class="item">
                <p>${label}</p>
                <h3>${val.toFixed(1)}</h3>
                </div>
            `).join("")}
            </div>
        `;
        })
        .catch(() => {
            showToast("Failed to fetch air quality index", "error");
        });

    // Current Weather & Sunrise/Sunset
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const date = new Date();
            currentWeather.innerHTML = `
            <div class="current-weather">
            <div class="details">
                <p>Now in <span class="city-name">${name}</span></p>
                <h2>${Math.trunc(data.main.temp)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
            </div>
            </div>
            <hr />
            <div class="card-footer">
            <p><i class="fa-regular fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}</p>
            <p><i class="fas fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;

            const { sunrise, sunset } = data.sys;
            const { timezone, visibility } = data;
            const { humidity, pressure, feels_like } = data.main;
            const { speed: windSpeed } = data.wind;

            const sRiseTime = moment.utc(sunrise, "X")
                .add(timezone, "seconds")
                .format("hh:mm A");
            const sSetTime = moment.utc(sunset, "X")
                .add(timezone, "seconds")
                .format("hh:mm A");

            sunCard.innerHTML = `
        <div class="card-head">
          <p>Sunrise & Sunset</p>
        </div>
        <div class="sunrise-sunset">
          <div class="item">
            <div class="icon">
              <img src="./images/sunrise (1).png" alt="sunrise" width="50" />
            </div>
            <div>
              <p>Sunrise</p>
              <h3>${sRiseTime}</h3>
            </div>
          </div>
          <div class="item">
            <div class="icon">
              <img src="./images/sunset.png" alt="sunset" width="60" />
            </div>
            <div>
              <p>Sunset</p>
              <h3>${sSetTime}</h3>
            </div>
          </div>
        </div>
      `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hpa`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)} km`;
            windSpeedVal.innerHTML = `${windSpeed} m/s`;
            feelsVal.innerHTML = `${Math.trunc(feels_like)}&deg;C`;
        })
        .catch(() => {
            showToast("Failed to fetch current weather", "error");
        });

    // Forecast
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            // Hourly Forecast
            const hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = "";
            for (let i = 0; i <= 7; i++) {
                const dt = new Date(hourlyForecast[i].dt_txt);
                let hr = dt.getHours();
                const period = hr < 12 ? "AM" : "PM";
                if (hr === 0) hr = 12;
                if (hr > 12) hr -= 12;

                hourlyForecastCard.innerHTML += `
          <div class="card">
            <p>${hr} ${period}</p>
            <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="" />
            <p>${hourlyForecast[i].main.temp.toFixed(0)}&deg;C</p>
          </div>
        `;
            }

            // Five‑day Forecast
            const uniqueDays = [];
            const fiveDf = data.list.filter(forecast => {
                const day = new Date(forecast.dt_txt).getDate();
                return !uniqueDays.includes(day) && uniqueDays.push(day);
            });

            fiveDaysFore.innerHTML = "";
            for (let i = 1; i < fiveDf.length; i++) {
                const dt = new Date(fiveDf[i].dt_txt);
                fiveDaysFore.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${fiveDf[i].weather[0].icon}.png" alt="" />
              <span>${Math.trunc(fiveDf[i].main.temp)}&deg;C</span>
            </div>
            <p>${dt.getDate()} ${months[dt.getMonth()]}</p>
            <p>${days[dt.getDay()]}</p>
          </div>
        `;
            }
        })
        .catch(() => {
            showToast("Failed to fetch weather forecast", "error");
        });
}

// Geocoding & Event Listeners
function getCityCoord() {
    const cityName = cityInpt.value.trim();
    cityInpt.value = "";
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            const { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            showToast(`Failed to fetch coordinates of ${cityName}`, "error");
        });
}

function getUserCoord() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    const { name, country, state } = data[0];
                    getWeatherDetails(name, latitude, longitude, country, state);
                })
                .catch(() => {
                    showToast("Failed to connect to your location", "error");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                showToast("Location permission denied, please reset location permission", "error");
            }
        }
    );
}

searchBtn.addEventListener("click", getCityCoord);
locationBtn.addEventListener("click", getUserCoord);
cityInpt.addEventListener("keyup", e => e.key === "Enter" && getCityCoord());
window.addEventListener("load", getUserCoord);




