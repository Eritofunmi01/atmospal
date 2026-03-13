// ============================================================
// components/ErrorMessage.jsx
// ============================================================
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass flex flex-col items-center text-center gap-3 py-12 px-6 mt-5 fade-in" role="alert">
      <span className="text-5xl" aria-hidden="true">⚠️</span>

      <h3 className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </h3>

      <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            mt-2 px-7 py-2.5 rounded-full
            font-display font-semibold text-sm
            bg-amber-500 hover:bg-amber-600
            text-white
            hover:scale-105 active:scale-95
            transition-all duration-200
          "
        >
          Try Again
        </button>
      )}
    </div>
  );
}