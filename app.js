//===============GLOBAL VARIABLES===============
const api = {
  key: "7df5b72b8955de9d3bbfb30a36f25901",
  baseurl: "https://api.openweathermap.org/data/2.5/",
  imageurl: "https://openweathermap.org/img/wn/",
};

//=================DOM ELEMENTS=================
const location_btn = document.querySelector(".location-btn");
const searchbox = document.querySelector(".search-box");
const search_btn = document.querySelector(".search-btn");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const feels_like = document.querySelector(".feels-like");
const temp_icon = document.querySelector(".temp-icon");
const temp_description = document.querySelector(".temp-description");
const hilow = document.querySelector(".hi-low");
const date = document.querySelector(".date");
const humidity = document.querySelector(".humidity");
const dew_point = document.querySelector(".dew-point");
const pressure = document.querySelector(".pressure");
const uv_index = document.querySelector(".uv-index");
const visibility = document.querySelector(".visibility");

//==================DATE=========================
const dateBuilder = (d, timezone) => {
  const milliseconds = d * 1000;

  const now = new Date(milliseconds);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  };

  dateTime = now.toLocaleString("en-US", options);

  return dateTime;
};

//==================WEATHER DATA=================
async function getResults({ query, lat, lon }) {
  try {
    let response;
    let req_query;
    let query_response;
    let city;
    let res_country;
    let max_temp;
    let min_temp;

    if (query) {
      req_query = await fetch(
        `${api.baseurl}weather?q=${query}&units=metric&appid=${api.key}`
      );
      query_response = await req_query.json();
      const { lat, lon } = query_response.coord;
      const {
        name,
        sys: { country },
        main: { temp_max, temp_min },
      } = query_response;
      city = name;
      res_country = country;
      max_temp = temp_max;
      min_temp = temp_min;
      response = await fetch(
        `${api.baseurl}onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&units=metric&appid=${api.key}`
      );
    } else {
      req_query = await fetch(
        `${api.baseurl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`
      );
      query_response = await req_query.json();
      const {
        name,
        sys: { country },
        main: { temp_max, temp_min },
      } = query_response;
      city = name;
      res_country = country;
      max_temp = temp_max;
      min_temp = temp_min;
      response = await fetch(
        `${api.baseurl}onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&units=metric&appid=${api.key}`
      );
    }

    const data = await response.json();
    data.name = city;
    data.country = res_country;
    data.temp_max = max_temp;
    data.temp_min = min_temp;

    localStorage.setItem("weather", JSON.stringify(data));

    displayResults(data);
  } catch (error) {
    console.error(error);
  }
}

//===================RESULTS=======================
const results = (current, timezone, name, country, temp_max, temp_min) => {
  city.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${name}, ${country}`;

  date.innerHTML = dateBuilder(current.dt, timezone);

  temp.innerHTML = `${Math.floor(current.temp)}<span>℃</span>`;

  feels_like.innerHTML = `Feels like ${Math.floor(
    current.feels_like
  )}<span>℃</span>`;

  temp_icon.src = `${api.imageurl}${current.weather[0].icon}@2x.png`;

  temp_icon.alt = `${current.weather[0].description}`;

  temp_description.innerHTML = `${current.weather[0].description}`;

  hilow.innerHTML = `<i class="fas fa-long-arrow-alt-up"></i> ${Math.floor(
    temp_max
  )}℃ / <i class="fas fa-long-arrow-alt-down"></i> ${Math.floor(temp_min)}℃`;

  humidity.innerHTML = `${current.humidity}%`;

  dew_point.innerHTML = `${current.dew_point}℃`;

  pressure.innerHTML = `${current.pressure} mBar`;

  uv_index.innerHTML = `${current.uvi}`;

  visibility.innerHTML = `${current.visibility / 1000} km`;
};

//===================DISPLAY RESULTS===============
const displayResults = (data) => {
  const { current, timezone, name, country, temp_max, temp_min } = data;
  results(current, timezone, name, country, temp_max, temp_min);
};

//===================LOCAL STORAGE=================
(function displayResultsFromLocal() {
  if (localStorage.getItem("weather") !== null) {
    let weatherData = JSON.parse(localStorage.getItem("weather"));

    const {
      current,
      timezone,
      name,
      country,
      temp_max,
      temp_min,
    } = weatherData;

    results(current, timezone, name, country, temp_max, temp_min);
  }
})();

//===================GET LOCATION==================
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
  }
};

const getPosition = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const currentPosition = { lat: lat, lon: lon };

  getResults(currentPosition);
};

location_btn.addEventListener("click", getLocation);
location_btn.addEventListener("click", () => {
  location_btn.remove();
});

//===================SEARCH QUERY==================
const getQuery = () => {
  query = searchbox.value;
  queryResult = { query: query };
  getResults(queryResult);
};

const setQueryAfterKeypress = (e) => {
  if (e.keyCode == 13) {
    getQuery();
  }
};

const setQueryAfterClick = () => {
  getQuery();
};

searchbox.addEventListener("keypress", setQueryAfterKeypress);
search_btn.addEventListener("click", setQueryAfterClick);

//==================SERVICE WORKER==================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
//==================================================