// ============================================================
// components/CurrentWeather.jsx
// ============================================================
import { windDirection } from "../../utils/helpers";

export default function CurrentWeather({ data, unit, onToggleUnit }) {
  if (!data) return null;

  const { name, sys, main, weather, wind, visibility, clouds } = data;
  const condition  = weather[0];
  const iconUrl    = condition.iconUrl;
  const unitSymbol = unit === "C" ? "°C" : "°F";

  const temp      = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const high      = Math.round(main.temp_max);
  const low       = Math.round(main.temp_min);
  const windDir   = windDirection(wind.deg);
  const visKm     = visibility ? (visibility / 1000).toFixed(1) : "N/A";

  return (
    <div className="glass p-7 mb-6 fade-in">

      {/* City + date */}
      <div className="flex items-start justify-between flex-wrap gap-2 mb-7">
        <div className="flex items-center gap-2">
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h2 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {name}, {sys.country}
          </h2>
        </div>
        <p className="text-sm self-end" style={{ color: "var(--text-secondary)" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Temp + icon */}
      <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
        <div className="flex items-start leading-none">
          <span
            className="font-display font-extrabold"
            style={{ fontSize: "clamp(5rem, 14vw, 8rem)", letterSpacing: "-4px", color: "var(--text-primary)" }}
          >
            {temp}
          </span>
          <button
            onClick={onToggleUnit}
            className="unit-toggle"
            title={`Switch to °${unit === "C" ? "F" : "C"}`}
            aria-label="Toggle temperature unit"
          >
            {unitSymbol}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <img
            src={iconUrl}
            alt={condition.description}
            className="w-24 h-24 drop-shadow-[0_4px_14px_rgba(245,158,11,0.4)]"
          />
          <p className="text-sm capitalize" style={{ color: "var(--text-secondary)" }}>
            {condition.description}
          </p>
          <p className="text-sm font-medium">
            <span className="text-amber-500">▲ {high}°</span>
            <span className="mx-1" style={{ color: "var(--text-secondary)" }}>/</span>
            <span className="text-slate-400">▼ {low}°</span>
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <StatCard icon="💧" label="Humidity"    value={`${main.humidity}%`} />
        <StatCard icon="🌬️" label="Wind"        value={`${Math.round(wind.speed)} m/s ${windDir}`} />
        <StatCard icon="🌡️" label="Feels Like"  value={`${feelsLike}°`} />
        <StatCard icon="⏱️" label="Pressure"    value={`${main.pressure} hPa`} />
        <StatCard icon="👁️" label="Visibility"  value={`${visKm} km`} />
        <StatCard icon="☁️" label="Cloud Cover" value={`${clouds?.all ?? 0}%`} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl text-center border border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/25 transition-colors duration-200">
      <span className="text-2xl">{icon}</span>
      <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}