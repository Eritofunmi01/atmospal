// ============================================================
// components/ForecastCard.jsx
// ============================================================
import { formatDay, formatDate } from "../../utils/helpers";

export default function ForecastCard({ item, unit, isToday }) {
  const condition = item.weather[0];
  const iconUrl   = condition.iconUrl;

  return (
    <div className={`glass flex flex-col items-center gap-1.5 py-5 px-2 text-center fade-in hover:-translate-y-1 transition-transform duration-200 min-w-[100px] ${isToday ? "forecast-today" : ""}`}>

      <p className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
        {isToday ? "Today" : formatDay(item.dt)}
      </p>
      <p className="text-[0.68rem]" style={{ color: "var(--text-secondary)" }}>
        {formatDate(item.dt)}
      </p>

      <img
        src={iconUrl}
        alt={condition.description}
        className="w-14 h-14 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
      />

      <p className="text-[0.68rem] capitalize leading-tight" style={{ color: "var(--text-secondary)" }}>
        {condition.description}
      </p>

      <div className="flex gap-2 font-display font-semibold text-sm">
        <span className="text-amber-500">▲ {item.tempMax}°</span>
        <span className="text-slate-400">▼ {item.tempMin}°</span>
      </div>

      <span className="text-[0.68rem]" style={{ color: "var(--text-secondary)" }}>
        💧 {item.main.humidity}%
      </span>
    </div>
  );
}