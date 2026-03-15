// ============================================================
// pages/Home.jsx — AtomsPal Weather Dashboard
// ============================================================
import { useState, useEffect, useCallback } from "react";

import SearchBar      from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastCard   from "./components/ForecastCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage   from "./components/ErrorMessage";

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
} from "../services/weatherApi";

import {
  groupForecastByDay,
  getWeatherGradient,
  cacheGet,
  cacheSet,
} from "../utils/helpers";

const DEFAULT_CITY = "Lagos";

export default function Home() {
  // ── State ────────────────────────────────────────────────
  const [city, setCity]           = useState(DEFAULT_CITY);
  const [weatherData, setWeather] = useState(null);
  const [forecastDays, setForecast] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [unit, setUnit]           = useState("C");
  const [darkMode, setDarkMode]   = useState(
    () => localStorage.getItem("darkMode") !== "false"
  );
  const [gradient, setGradient]   = useState("gradient-default");

  // ── Dark mode ────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ── Core fetch ───────────────────────────────────────────
  const loadWeather = useCallback(async (searchCity) => {
    const units    = unit === "C" ? "metric" : "imperial";
    const cacheKey = `${searchCity.toLowerCase()}-${units}`;

    const cached = cacheGet(cacheKey);
    if (cached) {
      setWeather(cached.current);
      setForecast(cached.forecast);
      setGradient(getWeatherGradient(cached.current.weather[0].id));
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(searchCity, units),
        fetchForecast(searchCity, units),
      ]);
      const days = groupForecastByDay(forecast.list);
      setWeather(current);
      setForecast(days);
      setGradient(getWeatherGradient(current.weather[0].id));
      cacheSet(cacheKey, { current, forecast: days });
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    loadWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (city) loadWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // ── Handlers ─────────────────────────────────────────────
  const handleSearch     = (c) => { setCity(c); loadWeather(c); };
  const handleToggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));
  const handleToggleDark = () => setDarkMode((d) => !d);
  const handleRetry      = () => loadWeather(city);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const units = unit === "C" ? "metric" : "imperial";
        try {
          const [current, forecast] = await Promise.all([
            fetchWeatherByCoords(coords.latitude, coords.longitude, units),
            fetchForecastByCoords(coords.latitude, coords.longitude, units),
          ]);
          const days = groupForecastByDay(forecast.list);
          setCity(current.name);
          setWeather(current);
          setForecast(days);
          setGradient(getWeatherGradient(current.weather[0].id));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please search manually.");
        setLoading(false);
      }
    );
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-all duration-700 ${gradient}`}>

      {/* Animated background blobs */}
      <div className="bg-blob w-[520px] h-[520px] bg-amber-500  -top-40 -left-40"  style={{ animationDuration: "14s" }} />
      <div className="bg-blob w-[400px] h-[400px] bg-orange-600  bottom-0 -right-20" style={{ animationDuration: "10s", animationDelay: "-4s" }} />
      <div className="bg-blob w-[320px] h-[320px] bg-amber-400  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: "18s", animationDelay: "-8s" }} />

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 pb-14">

        {/* ── Header ── */}
        <header className="flex items-center justify-between mb-8">

          {/* AtomsPal Logo */}
          <div className="flex items-center gap-3">

            {/* SVG "A" logo mark */}
            <svg
              width="40" height="40" viewBox="0 0 40 40"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Hexagon background */}
              <path
                d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
                fill="url(#amberGrad)"
              />
              {/* Bold "A" letter */}
              <text
                x="50%" y="72%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Syne, sans-serif"
                fontWeight="800"
                fontSize="20"
                fill="white"
                letterSpacing="-0.5"
              >
                A
              </text>
              {/* Gradient definition */}
              <defs>
                <linearGradient id="amberGrad" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>

            {/* App name */}
            <span className="font-display text-2xl font-extrabold tracking-tight text-white dark:text-white"
              style={{ color: "var(--text-primary)" }}>
              Atoms<span className="text-amber-500">Pal</span>
            </span>
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={handleToggleDark}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="
              flex items-center gap-2 px-4 py-2 rounded-full glass
              font-body text-sm font-medium
              border border-amber-500/30
              text-amber-400 dark:text-amber-400
              hover:bg-amber-500/20 hover:border-amber-500/60
              hover:scale-105 active:scale-95
              transition-all duration-200
            "
            style={{ color: "var(--text-primary)" }}
          >
            {/* Icon */}
            {darkMode ? (
              /* Sun icon for light mode switch */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1"  y1="12" x2="3"  y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64"  y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon for dark mode switch */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
            {darkMode ? "Light" : "Dark"}
          </button>
        </header>

        {/* ── Search ── */}
        <SearchBar
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          loading={loading}
        />

        {/* ── Content ── */}
        <main className="mt-2">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {!loading && !error && weatherData && (
            <>
              <CurrentWeather
                data={weatherData}
                unit={unit}
                onToggleUnit={handleToggleUnit}
              />

              {forecastDays.length > 0 && (
                <section className="mt-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-4"
                    style={{ color: "var(--text-secondary)" }}>
                    5-Day Forecast
                  </h3>


<div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-x-visible
  scrollbar-thin scroll-smooth snap-x snap-mandatory">
  {forecastDays.map((day, i) => (
    <ForecastCard
      key={day.dt}
      item={day}
      unit={unit}
      isToday={i === 0}
    />
  ))}
</div>
                </section>
              )}
            </>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="mt-10 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
          Powered by{" "}
          <a
            href="https://www.weatherapi.com/"
            target="_blank"
            rel="noreferrer"
            className="text-amber-500 hover:underline"
          >
            WeatherApi
          </a>{" "}
          · AtomsPal © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}