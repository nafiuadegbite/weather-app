const api = {
  key: "7df5b72b8955de9d3bbfb30a36f25901",
  baseurl: "https://api.openweathermap.org/data/2.5/",
  imageurl: "http://openweathermap.org/img/wn/",
};

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

const searchbox = document.querySelector(".search-box");
const search_btn = document.querySelector(".search-btn");
searchbox.addEventListener("keypress", setQuery);
search_btn.addEventListener("click", setQuery);

function setQuery(e) {
  if (e.keyCode == 13) {
    query = searchbox.value;
    getResults({ query: query });
  } else {
    query = searchbox.value;
    getResults({ query: query });
    console.log(query);
  }
}

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

    let data = await response.json();
    console.log(data);

    displayResults(data);
  } catch (error) {
    console.error(error);
  }
}

const displayResults = (data) => {
  const { name, sys, main, weather } = data;

  let city = document.querySelector(".city");
  city.innerHTML = `${name}, ${sys.country}`;

  let temp = document.querySelector(".temp");
  temp.innerHTML = `${Math.floor(main.temp)}<span>℃</span>`;

  let feels_like = document.querySelector(".feels-like");
  feels_like.innerHTML = `Feels like ${Math.floor(
    main.feels_like
  )}<span>℃</span>`;

  let temp_icon = document.querySelector(".temp-icon");
  temp_icon.src = `${api.imageurl}${weather[0].icon}@2x.png`;
  temp_icon.alt = `${weather[0].description}`;

  let temp_description = document.querySelector(".temp-description");
  temp_description.innerHTML = `${weather[0].description}`;

  let hilow = document.querySelector(".hi-low");
  hilow.innerHTML = `${Math.floor(main.temp_min)}℃ / ${Math.floor(
    main.temp_max
  )}℃`;
};

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

(displayDate = () => {
  let now = new Date();
  let date = document.querySelector(".date");
  date.innerHTML = dateBuilder(now);
})();
