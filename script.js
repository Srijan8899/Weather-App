const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
// initially vairables need
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");

getfromSessionStorage();
function switchTab(newTab) {
  // color changing with this grey
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");
  }
  // if search form is not visible , we make it visible and hide others
  if (!searchForm.classList.contains("active")) {
    //hide others and active searchform
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.add("active");
  } else {
    // i am in search tab , now i need go to your weather tab
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");

    //coordinates check and display because we are on your weather tab , we check local storage for coordinates
    getfromSessionStorage();
  }
}

userTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  switchTab(searchTab);
});

// check if cordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  // if local coordiantes not found
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, long } = coordinates;
  // grantacces make unvisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  // API Call

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    // remove loading
    loadingScreen.classList.remove("active");
    // show weather
    userInfoContainer.classList.add("active");
    // it display in screen the given data by API Call
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    console.log("Error , NOt Found");
  }
}

function renderWeatherInfo(weatherInfo) {
  // firstly we have to fetch the elements all present in screen

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDescription = document.querySelector("[data-weatherDescription]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temperature = document.querySelector("[data-temperature]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // now put in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  userCoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener("click", getLocation);

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    // remove loading
    loadingScreen.classList.remove("active");
    // show weather
    userInfoContainer.classList.add("active");
    // it display in screen the given data by API Call
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    console.log("Error , NOt Found");
  }
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") return;
  else{
    fetchSearchWeatherInfo(searchInput.value);
  }
 
});
