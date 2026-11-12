import React, { useState, useMemo, useRef, useEffect } from "react";
import { TRANSLATIONS, BANDS, EMOTIONS } from "./verses";
import { NOTICES } from "./ScriptureCredits";
import "./fonts.css";
import "./anchored.css";

// ============================================================
// ANCHORED VERSE — Elora Radiance Co.
// Emotion-indexed scripture companion
// All verse data lives in verses.js (339 verses, 25 emotions).
// To add/edit content, edit verses.js — no UI changes needed.
// Visual layer lives in anchored.css; fonts are self-hosted (fonts.css).
// ============================================================

// Palette (mirrors the CSS custom properties; used for inline tones and the share image)
const C = {
  harbor: "#0D1B29", deep: "#16293C", gold: "#D6A55A", goldInk: "#8F6522",
  sea: "#6BB3AE", tide: "#7FA4C8", parch: "#EAE4D3", mist: "#8FA0AE", paper: "#F3EEDF",
};
// Band tones (verses.js ships a navy for "heavy" which vanishes on a dark field)
const TONE = { heavy: C.tide, friction: C.gold, light: C.sea };
const toneVars = (hex) => ({ "--tone": hex, "--tone-soft": `${hex}73` });

// Verse type scales with length: short verses get presence, long ones stay calm.
const verseSize = (text = "") => (text.length <= 90 ? "lg" : text.length <= 170 ? "md" : "sm");

// ── Icons ────────────────────────────────────────────────────────
function AnchorMark({ size = 26, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4.9" r="2.2" fill={filled ? "currentColor" : "none"} />
      <path d="M12 7.1v13.1M8.4 10.2h7.2" />
      <path d="M4.8 13.7c.5 4.1 3.5 6.5 7.2 6.5s6.7-2.4 7.2-6.5" />
      <path d="M2.8 15.3l2-1.8 2.1 1.7M17.1 15.2l2.1-1.7 2 1.8" />
    </svg>
  );
}
const ShareGlyph = ({ size = 19 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 15V3.5M7.6 7.6L12 3.2l4.4 4.4M5 12v6.5A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5V12" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
);
const CloseGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const CycleGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5" /></svg>
);

function ShareIconBtn({ onClick, label = "Share verse" }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label={label} className="av-icon-btn">
      <ShareGlyph />
    </button>
  );
}

const APP_URL = "https://verse.eloraradiance.com";

// Rotate each emotion's reflections by day-of-year (with a per-emotion phase offset)
// so returning users see a fresh anchor instead of the same line every visit.
function reflectionList(emotion) {
  if (!emotion) return [];
  return Array.isArray(emotion.reflections)
    ? emotion.reflections
    : (emotion.reflection ? [emotion.reflection] : []);
}

// Day-of-year base index (with a per-emotion phase offset) so returning users
// see a fresh anchor each day; tap-to-cycle advances from this starting point.
function reflectionBaseIndex(emotion) {
  const arr = reflectionList(emotion);
  if (!arr.length) return 0;
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  let off = 0; const id = (emotion && emotion.id) || "";
  for (let i = 0; i < id.length; i++) off = (off + id.charCodeAt(i)) % arr.length;
  return (dayOfYear + off) % arr.length;
}

// ── Shuffle-bag verse rotation (persisted) ───────────────────────
// Each emotion gets a shuffled order of verse indices with no repeats until
// every verse has been seen, then it reshuffles (avoiding an immediate repeat).
const AV_BAGS_KEY = "av_verse_bags";
function avLoadBags() {
  try { return JSON.parse(localStorage.getItem(AV_BAGS_KEY)) || {}; } catch { return {}; }
}
function avSaveBags(bags) {
  try { localStorage.setItem(AV_BAGS_KEY, JSON.stringify(bags)); } catch {}
}
function avShuffle(n, avoidFirst = -1) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (n > 1 && a[0] === avoidFirst) { const t = a[0]; a[0] = a[1]; a[1] = t; }
  return a;
}

