let glassSteps = new Array(50).fill(null);

export const BackgroundCSS = () => {
  return (
    <>
      <div className="app-header_glass">
        <div className="app-header_glass-container">
          {glassSteps.map((_, index) => (
            <div
              key={index}
              className={`app-header_glass-step ${index > 25 ? "no-blur" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="app-header_noise" />

      <div className="app-header_background">
        <div className="container">
          <svg
            className="app-header_logo"
            width="304"
            viewBox="0 0 304 294"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M304.567 122.882L132.929 298.909L33.6407 200.833L72.5087 160.953L132.929 220.452L272.509 84.9521L304.567 122.882Z"
              fill="var(--brand-color-blue)"
            />
            <path
              d="M271.567 100.856L99.9287 276.884L0.640664 178.807L39.5087 138.928L99.9287 198.427L239.509 62.9268L271.567 100.856Z"
              fill="var(--brand-color-red)"
            />
            <path
              d="M260.887 117.871L112.996 269.543L33.4769 191.068L66.9673 156.706L119.028 207.973L239.296 91.2203L260.887 117.871Z"
              fill="var(--brand-color-green)"
            />
          </svg>
        </div>

        <div className="app-header_light red" />
        <div className="app-header_light blue" />
        <div className="app-header_light green" />
      </div>
    </>
  );
};
