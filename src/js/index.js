import {WEATHER_API_KEY,WEATHER_URL} from './config.js'
import locationImg from '../images/map_855003.png';
const API_Key = WEATHER_API_KEY


//!get location from geo location
const humidityWindOne = document.querySelectorAll(".humidity-wind")[0];
const tempOne = document.querySelectorAll(".temp")[0];
const permission = navigator.geolocation.getCurrentPosition(
    async function(position) {
    
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_Key}`;

        const weather = async () => {
            const response = await fetch(url);
            const data = await response.json();
            if (data) {
                // console.log(data);
                humidityWindOne.style.display = "";
                tempOne.style.display = "";
                const date = new Date(data.dt * 1000);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;
    
                document.querySelector(".loc").innerHTML = `
                <h1>${data.name}, ${data.sys.country}</h1>
                <p>${formattedDate}</p>`;

                tempOne.innerHTML = `
                    <div class="temp-container">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
                        <div class="temp-content">
                            <h4>${data.weather[0].main}</h4>
                            <h1>${Math.round(data.main.temp)}°c</h1>
                            <h4>${Math.round(data.main.temp_min)}°c / ${Math.round(data.main.temp_max)}°c</h4>
                        </div>
                    </div>`;

                humidityWindOne.innerHTML = `
                    <div class="humidity">
                        <div><i class="fa-solid fa-droplet"></i></div>
                        <div><h2>${data.main.humidity}%</h2><span>Humidity</span></div>
                    </div>
                    <div class="wind-speed">
                        <div><i class="fa-solid fa-wind"></i></div>
                        <div><h2>${data.wind.speed} km/h</h2><span>Wind</span></div>
                    </div>
                    <div class="wind-speed">
                        <div class="icon"><i class="fa fa-eye" aria-hidden="true"></i></div>
                        <div><h2>${data.visibility / 1000} km</h2><span>Visibility</span></div>
                    </div>`;
            }
        };

        await weather();
    },
    function(error) {

        tempOne.style.display = "none";
        humidityWindOne.style.display = "none";
        // console.log("hello");
        const left=document.querySelector('.left');
        left.classList.add("active");
        left.innerHTML= `
        <h1>Location is not available to get the weather report plaese allow the current location</h1>`
       
    }
);

//!get location from search
const button = document.querySelector("#search-btn");
const humidityWind = document.querySelectorAll(".humidity-wind")[1];

const temparatureBox=document.querySelectorAll(".temparature-box")[0];
button.addEventListener("click", () => {
    const city = document.querySelector(".search").value;
    checkWeather(city);
});
 
document.querySelectorAll('.search')[0].addEventListener("keydown", () => {
    if(event.key === 'Enter') {
        const city = document.querySelector(".search").value;
        checkWeather(city);
    }
   
})

document.addEventListener("DOMContentLoaded", () => {
    if (!button.clicked) {
        humidityWind.style.display = "none";
        // temp.style.display = "none";
    }
});

const urlBase = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_Key}`;

const checkWeather = async (city) => {
    try {
        const response = await fetch(`${urlBase}&q=${city}`);
        const data = await response.json();
        // console.log(data);
        if (data) {
            document.querySelector(".location").style.display = "";

            document.querySelector(".location").innerHTML = `<h2>${data.name},${data.sys.country}</h2>`;
            humidityWind.style.display = "";
            // temp.style.display = "";

            temparatureBox.innerHTML = `
            <div class="temp">
              <div class="temp-container">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
                    <div class="temp-content">
                        <h4>${data.weather[0].main}</h4>
                        <h1>${Math.round(data.main.temp)}°c</h1>
                        <h4>${Math.round(data.main.temp_min)}°c / ${Math.round(data.main.temp_max)}°c</h4>
                    </div>
                </div></div>
              `;

            humidityWind.innerHTML = `
                <div class="humidity">
                    <div><i class="fa-solid fa-droplet"></i></div>
                    <div><h2>${data.main.humidity}%</h2><span>Humidity</span></div>
                </div>
                <div class="wind-speed">
                    <div><i class="fa-solid fa-wind"></i></div>
                    <div><h2>${data.wind.speed} km/h</h2><span>Wind</span></div>
                </div>
                <div class="wind-speed">
                    <div class="icon"><i class="fa fa-eye" aria-hidden="true"></i></div>
                    <div><h2>${data.visibility / 1000} km</h2><span>Visibility</span></div>
                </div>`;
        }
    } catch (error) {
        document.querySelector(".location").style.display = "none";
        temparatureBox.innerHTML=`<div class="not-found">
        <img src=${locationImg}/>
        </div>
        <h3>City Not Found</h3>
        `
        humidityWind.innerHTML =""

    }
};
