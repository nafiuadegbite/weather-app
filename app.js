//===============GLOBAL VARIABLES===============
const api = {
  key: "7df5b72b8955de9d3bbfb30a36f25901",
  baseurl: "https://api.openweathermap.org/data/2.5/",
  imageurl: "https://openweathermap.org/img/wn/",
};

//=================DOM ELEMENTS=================
const searchbox = document.querySelector(".search-box");
const search_btn = document.querySelector(".search-btn");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const feels_like = document.querySelector(".feels-like");
const temp_icon = document.querySelector(".temp-icon");
const temp_description = document.querySelector(".temp-description");
const hilow = document.querySelector(".hi-low");

//==================DATE BUILDER=================
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
};

(function displayDate() {
  let now = new Date();
  let date = document.querySelector(".date");
  date.innerHTML = dateBuilder(now);
})();

//==================WEATHER DATA=================
async function getResults({ query, lat, lon }) {
  try {
    let response;
    if (query) {
      response = await fetch(
        `${api.baseurl}weather?q=${query}&units=metric&appid=${api.key}`
      );
    } else {
      response = await fetch(
        `${api.baseurl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`
      );
    }

    const data = await response.json();

    displayResults(data);
  } catch (error) {
    console.error(error);
  }
}

//==================GET LOCATION=================
window.addEventListener("load", () => {
  let lon;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      getResults({ lat: lat, lon: lon });
    });
  }
});

//===================DISPLAY RESULTS===============
const displayResults = (data) => {
  const { name, sys, main, weather } = data;

  city.innerHTML = `${name}, ${sys.country}`;

  temp.innerHTML = `${Math.floor(main.temp)}<span>℃</span>`;

  feels_like.innerHTML = `Feels like ${Math.floor(
    main.feels_like
  )}<span>℃</span>`;

  temp_icon.src = `${api.imageurl}${weather[0].icon}@2x.png`;
  temp_icon.alt = `${weather[0].description}`;

  temp_description.innerHTML = `${weather[0].description}`;

  hilow.innerHTML = `${Math.floor(main.temp_min)}℃ / ${Math.floor(
    main.temp_max
  )}℃`;
};

//===================SEARCH QUERY==================
const setQueryAfterKeypress = (e) => {
  if (e.keyCode == 13) {
    query = searchbox.value;
    getResults({ query: query });
  }
};

const setQueryAfterClick = (e) => {
  query = searchbox.value;
  getResults({ query: query });
};

searchbox.addEventListener("keypress", setQueryAfterKeypress);
search_btn.addEventListener("click", setQueryAfterClick);
