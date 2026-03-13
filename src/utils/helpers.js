// ============================================================
// helpers.js — Pure utility functions
// ============================================================

/**
 * Debounce: delays calling `fn` until `delay` ms have passed
 * since the last invocation. Used on the search input.
 */
export function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Convert Celsius to Fahrenheit.
 */
export const toFahrenheit = (c) => Math.round((c * 9) / 5 + 32);

/**
 * Convert Fahrenheit to Celsius.
 */
export const toCelsius = (f) => Math.round(((f - 32) * 5) / 9);

/**
 * Format a Unix timestamp to a short weekday string.
 * @param {number} unixTs - Unix timestamp (seconds)
 * @returns {string} e.g. "Mon", "Tue"
 */
export function formatDay(unixTs) {
  return new Date(unixTs * 1000).toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Format a Unix timestamp to a readable date.
 * @param {number} unixTs
 * @returns {string} e.g. "Jul 14"
 */
export function formatDate(unixTs) {
  return new Date(unixTs * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns a gradient class name based on the weather condition id.
 * OpenWeather condition codes: https://openweathermap.org/weather-conditions
 */
export function getWeatherGradient(conditionId, isDay = true) {
  if (!conditionId) return "gradient-default";
  if (conditionId >= 200 && conditionId < 300) return "gradient-thunderstorm";
  if (conditionId >= 300 && conditionId < 400) return "gradient-drizzle";
  if (conditionId >= 500 && conditionId < 600) return "gradient-rain";
  if (conditionId >= 600 && conditionId < 700) return "gradient-snow";
  if (conditionId >= 700 && conditionId < 800) return "gradient-mist";
  if (conditionId === 800) return isDay ? "gradient-clear-day" : "gradient-clear-night";
  if (conditionId > 800) return "gradient-clouds";
  return "gradient-default";
}

/**
 * Groups the 3-hour forecast list into daily buckets,
 * returning one representative entry per day (max 5 days).
 * Picks the midday (12:00) reading when available.
 */
export function groupForecastByDay(list) {
  const days = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0]; // "2024-07-14"

    if (!days[dayKey]) {
      days[dayKey] = [];
    }
    days[dayKey].push(item);
  });

  // For each day pick the 12:00 entry or the middle one
  return Object.entries(days)
    .slice(0, 5)
    .map(([, entries]) => {
      const midday = entries.find((e) => new Date(e.dt * 1000).getHours() === 12);
      const rep = midday || entries[Math.floor(entries.length / 2)];

      const temps = entries.map((e) => e.main.temp);
      return {
        ...rep,
        tempMax: Math.round(Math.max(...temps)),
        tempMin: Math.round(Math.min(...temps)),
      };
    });
}

/**
 * Returns wind direction as a compass abbreviation.
 * @param {number} deg — degrees (0-360)
 */
export function windDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/**
 * Simple in-memory cache with TTL (10 min).
 */
const cache = new Map();
const TTL = 10 * 60 * 1000; // 10 minutes

export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function cacheSet(key, data) {
  cache.set(key, { data, ts: Date.now() });
}