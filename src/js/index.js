import { WEATHER_API_KEY, WEATHER_URL } from "./config.js";
import locationImg from "../images/map_855003.png";

const API_Key = WEATHER_API_KEY;

/* ===================== DEBOUNCE ===================== */
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ===================== ELEMENTS ===================== */
const tempOne = document.querySelectorAll(".temp")[0];
const humidityWindOne = document.querySelectorAll(".humidity-wind")[0];

const button = document.querySelector("#search-btn");
const searchInput = document.querySelector(".search");
const temparatureBox = document.querySelector(".temparature-box");
const humidityWind = document.querySelectorAll(".humidity-wind")[1];
const suggestionBox = document.getElementById("suggestions");

/* ===================== LOADER ===================== */
const showLoader = () => {
  temparatureBox.innerHTML = `<div class="loader">Loading...</div>`;
};

/* ===================== GEO LOCATION WEATHER ===================== */
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;
    const url = `${WEATHER_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_Key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data) return;

    humidityWindOne.style.display = "";
    tempOne.style.display = "";

    const date = new Date(data.dt * 1000);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    document.querySelector(".loc").innerHTML = `
      <h1>${data.name}, ${data.sys.country}</h1>
      <p>${formattedDate}</p>
    `;

    tempOne.innerHTML = `
      <div class="temp-container">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
        <div class="temp-content">
          <h4>${data.weather[0].main}</h4>
          <h1>${Math.round(data.main.temp)}°C</h1>
          <h4>${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°</h4>
        </div>
      </div>
    `;

    humidityWindOne.innerHTML = `
      <div class="humidity">
        <i class="fa-solid fa-droplet"></i>
        <div><h2>${data.main.humidity}%</h2><span>Humidity</span></div>
      </div>
      <div class="wind-speed">
        <i class="fa-solid fa-wind"></i>
        <div><h2>${data.wind.speed} km/h</h2><span>Wind</span></div>
      </div>
      <div class="wind-speed">
        <i class="fa fa-eye"></i>
        <div><h2>${data.visibility / 1000} km</h2><span>Visibility</span></div>
      </div>
    `;
  },
  () => {
    document.querySelector(".left").classList.add("active");
    document.querySelector(".left").innerHTML = `
      <h1>Please allow location access to see weather</h1>
    `;
  }
);

/* ===================== SEARCH WEATHER ===================== */
const urlBase = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_Key}`;

const checkWeather = async (city) => {
  try {
    showLoader();
    const res = await fetch(`${urlBase}&q=${city}`);
    const data = await res.json();

    if (data.cod !== 200) throw new Error();

    document.querySelector(".location").innerHTML = `<h2>${data.name}, ${data.sys.country}</h2>`;
    humidityWind.style.display = "";

    temparatureBox.innerHTML = `
      <div class="temp">
        <div class="temp-container">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
          <div class="temp-content">
            <h4>${data.weather[0].main}</h4>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <h4>${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°</h4>
          </div>
        </div>
      </div>
    `;

    humidityWind.innerHTML = `
      <div class="humidity">
        <i class="fa-solid fa-droplet"></i>
        <div><h2>${data.main.humidity}%</h2><span>Humidity</span></div>
      </div>
      <div class="wind-speed">
        <i class="fa-solid fa-wind"></i>
        <div><h2>${data.wind.speed} km/h</h2><span>Wind</span></div>
      </div>
      <div class="wind-speed">
        <i class="fa fa-eye"></i>
        <div><h2>${data.visibility / 1000} km</h2><span>Visibility</span></div>
      </div>
    `;
  } catch {
    temparatureBox.innerHTML = `
      <div class="not-found">
        <img src="${locationImg}" />
        <h3>City Not Found</h3>
      </div>
    `;
    humidityWind.innerHTML = "";
  }
};

/* ===================== CITY SUGGESTIONS ===================== */
const fetchCitySuggestions = async (query) => {
  if (!query) {
    suggestionBox.style.display = "none";
    return;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_Key}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.length) {
    suggestionBox.style.display = "none";
    return;
  }

  suggestionBox.innerHTML = data
    .map(
      (city) => `
      <div class="suggestion-item" data-city="${city.name}">
        ${city.name}, ${city.country}
      </div>
    `
    )
    .join("");

  suggestionBox.style.display = "block";
};

const debouncedSearch = debounce(fetchCitySuggestions);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

suggestionBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion-item")) {
    const city = e.target.dataset.city;
    searchInput.value = city;
    suggestionBox.style.display = "none";
    checkWeather(city);
  }
});

button.addEventListener("click", () => {
  checkWeather(searchInput.value);
});