export default function AnchoredVerse() {
  const [translation, setTranslation] = useState("ESV");
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [verseIndex, setVerseIndex] = useState(0);
  const [bagPos, setBagPos] = useState(0);
  const [bagLen, setBagLen] = useState(0);
  const [browseOpen, setBrowseOpen] = useState(false);
  const bagsRef = useRef(avLoadBags());
  const [favorites, setFavorites] = useState([]); // {emotionId, ref}
  const [shareToast, setShareToast] = useState("");

  // ShareCard modal state
  const [shareCard, setShareCard] = useState(null); // { text, ref, translation, emotionName, reflection }
  const [shareCardLight, setShareCardLight] = useState(true);
  const [shareCardBusy, setShareCardBusy] = useState(false);
  const shareCardRef = useRef(null);

  // Add-to-Home-Screen state
  const [a2hsOpen, setA2hsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  React.useEffect(() => {
    try {
      const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
      if (!standalone && !localStorage.getItem("av_a2hs_seen")) {
        const t = setTimeout(() => setA2hsOpen(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  const closeA2hs = () => { try { localStorage.setItem("av_a2hs_seen", "1"); } catch {} setA2hsOpen(false); };

  const emotion = useMemo(
    () => EMOTIONS.find((e) => e.id === activeEmotion) || null,
    [activeEmotion]
  );
  const verse = emotion ? emotion.verses[verseIndex % emotion.verses.length] : null;

  // Reflection rotation: day-seeded base index + user tap-to-cycle. Resets on emotion change.
  const [reflBump, setReflBump] = useState(0);
  React.useEffect(() => { setReflBump(0); }, [emotion ? emotion.id : null]);
  const reflList = reflectionList(emotion);
  const reflIndex = reflList.length ? (reflectionBaseIndex(emotion) + reflBump) % reflList.length : 0;
  const currentReflection = reflList[reflIndex] || "";
  const cycleReflection = (e) => { if (e) e.stopPropagation(); if (reflList.length > 1) setReflBump((b) => b + 1); };

  // Pick a verse for an emotion via its persisted shuffle bag.
  // mode: "open"/"next" advance the bag; a number jumps to that verse index.
  const pickVerse = (emotionId, versesLen, mode) => {
    const bags = bagsRef.current;
    let b = bags[emotionId];
    if (!b || !Array.isArray(b.order) || b.order.length !== versesLen) {
      b = { order: avShuffle(versesLen), pos: 0 };
    } else if (mode === "open" || mode === "next") {
      let pos = b.pos + 1;
      if (pos >= b.order.length) {
        b.order = avShuffle(versesLen, b.order[b.order.length - 1]);
        pos = 0;
      }
      b.pos = pos;
    } else if (typeof mode === "number") {
      const p = b.order.indexOf(mode);
      if (p >= 0) b.pos = p;
    }
    bags[emotionId] = b;
    avSaveBags(bags);
    return { idx: b.order[b.pos], pos: b.pos, len: b.order.length };
  };

  const applyPick = (emotionId, versesLen, mode) => {
    const { idx, pos, len } = pickVerse(emotionId, versesLen, mode);
    setVerseIndex(idx);
    setBagPos(pos);
    setBagLen(len);
  };

  const openEmotion = (id) => {
    const e = EMOTIONS.find((x) => x.id === id);
    setActiveEmotion(id);
    applyPick(id, e ? e.verses.length : 0, "open");
  };

  const nextVerse = () => {
    if (!emotion) return;
    applyPick(emotion.id, emotion.verses.length, "next");
  };

  const jumpToVerse = (i) => {
    if (!emotion) return;
    applyPick(emotion.id, emotion.verses.length, i);
    setBrowseOpen(false);
  };

  const favKey = (emId, ref) => `${emId}::${ref}`;
  const isFav = verse && favorites.some((f) => f.key === favKey(emotion.id, verse.ref));
  const toggleFav = () => {
    if (!verse) return;
    const key = favKey(emotion.id, verse.ref);
    setFavorites((prev) =>
      prev.some((f) => f.key === key)
        ? prev.filter((f) => f.key !== key)
        : [...prev, { key, emotionId: emotion.id, emotionName: emotion.name, ref: verse.ref, text: verse[translation], translation, reflection: currentReflection }]
    );
  };

  // Open the ShareCard modal for a given verse
  const openShareCard = ({ text, ref, translation: tr, emotionName, reflection }) => {
    setShareCard({ text, ref, translation: tr, emotionName, reflection });
  };

  const closeShareCard = () => {
    setShareCard(null);
    setShareCardBusy(false);
  };

  // Generate PNG from the rendered card and trigger native share / download
  const handleShareImage = async () => {
    if (!shareCardRef.current || !shareCard) return;
    setShareCardBusy(true);
    try {
      // Wait for fonts to be ready so html-to-image captures rendered text
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      // Double rAF gives the layout one more frame to settle
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const { toPng } = await import("html-to-image");
      const bg = shareCardLight ? C.paper : C.harbor;
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: bg,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const fileName = `anchored-verse-${(shareCard.ref || "verse").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Anchored Verse" });
          setShareCardBusy(false);
          return;
        } catch (e) {
          if (e && e.name === "AbortError") {
            setShareCardBusy(false);
            return;
          }
        }
      }

      // Fallback: download the PNG
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShareToast("Image saved");
      setTimeout(() => setShareToast(""), 2200);
    } catch (e) {
      console.error("Share image failed:", e);
      setShareToast("Couldn\u2019t generate image");
      setTimeout(() => setShareToast(""), 2200);
    }
    setShareCardBusy(false);
  };

  // Plain-text share (used by Saved Anchors list)
  const handleShareText = async ({ text, ref, translation: tr, emotionName }) => {
    const body =
      `"${text}"\n` +
      `— ${ref} (${tr})\n\n` +
      `Anchored Verse: ${emotionName}\n` +
      `${APP_URL}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Anchored Verse", text: body });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(body);
      setShareToast("Copied to clipboard");
    } catch {
      setShareToast("Couldn\u2019t copy");
    }
    setTimeout(() => setShareToast(""), 2200);
  };

  // ── Escape closes the top-most layer; page doesn't scroll behind a layer ──
  const layerOpen = !!shareCard || browseOpen || a2hsOpen || creditsOpen;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (shareCard) closeShareCard();
      else if (browseOpen) setBrowseOpen(false);
      else if (a2hsOpen) closeA2hs();
      else if (creditsOpen) setCreditsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    if (!browseOpen) return;
    const t = setTimeout(() => {
      const el = document.querySelector(".av-row.on");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }, 60);
    return () => clearTimeout(t);
  }, [browseOpen]);
  useEffect(() => {
    document.body.style.overflow = layerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [layerOpen]);

  const tone = emotion ? TONE[emotion.band] || C.tide : C.tide;
  const glow = emotion
    ? `radial-gradient(110% 62% at 12% 0%, ${tone}33, transparent 72%), radial-gradient(70% 40% at 100% 22%, ${C.sea}12, transparent 70%)`
    : `radial-gradient(110% 55% at 10% 0%, ${C.tide}26, transparent 72%), radial-gradient(70% 38% at 100% 18%, ${C.gold}10, transparent 70%)`;

  // ============================================================
  // SHARE CARD — rendered to HTML then converted to PNG by html-to-image
  // ============================================================
  const renderShareCard = () => {
    if (!shareCard) return null;
    const light = shareCardLight;
    const cardTone = TONE[(EMOTIONS.find((e) => e.name === shareCard.emotionName) || {}).band] || C.tide;
    const accent = light ? C.goldInk : C.gold;
    const feel = light ? C.harbor : cardTone;
    const bg = light
      ? `radial-gradient(120% 55% at 10% 0%, ${cardTone}2E, transparent 72%), ${C.paper}`
      : `radial-gradient(120% 55% at 10% 0%, ${cardTone}3D, transparent 72%), linear-gradient(172deg, ${C.deep}, ${C.harbor} 72%)`;

    return (
      <div className="av-share" onClick={closeShareCard} role="dialog" aria-modal="true" aria-label="Share this verse">
        <div className="av-share-inner" onClick={(e) => e.stopPropagation()}>
          <div className="av-share-head">
            <h2>Share this verse</h2>
            <button onClick={closeShareCard} aria-label="Close" className="av-icon-btn bare"><CloseGlyph /></button>
          </div>

          {/* The card that will be captured as PNG */}
          <div ref={shareCardRef} className={`sc ${light ? "light" : "dark"}`} style={{ background: bg }}>
            <div className="sc-top">
              <span className="sc-brand"><span style={{ color: accent, display: "inline-flex" }}><AnchorMark size={22} /></span>Anchored Verse</span>
              <span className="sc-feel" style={{ color: feel, opacity: light ? 0.7 : 1 }}>{shareCard.emotionName}</span>
            </div>
            <div className={`sc-verse ${verseSize(shareCard.text)}`}>
              <p>{"“"}{shareCard.text}{"”"}</p>
            </div>
            <div className="sc-ref" style={{ color: accent }}>
              {shareCard.ref}<span style={{ color: light ? C.harbor : C.parch }}>{shareCard.translation}</span>
            </div>
            {shareCard.reflection && shareCard.reflection.length < 220 && (
              <p className="sc-reflect" style={{ borderLeftColor: light ? `${C.harbor}33` : `${cardTone}88` }}>{shareCard.reflection}</p>
            )}
            <div className="sc-foot">
              <span>verse.eloraradiance.com</span>
              <span>Elora Radiance Co.</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="av-seg" role="group" aria-label="Card style">
              <button onClick={() => setShareCardLight(true)} aria-pressed={shareCardLight}>Light</button>
              <button onClick={() => setShareCardLight(false)} aria-pressed={!shareCardLight}>Dark</button>
            </div>
          </div>

          <div className="av-share-actions">
            <button
              onClick={() => handleShareText({ text: shareCard.text, ref: shareCard.ref, translation: shareCard.translation, emotionName: shareCard.emotionName })}
              className="av-pill ghost"
            >Share text</button>
            <button onClick={handleShareImage} disabled={shareCardBusy} className="av-pill main" style={{ opacity: shareCardBusy ? 0.6 : 1 }}>
              {shareCardBusy ? "Preparing image…" : "Share image"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const multi = emotion && emotion.verses.length > 1;
  const canCycle = reflList.length > 1;

  return (
    <div className="av" style={toneVars(tone)}>
      <div className="av-glow" key={emotion ? emotion.band : "home"} style={{ background: glow }} aria-hidden="true" />

      <div className="av-wrap">
        {/* Top bar: brand (or back) + translation */}
        <header className="av-bar">
          {emotion ? (
            <button className="av-back" onClick={() => setActiveEmotion(null)}>
              <ChevronLeft />All feelings
            </button>
          ) : (
            <div className="av-brand"><AnchorMark size={26} />Anchored Verse</div>
          )}
          <div className="av-tabs" role="group" aria-label="Bible translation">
            {TRANSLATIONS.map((t) => (
              <button key={t} className="av-tab" onClick={() => setTranslation(t)} aria-pressed={translation === t}>{t}</button>
            ))}
          </div>
        </header>

        {/* Emotion picker */}
        {!emotion && (
          <main>
            <div className="av-hero">
              <h1>How is your heart right now?</h1>
              <p>A word for every weight your heart carries.</p>
            </div>

            {BANDS.map((band) => (
              <section key={band.id} className="av-band" style={toneVars(TONE[band.id])} aria-labelledby={`band-${band.id}`}>
                <h2 id={`band-${band.id}`}>{band.label}</h2>
                <p className="av-hint">{band.hint}</p>
                <div className="av-names">
                  {EMOTIONS.filter((e) => e.band === band.id).map((e) => (
                    <button key={e.id} className="av-name" onClick={() => openEmotion(e.id)}>{e.name}</button>
                  ))}
                </div>
              </section>
            ))}

            {favorites.length > 0 && (
              <section className="av-saved">
                <h2>Saved anchors</h2>
                {favorites.map((f) => (
                  <div key={f.key} className="av-saved-row">
                    <div className="av-saved-main">
                      <span className="av-saved-ref">{f.ref}</span>
                      <span className="av-saved-feel">{f.emotionName}</span>
                    </div>
                    <ShareIconBtn
                      label={`Share ${f.ref}`}
                      onClick={() => openShareCard({ text: f.text, ref: f.ref, translation: f.translation || translation, emotionName: f.emotionName, reflection: f.reflection })}
                    />
                  </div>
                ))}
              </section>
            )}

            <footer className="av-colophon">
              <button className="av-link" onClick={() => setA2hsOpen(true)}>Add to Home Screen</button>
              <button className="av-link" onClick={() => setCreditsOpen(true)}>Scripture credits</button>
              <nav className="av-legal" aria-label="Elora Radiance">
                <a href="https://eloraradiance.com/support.html" target="_blank" rel="noopener noreferrer">Help &amp; Support</a>
                <a href="https://eloraradiance.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
                <a href="https://eloraradiance.com/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
                <a href="https://eloraradiance.com/" target="_blank" rel="noopener noreferrer">More apps</a>
              </nav>
              <small>© 2026 Elora Radiance Co. LLC</small>
            </footer>
          </main>
        )}

        {/* Verse view */}
        {emotion && verse && (
          <main key={emotion.id}>
            <p className="av-kicker">{emotion.name}</p>

            <div key={`${verseIndex}-${translation}`}>
              <blockquote className={`av-verse ${verseSize(verse[translation])}`} style={{ marginInline: 0 }}>
                <p>{"“"}{verse[translation]}{"”"}</p>
              </blockquote>

              <div className="av-refrow">
                <cite className="av-ref">{verse.ref}<span>{translation}</span></cite>
                <ShareIconBtn
                  label={`Share ${verse.ref}`}
                  onClick={() => openShareCard({ text: verse[translation], ref: verse.ref, translation, emotionName: emotion.name, reflection: currentReflection })}
                />
              </div>

              <div
                className="av-reflect"
                onClick={canCycle ? cycleReflection : undefined}
                onKeyDown={canCycle ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycleReflection(); } } : undefined}
                role={canCycle ? "button" : undefined}
                tabIndex={canCycle ? 0 : undefined}
                aria-label={canCycle ? "Reflection. Press for another reflection." : undefined}
              >
                <div className="av-reflect-head">
                  <span>Reflection</span>
                  {canCycle && (
                    <span className="av-cycle" aria-hidden="true">
                      {reflList.map((_, i) => <i key={i} className={i === reflIndex ? "on" : ""} />)}
                      <CycleGlyph />
                    </span>
                  )}
                </div>
                <p>{currentReflection}</p>
              </div>
            </div>

            <div className="av-actions">
              <button onClick={toggleFav} className="av-pill ghost" aria-pressed={!!isFav}>
                <AnchorMark size={20} filled={!!isFav} />{isFav ? "Anchored" : "Save anchor"}
              </button>
              {multi && <button onClick={nextVerse} className="av-pill main">Another verse</button>}
            </div>
            <div className="av-foot">
              <span>{bagPos + 1} of {bagLen || emotion.verses.length}</span>
              {multi && <button onClick={() => setBrowseOpen(true)} className="av-link">Browse all {emotion.verses.length}</button>}
            </div>
          </main>
        )}
      </div>

      {/* Share card modal */}
      {renderShareCard()}

      {/* Add to Home Screen */}
      {a2hsOpen && (
        <div className="av-scrim" onClick={closeA2hs}>
          <div className="av-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="a2hs-title">
            <div className="av-sheet-head">
              <h2 id="a2hs-title">Keep it one tap away</h2>
              <button onClick={closeA2hs} aria-label="Close" className="av-icon-btn bare"><CloseGlyph /></button>
            </div>
            <div style={{ overflowY: "auto" }}>
              <p className="av-lead">Add Anchored Verse to your Home Screen and it opens full screen, like any app.</p>
              <div className="av-steps">
                <h3>iPhone and iPad (Safari)</h3>
                <ol>
                  <li>Tap the Share button at the bottom of Safari.</li>
                  <li>Scroll down and tap Add to Home Screen.</li>
                  <li>Tap Add.</li>
                </ol>
                <h3>Android (Chrome)</h3>
                <ol>
                  <li>Tap the three-dot menu at the top right.</li>
                  <li>Tap Add to Home Screen or Install app.</li>
                  <li>Tap Add.</li>
                </ol>
              </div>
              <button className="av-pill main" onClick={closeA2hs} style={{ width: "100%", marginTop: 22 }}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {/* Scripture credits: the notice each Bible publisher requires */}
      {creditsOpen && (
        <div className="av-scrim" onClick={() => setCreditsOpen(false)}>
          <div className="av-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="credits-title">
            <div className="av-sheet-head">
              <h2 id="credits-title">Scripture credits</h2>
              <button onClick={() => setCreditsOpen(false)} aria-label="Close" className="av-icon-btn bare"><CloseGlyph /></button>
            </div>
            <div style={{ overflowY: "auto" }}>
              <p className="av-sheet-sub">Each verse shows the translation it is quoted from.</p>
              {["ESV", "NIV", "NKJV"].map((k) => (
                <p key={k} style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(234, 228, 211, 0.8)", margin: "0 0 14px" }}>{NOTICES[k]}</p>
              ))}
              <button className="av-pill main" onClick={() => setCreditsOpen(false)} style={{ width: "100%", marginTop: 8 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Browse all verses */}
      {browseOpen && emotion && (
        <div className="av-scrim" onClick={() => setBrowseOpen(false)}>
          <div className="av-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="browse-title" style={toneVars(tone)}>
            <div className="av-sheet-head">
              <div>
                <h2 id="browse-title" style={{ color: tone }}>{emotion.name}</h2>
                <p className="av-sheet-sub">{emotion.verses.length} verses. Tap one to read it.</p>
              </div>
              <button onClick={() => setBrowseOpen(false)} aria-label="Close" className="av-icon-btn bare"><CloseGlyph /></button>
            </div>
            <div className="av-list">
              {emotion.verses.map((v, i) => {
                const active = i === verseIndex;
                const fav = favorites.some((f) => f.key === favKey(emotion.id, v.ref));
                const preview = (v[translation] || "").replace(/\s+/g, " ").trim();
                return (
                  <button key={v.ref} onClick={() => jumpToVerse(i)} className={`av-row${active ? " on" : ""}`}>
                    <span className="av-row-top">
                      <span className="av-row-ref">{v.ref}</span>
                      {(active || fav) && <span className="av-row-note">{active ? "Reading" : "Anchored"}</span>}
                    </span>
                    <span className="av-row-text">{preview}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {shareToast && <div className="av-toast" role="status">{shareToast}</div>}
    </div>
  );
}
