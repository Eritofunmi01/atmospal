// ============================================================
// components/SearchBar.jsx
// ============================================================
import { useState, useRef, useEffect } from "react";

export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <div className="flex gap-3 mb-7 flex-wrap">

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-1 min-w-[240px] glass rounded-full px-5 py-1.5 gap-3 search-focus transition-all duration-200"
      >
        {/* Search icon */}
        <svg className="shrink-0 opacity-50" width="17" height="17" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "var(--text-primary)" }}>
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search city… e.g. Lagos, London"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          aria-label="City search"
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent border-none outline-none font-body text-sm min-w-0 disabled:opacity-50 placeholder-current"
          style={{ color: "var(--text-primary)" }}
        />

        {/* Search button — amber */}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          aria-label="Search"
          className="
            px-5 py-2 rounded-full font-display font-semibold text-sm
            bg-amber-500 hover:bg-amber-600
            text-white
            hover:scale-105 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            flex items-center justify-center min-w-[80px]
          "
        >
          {loading ? <span className="btn-spinner" /> : "Search"}
        </button>
      </form>

      {/* Geolocation button */}
      <button
        onClick={onGeolocate}
        disabled={loading}
        title="Use my location"
        aria-label="Use my location"
        className="
          flex items-center gap-2 px-5 py-2.5 glass rounded-full
          font-body text-sm font-medium whitespace-nowrap
          border border-amber-500/30 text-amber-500
          hover:bg-amber-500/15 hover:border-amber-500/60
          hover:scale-105 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          <circle cx="12" cy="12" r="9" strokeDasharray="2 4"/>
        </svg>
        My Location
      </button>
    </div>
  );
}