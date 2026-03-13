// ============================================================
// components/LoadingSpinner.jsx
// ============================================================
export default function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[300px] gap-5"
      role="status"
      aria-label="Loading weather data"
    >
      <div className="spinner-ring">
        <div /><div /><div /><div />
      </div>
      <p className="text-sm tracking-wide" style={{ color: "var(--text-secondary)" }}>
        Fetching weather data…
      </p>
    </div>
  );
}