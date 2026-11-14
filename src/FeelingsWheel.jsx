import React, { useLayoutEffect, useRef } from "react";

// ============================================================
// FEELINGS WHEEL — six core emotions at the center, each feeling around its core.
// Tap a core to focus it; tap a feeling to open its verses. Every wedge is a real button
// (keyboard and screen reader), and the List view on the home screen offers the same choices.
// ============================================================

const R_HUB = 36, R_CORE = 92, R_FEEL = 196, R_RIM = 203;

const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
};
const f = (n) => Math.round(n * 100) / 100;
function sector(r0, r1, a0, a1) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 ${large} 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 ${large} 0 ${f(x3)} ${f(y3)}Z`;
}
// Text that runs along the circle (cores) — flipped on the lower half so it's never upside down.
const tangent = (mid) => { const m = ((mid % 360) + 360) % 360; return m > 90 && m < 270 ? mid + 180 : mid; };
// Text that runs outward from the center (feelings) — flipped on the left half to read left-to-right.
const radial = (mid) => { const m = ((mid % 360) + 360) % 360; return m <= 180 ? mid - 90 : mid + 90; };

function AnchorMark({ size = 26 }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-size / 2} ${-size / 2}) scale(${size / 24})`}>
      <circle cx="12" cy="4.9" r="2.2" />
      <path d="M12 7.1v13.1M8.4 10.2h7.2" />
      <path d="M4.8 13.7c.5 4.1 3.5 6.5 7.2 6.5s6.7-2.4 7.2-6.5" />
      <path d="M2.8 15.3l2-1.8 2.1 1.7M17.1 15.2l2.1-1.7 2 1.8" />
    </g>
  );
}

export default function FeelingsWheel({ cores, emotions, selected, onSelectCore, onOpenFeeling }) {
  const svgRef = useRef(null);
  const byId = (id) => emotions.find((e) => e.id === id);
  // Each core's slice in degrees, scaled so the whole wheel is 360 (Sorrow ends at the top, like a classic feelings wheel).
  const counts = cores.map((c) => c.emotions.filter((id) => byId(id)).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  // …but no core narrower than MIN_CORE, so its name stays readable in the center.
  const MIN_CORE = 56;
  const raw = counts.map((n) => (360 * n) / total);
  const small = raw.map((d) => d < MIN_CORE);
  const rest = 360 - MIN_CORE * small.filter(Boolean).length;
  const restCount = counts.reduce((a, n, i) => a + (small[i] ? 0 : n), 0) || 1;
  const spans = raw.map((d, i) => (small[i] ? MIN_CORE : (rest * counts[i]) / restCount));
  const start = -spans[0];
  const startOf = (ci) => start + spans.slice(0, ci).reduce((a, b) => a + b, 0);

  // Shrink any feeling label that would run past its ring (longer words, wider fallback fonts).
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const fit = () => svg.querySelectorAll("text[data-max]").forEach((t) => {
      t.style.fontSize = "";
      const max = Number(t.dataset.max);
      if (!t.getComputedTextLength) return;
      // A couple of passes: text width doesn't scale perfectly with size (kerning, hinting).
      for (let i = 0; i < 3; i++) {
        const len = t.getComputedTextLength();
        if (len <= max) break;
        t.style.fontSize = `${(parseFloat(getComputedStyle(t).fontSize) * max * 0.985) / len}px`;
      }
    });
    fit();
    // Re-fit once the app's fonts finish loading (they can arrive after the first paint).
    const fonts = document.fonts;
    if (fonts && fonts.ready) fonts.ready.then(fit);
    if (fonts && fonts.addEventListener) fonts.addEventListener("loadingdone", fit);
    return () => { if (fonts && fonts.removeEventListener) fonts.removeEventListener("loadingdone", fit); };
  }, [cores, emotions]);

  const keyed = (fn) => (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
  };

  return (
    <svg ref={svgRef} className={`fw${selected ? " has-focus" : ""}`} viewBox="-208 -208 416 416" role="group" aria-label="Feelings wheel">
      <circle r={R_RIM + 3} className="fw-bg" />
      {cores.map((core, ci) => {
        const span = spans[ci], a0 = startOf(ci), a1 = a0 + span, mid = a0 + span / 2;
        const on = selected === core.id;
        const feels = core.emotions.map(byId).filter(Boolean);
        const each = span / feels.length;
        const [cx, cy] = pt((R_HUB + R_CORE) / 2 + 2, mid);
        return (
          <g key={core.id} className={`fw-core-group${on ? " on" : ""}`} style={{ "--c": core.color }}>
            {/* Core wedge */}
            <g
              className="fw-seg fw-core"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${core.name}: ${feels.map((e) => e.name).join(", ")}`}
              onClick={() => onSelectCore(on ? null : core.id)}
              onKeyDown={keyed(() => onSelectCore(on ? null : core.id))}
            >
              <path d={sector(R_HUB, R_CORE, a0, a1)} />
              <text x={f(cx)} y={f(cy)} data-max={f(2 * ((R_HUB + R_CORE) / 2 + 2) * Math.tan(((span / 2 - 4) * Math.PI) / 180))} transform={`rotate(${f(tangent(mid))} ${f(cx)} ${f(cy)})`} aria-hidden="true">{core.name}</text>
            </g>
            {/* Its feelings */}
            {feels.map((e, i) => {
              const b0 = a0 + i * each, b1 = b0 + each, bm = b0 + each / 2;
              const [tx, ty] = pt((R_CORE + R_FEEL) / 2, bm);
              return (
                <g
                  key={e.id}
                  className="fw-seg fw-feel"
                  role="button"
                  tabIndex={0}
                  aria-label={`${e.name}, ${e.verses.length} verses`}
                  onClick={() => onOpenFeeling(e.id, core.id)}
                  onKeyDown={keyed(() => onOpenFeeling(e.id, core.id))}
                >
                  <path d={sector(R_CORE, R_FEEL, b0, b1)} />
                  <text x={f(tx)} y={f(ty)} data-max={R_FEEL - R_CORE - 10} transform={`rotate(${f(radial(bm))} ${f(tx)} ${f(ty)})`} aria-hidden="true">{e.name}</text>
                </g>
              );
            })}
            {/* Outer rim in the core's color */}
            <path className="fw-rim" d={sector(R_FEEL + 1.5, R_RIM, a0 + 0.6, a1 - 0.6)} aria-hidden="true" />
          </g>
        );
      })}
      {/* Hub: anchor; when a core is focused it clears the focus */}
      <g
        className={`fw-hub${selected ? " live" : ""}`}
        role={selected ? "button" : undefined}
        tabIndex={selected ? 0 : undefined}
        aria-label={selected ? "Show every feeling" : undefined}
        onClick={selected ? () => onSelectCore(null) : undefined}
        onKeyDown={selected ? keyed(() => onSelectCore(null)) : undefined}
      >
        <circle r={R_HUB - 3} />
        <g className="fw-hub-mark"><AnchorMark size={30} /></g>
      </g>
    </svg>
  );
}
