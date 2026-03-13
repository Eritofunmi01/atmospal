// ============================================================
// weatherApi.js — All OpenWeatherMap API calls live here
// ============================================================

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

/**
 * Fetches current weather for a given city name.
 * @param {string} city
 * @param {string} units - "metric" | "imperial"
 */
export async function fetchCurrentWeather(city, units = "metric") {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) throw new Error("City not found. Please check the spelling and try again.");
    if (res.status === 401) throw new Error("Invalid API key. Check your .env file.");
    throw new Error(`API error: ${res.status} — ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches 5-day / 3-hour forecast for a given city name.
 * @param {string} city
 * @param {string} units - "metric" | "imperial"
 */
export async function fetchForecast(city, units = "metric") {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) throw new Error("City not found. Please check the spelling and try again.");
    if (res.status === 401) throw new Error("Invalid API key. Check your .env file.");
    throw new Error(`API error: ${res.status} — ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches current weather by lat/lon (used for geolocation).
 * @param {number} lat
 * @param {number} lon
 * @param {string} units
 */
export async function fetchWeatherByCoords(lat, lon, units = "metric") {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Location lookup failed: ${res.statusText}`);
  return res.json();
}

/**
 * Fetches 5-day forecast by lat/lon.
 */
export async function fetchForecastByCoords(lat, lon, units = "metric") {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast lookup failed: ${res.statusText}`);
  return res.json();
}