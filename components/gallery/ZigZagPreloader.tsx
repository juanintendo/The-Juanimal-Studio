"use client";

export function ZigZagPreloader({ ready }: { ready: boolean }) {
  return (
    <div
      className={`jd-preloader ${ready ? "is-done" : ""}`}
      aria-hidden={ready}
    >
      <div className="jd-preloader-inner">
        <span className="jd-preloader-tag">JUANIMAL DESIGNS · ARCHIVE</span>
        <div className="jd-preloader-track">
          <svg
            className="jd-preloader-svg"
            width="311"
            height="6"
            viewBox="0 0 311 6"
            fill="none"
          >
            <path d="M0 1H155.026L144.122 5H311" className="jd-preloader-base" />
            <path d="M0 1H155.026L144.122 5H311" className="jd-preloader-progress" />
          </svg>
        </div>
      </div>
    </div>
  );
}
