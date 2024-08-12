const API_KEY = "B5X3A9338BF4Y23D8NNSRKSPH";

function getCity() {
  let cityInput = document.querySelector(".search");
  city = cityInput.value;
  return city;
}

async function getWeatherData(city) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=days%2Ccurrent%2Chours&key=${API_KEY}&contentType=json`;

  let response = await fetch(url);

  let responseJson = await response.json();
  //   console.log(responseJson);
  return responseJson;
}

function renderMainWeatherData(data) {
  let cityName = document.querySelector(".city");
  let description = document.querySelector(".description");
  let temperature = document.querySelector(".temperature");
  let icon = document.querySelector(".main-icon");
  cityName.textContent = data.city;
  cityName.textContent =
    cityName.textContent[0].toUpperCase() + data.city.substring(1);
  description.textContent = data.condition;
  temperature.textContent = `${data.temperature}°C`;
  icon.src = `./icons/${data.icon}.png`;
}

function RenderHourlyData(data) {
  console.log("data", data);
  let forecast = document.querySelector(".forecast");
  forecast.innerHTML = "";

  data.forEach((hour) => {
    console.log(hour);
    let hourCard = document.createElement("div");
    let cardTime = document.createElement("p");
    cardTime.textContent = hour.dateTime;
    cardTime.classList.add("time");
    let hourIcon = document.createElement("img");
    hourIcon.src = `./icons/${hour.icon}.png`;
    let hourTemp = document.createElement("div");
    hourTemp.classList.add("temp");
    hourTemp.textContent = `${hour.temp}°C`;

    hourCard.appendChild(cardTime);
    hourCard.appendChild(hourIcon);
    hourCard.appendChild(hourTemp);

    forecast.appendChild(hourCard);
  });
}

function RenderSevenDays(data) {
  data.forEach((day) => {
    let dayCard = document.createElement("div");
    dayCard.classList.add("day");
    let date = document.createElement("p");
    date.innerHTML = day.date;
    let weather = document.createElement("div");
    let icon = document.createElement("img");
    icon.src = `./icons/${day.icon}.png`;
    let state = document.createElement("div");
    state.innerText = day.condition;
    weather.appendChild(icon);
    weather.appendChild(state);
    let tempMax = document.createElement("p");
    tempMax.innerText = day.tempmax;
    let tempMin = document.createElement("p");
    tempMin.innerText = day.tempmin;

    dayCard.appendChild(date);
    dayCard.appendChild(weather);
    dayCard.appendChild(tempMax);
    dayCard.appendChild(tempMin);
    document.querySelector(".days").appendChild(dayCard);
  });
}

async function RetriveWeatherData(city) {
  let weatherData = await getWeatherData(city);
  console.log(weatherData);
  let condition = weatherData.currentConditions.conditions;
  let temperature = weatherData.currentConditions.temp;
  let icon = weatherData.currentConditions.icon;
  let tempmax = weatherData.currentConditions.tempmax;
  let tempmin = weatherData.currentConditions.tempmin;
  let uvindex = weatherData.currentConditions.uvindex;
  let windspeed = weatherData.currentConditions.windspeed;
  let address = weatherData.resolvedAddress.split(",")[0];

  renderMainWeatherData({ city: address, condition, temperature, icon });

  let hourlyData = [];

  function pushData(index) {
    let data = weatherData.days[0].hours[index];
    let dateTime = data.datetime;
    let icon = data.icon;
    let temp = data.temp;
    hourlyData.push({ dateTime, icon, temp });
  }

  for (let i = 0; i <= 16; i += 3) {
    pushData(i);
  }
  RenderHourlyData(hourlyData);

  let sevenDay = [];

  for (let i = 0; i < 7; i++) {
    let data = weatherData.days[i];
    let date = data.datetime;
    let icon = data.icon;
    let tempmax = data.tempmax;
    let tempmin = data.tempmin;
    let condition = data.conditions;
    sevenDay.push({ date, icon, tempmax, tempmin, condition });
  }

  RenderSevenDays(sevenDay);

  console.log(sevenDay);
}

async function capture() {
  document.querySelector(".search").addEventListener("keyup", (event) => {
    let key = event.key;
    if (key == "Enter") {
      let city = getCity() || "Cairo";
      RetriveWeatherData(city);
    }
  });
}

capture();

// document.addEventListener("DOMContentLoaded", (e) => {
//   let city = getCity() || "Cairo";
//   RetriveWeatherData(city);
// });

window.onload = (e) => {
  let city = getCity() || "Cairo";
  RetriveWeatherData(city);
};
