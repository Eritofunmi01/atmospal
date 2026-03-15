// ============================================================
// services/weatherApi.js
// API provider: WeatherAPI.com (https://www.weatherapi.com)
//
// ADAPTER PATTERN: All responses are normalized to match the
// shape our components already expect — so no component needs
// to change when the API provider changes.
// ============================================================

const BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY  = import.meta.env.VITE_WEATHER_API_KEY;

// ── Condition code → OWM-style ID (used by getWeatherGradient) ──
// WeatherAPI uses its own codes; we map them to OWM ranges so
// our existing gradient logic keeps working unchanged.
function mapConditionId(code, isDay) {
  if (code === 1000) return isDay ? 800 : 801;                    // Clear / Sunny
  if ([1003, 1006, 1009].includes(code)) return 803;              // Cloudy
  if ([1030, 1135, 1147].includes(code)) return 741;              // Mist / Fog
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 211;  // Thunderstorm
  if ([1066, 1114, 1117, 1210, 1213, 1216,
       1219, 1222, 1225, 1255, 1258].includes(code)) return 601;  // Snow
  if ([1072, 1150, 1153, 1168, 1171].includes(code)) return 300;  // Drizzle
  if (code >= 1180 && code <= 1201) return 500;                   // Rain
  if (code >= 1240 && code <= 1252) return 500;                   // Rain showers
  return 800;
}

// ── Normalize current weather → OWM shape ───────────────────
function normalizeCurrentWeather(data) {
  const c = data.current;
  const l = data.location;

  return {
    name: l.name,
    sys:  { country: l.country },
    main: {
      temp:       c.temp_c,
      feels_like: c.feelslike_c,
      temp_max:   c.temp_c,
      temp_min:   c.temp_c,
      humidity:   c.humidity,
      pressure:   c.pressure_mb,
    },
    weather: [{
      id:          mapConditionId(c.condition.code, c.is_day),
      description: c.condition.text,
      iconUrl:     "https:" + c.condition.icon,
    }],
    wind: {
      speed: parseFloat((c.wind_kph / 3.6).toFixed(1)), // km/h → m/s
      deg:   c.wind_degree,
    },
    visibility: c.vis_km * 1000, // km → metres
    clouds:     { all: c.cloud },
    dt:         l.localtime_epoch,
  };
}

// ── Normalize forecast → list of daily entries ──────────────
function normalizeForecast(data) {
  const list = data.forecast.forecastday.map((day) => {
    const d = day.day;
    return {
      dt:   day.date_epoch,
      main: {
        temp:     d.avgtemp_c,
        humidity: d.avghumidity,
        pressure: 1013,
      },
      weather: [{
        id:          mapConditionId(d.condition.code, 1),
        description: d.condition.text,
        iconUrl:     "https:" + d.condition.icon,
      }],
      tempMax: Math.round(d.maxtemp_c),
      tempMin: Math.round(d.mintemp_c),
    };
  });

  return { list };
}

// ── Error handler ────────────────────────────────────────────
async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg  = body?.error?.message || res.statusText;
    if (res.status === 400) throw new Error("City not found. Please check the spelling and try again.");
    if (res.status === 401 || res.status === 403) throw new Error("Invalid API key. Check your .env file.");
    throw new Error(`API error: ${res.status} — ${msg}`);
  }
  return res.json();
}

// ── Public API functions (same signatures as before) ─────────

export async function fetchCurrentWeather(city, units = "metric") {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
  const raw = await fetch(url).then(handleResponse);
  return normalizeCurrentWeather(raw);
}

export async function fetchForecast(city, units = "metric") {
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;
  const raw = await fetch(url).then(handleResponse);
  return normalizeForecast(raw);
}

export async function fetchWeatherByCoords(lat, lon, units = "metric") {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;
  const raw = await fetch(url).then(handleResponse);
  return normalizeCurrentWeather(raw);
}

export async function fetchForecastByCoords(lat, lon, units = "metric") {
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;
  const raw = await fetch(url).then(handleResponse);
  return normalizeForecast(raw);
}