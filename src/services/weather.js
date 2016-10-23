const AppId = "52860324ba08510b19e6b8d432fc4950";
const BaseUrl = "http://api.openweathermap.org/data/2.5/weather?appid=" + AppId;

export default {

  getWeatherInfo(units) {
    return getCurrentPosition().then(fetchWeather.bind(this, units));
  }

}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({coords}) => resolve(coords),
      ({code, message}) => reject(`Error getting current position Error(${code}): ${message}`)
    );
  });
}

function fetchWeather(units, {latitude, longitude}) {
  return fetch(`${BaseUrl}&lat=${latitude}&lon=${longitude}&units=${units}`).then(
    (response) => response.ok ? response.json() : Promise.reject("Error getting weather information"),
    (error) => Promise.reject("Error getting weather information")
  );
}
