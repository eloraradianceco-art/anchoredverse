import React, { useState, useMemo, useRef } from "react";
import { BRAND, TRANSLATIONS, BANDS, EMOTIONS } from "./verses";

// ============================================================
// ANCHORED VERSE — Elora Radiance Co.
// Emotion-indexed scripture companion
// All verse data lives in verses.js (259 verses, 17 emotions).
// To add/edit content, edit verses.js — no UI changes needed.
// ============================================================

const APP_URL = "https://anchoredverse.vercel.app";

// Rotate each emotion's reflections by day-of-year (with a per-emotion phase offset)
// so returning users see a fresh anchor instead of the same line every visit.
function pickReflection(emotion) {
  const arr = Array.isArray(emotion.reflections)
    ? emotion.reflections
    : (emotion.reflection ? [emotion.reflection] : []);
  if (!arr.length) return "";
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  let off = 0; const id = emotion.id || "";
  for (let i = 0; i < id.length; i++) off = (off + id.charCodeAt(i)) % arr.length;
  return arr[(dayOfYear + off) % arr.length];
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
        : [...prev, { key, emotionId: emotion.id, emotionName: emotion.name, ref: verse.ref, text: verse[translation], translation, reflection: pickReflection(emotion) }]
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
      const bg = shareCardLight ? BRAND.cream : BRAND.navy;
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
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
      setShareToast("✓ Image saved");
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
      `Anchored Verse · ${emotionName}\n` +
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
      setShareToast("✓ Copied to clipboard");
    } catch {
      setShareToast("Couldn\u2019t copy");
    }
    setTimeout(() => setShareToast(""), 2200);
  };

  const ShareIconBtn = ({ onClick, label = "Share verse", size = "md" }) => {
    const sz = size === "sm" ? { box: 28, icon: 13, pad: 4 } : { box: 36, icon: 16, pad: 6 };
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={label}
        className="av-btn"
        style={{
          width: sz.box, height: sz.box, padding: sz.pad,
          background: `${BRAND.teal}14`,
          border: `1px solid ${BRAND.teal}55`,
          borderRadius: 10, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", color: BRAND.teal,
        }}
      >
        <svg width={sz.icon} height={sz.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    );
  };

  // ============================================================
  // SHARE CARD — rendered to HTML then converted to PNG by html-to-image
  // Light/dark toggle, brand-matched typography (Oswald + Sora)
  // ============================================================
  const renderShareCard = () => {
    if (!shareCard) return null;

    const cBg = shareCardLight
      ? `linear-gradient(160deg, ${BRAND.cream}, #FFFFFF)`
      : `linear-gradient(160deg, ${BRAND.navy}, #243646)`;
    const cText  = shareCardLight ? BRAND.navy : BRAND.cream;
    const cTeal  = shareCardLight ? BRAND.teal : "#3FB5B5";
    const cAmber = BRAND.amber;
    const cDivider = shareCardLight ? `${BRAND.navy}22` : `${BRAND.cream}33`;
    const cFootMuted = shareCardLight ? `${BRAND.navy}66` : `${BRAND.cream}66`;

    return (
      <div
        onClick={closeShareCard}
        style={{
          position: "fixed", inset: 0, zIndex: 500,
          background: "rgba(0,0,0,0.88)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "24px 16px 32px", overflowY: "auto",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400 }}>
          {/* Modal header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, color: BRAND.cream }}>
            <div style={{ fontFamily: "Oswald", letterSpacing: "2px", fontSize: 12, color: BRAND.amber, textTransform: "uppercase" }}>
              Share Card
            </div>
            <button
              onClick={closeShareCard}
              aria-label="Close"
              style={{
                background: "transparent", border: "none", color: BRAND.cream,
                fontSize: 26, lineHeight: 1, cursor: "pointer", padding: 4,
              }}
            >×</button>
          </div>

          {/* The card that will be captured as PNG */}
          <div
            ref={shareCardRef}
            style={{
              background: cBg,
              borderRadius: 22,
              padding: "36px 30px 28px",
              fontFamily: "'Sora', system-ui, sans-serif",
              color: cText,
              boxShadow: "0 24px 60px rgba(0,0,0,.5)",
              border: shareCardLight ? `1px solid ${BRAND.navy}11` : `1px solid ${BRAND.cream}11`,
            }}
          >
            {/* Brand line */}
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{
                fontFamily: "Oswald", letterSpacing: "4px", fontSize: 10,
                color: cAmber, textTransform: "uppercase", fontWeight: 600,
              }}>
                Elora Radiance Co.
              </div>
              <div style={{
                fontFamily: "Oswald", letterSpacing: "1.5px", fontSize: 15,
                color: cText, marginTop: 4, fontWeight: 700, opacity: 0.85,
              }}>
                ANCHORED VERSE
              </div>
            </div>

            {/* Emotion label */}
            <div style={{
              textAlign: "center", marginBottom: 18,
              fontFamily: "Oswald", fontSize: 12, letterSpacing: "3px",
              color: cTeal, textTransform: "uppercase", fontWeight: 600,
            }}>
              {shareCard.emotionName}
            </div>

            {/* Verse text — the focal point */}
            <p style={{
              fontFamily: "Sora", fontSize: 19, lineHeight: 1.55,
              margin: "0 0 22px", fontStyle: "italic",
              textAlign: "center", fontWeight: 400, color: cText,
            }}>
              “{shareCard.text}”
            </p>

            {/* Reference + translation */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderTop: `1px solid ${cDivider}`, paddingTop: 14, marginBottom: 16,
            }}>
              <span style={{ fontFamily: "Oswald", fontWeight: 600, letterSpacing: "1px", color: cText, fontSize: 14 }}>
                {shareCard.ref}
              </span>
              <span style={{ fontFamily: "Oswald", fontSize: 11, letterSpacing: "1.5px", color: cAmber, fontWeight: 500 }}>
                {shareCard.translation}
              </span>
            </div>

            {/* Optional reflection (if present and short enough) */}
            {shareCard.reflection && shareCard.reflection.length < 220 && (
              <div style={{
                background: shareCardLight ? `${BRAND.teal}10` : `${BRAND.teal}22`,
                borderLeft: `3px solid ${cTeal}`,
                padding: "10px 14px", borderRadius: 8, marginBottom: 18,
              }}>
                <div style={{ fontFamily: "Oswald", fontSize: 9, letterSpacing: "2px", color: cTeal, marginBottom: 4, fontWeight: 600 }}>
                  REFLECTION
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: cText, opacity: 0.85 }}>
                  {shareCard.reflection}
                </p>
              </div>
            )}

            {/* Footer URL */}
            <div style={{
              textAlign: "center", fontFamily: "Oswald",
              fontSize: 10, letterSpacing: "2px", color: cFootMuted,
              textTransform: "uppercase", paddingTop: 6,
            }}>
              anchoredverse.vercel.app
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
            <button
              onClick={() => setShareCardLight(true)}
              className="av-btn"
              style={{
                fontFamily: "Oswald", fontSize: 11, letterSpacing: "1.5px",
                padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${BRAND.cream}33`,
                background: shareCardLight ? BRAND.amber : "transparent",
                color: shareCardLight ? BRAND.navy : BRAND.cream,
                transition: "all .2s",
              }}
            >☀ LIGHT</button>
            <button
              onClick={() => setShareCardLight(false)}
              className="av-btn"
              style={{
                fontFamily: "Oswald", fontSize: 11, letterSpacing: "1.5px",
                padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${BRAND.cream}33`,
                background: !shareCardLight ? BRAND.amber : "transparent",
                color: !shareCardLight ? BRAND.navy : BRAND.cream,
                transition: "all .2s",
              }}
            >☾ DARK</button>
          </div>

          {/* Share + copy text actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => handleShareText({ text: shareCard.text, ref: shareCard.ref, translation: shareCard.translation, emotionName: shareCard.emotionName })}
              className="av-btn"
              style={{
                flex: 1, cursor: "pointer", borderRadius: 12, padding: "14px",
                border: `1px solid ${BRAND.cream}33`,
                background: "transparent", color: BRAND.cream,
                fontFamily: "Oswald", letterSpacing: "1px", fontSize: 13,
                transition: "all .2s",
              }}
            >TEXT</button>
            <button
              onClick={handleShareImage}
              disabled={shareCardBusy}
              className="av-btn"
              style={{
                flex: 2, cursor: shareCardBusy ? "default" : "pointer",
                borderRadius: 12, padding: "14px", border: "none",
                background: BRAND.amber, color: BRAND.navy,
                fontFamily: "Oswald", letterSpacing: "1.5px", fontSize: 13,
                opacity: shareCardBusy ? 0.6 : 1,
                transition: "all .2s",
              }}
            >{shareCardBusy ? "GENERATING..." : "↗ SHARE IMAGE"}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 20% 0%, ${BRAND.teal}22, transparent 60%), radial-gradient(circle at 90% 100%, ${BRAND.amber}22, transparent 55%), ${BRAND.navy}`,
        color: BRAND.cream,
        fontFamily: "'Sora', system-ui, sans-serif",
        padding: "0 0 60px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Sora:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .av-fade { animation: avFade .5s ease both; }
        @keyframes avFade { from { opacity: 0; transform: translateY(10px);} to {opacity:1; transform:none;} }
        .av-chip:hover { transform: translateY(-2px); }
        .av-emo:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,.35); }
        .av-btn:active { transform: scale(.97); }
        .av-toast { animation: avToast .25s ease both; }
        @keyframes avToast { from { opacity: 0; transform: translate(-50%, 10px);} to {opacity:1; transform: translate(-50%, 0);} }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: "center", padding: "44px 20px 20px" }}>
        <div style={{ fontFamily: "Oswald", letterSpacing: "5px", fontSize: 13, color: BRAND.amber, textTransform: "uppercase" }}>
          Elora Radiance Co.
        </div>
        <h1 style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 44, margin: "8px 0 4px", letterSpacing: "1px" }}>
          ANCHORED VERSE
        </h1>
        <p style={{ margin: 0, fontWeight: 300, opacity: 0.8, fontSize: 15 }}>
          A word for every weight your heart carries.
        </p>

        <div style={{ marginTop: 22, display: "inline-flex", gap: 6, background: "#ffffff10", padding: 5, borderRadius: 40, border: `1px solid ${BRAND.teal}55` }}>
          {TRANSLATIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTranslation(t)}
              className="av-chip av-btn"
              style={{
                cursor: "pointer", border: "none", borderRadius: 30, padding: "8px 18px",
                fontFamily: "Oswald", letterSpacing: "1px", fontSize: 13, transition: "all .2s",
                background: translation === t ? BRAND.amber : "transparent",
                color: translation === t ? BRAND.navy : BRAND.cream,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Emotion picker */}
      {!emotion && (
        <main className="av-fade" style={{ maxWidth: 760, margin: "0 auto", padding: "10px 20px" }}>
          <p style={{ textAlign: "center", opacity: 0.65, fontSize: 14, marginBottom: 28 }}>
            How is your heart right now?
          </p>
          {BANDS.map((band) => (
            <section key={band.id} style={{ marginBottom: 30 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                <h2 style={{ fontFamily: "Oswald", fontSize: 18, letterSpacing: "2px", margin: 0, color: band.color === BRAND.navy ? BRAND.cream : band.color }}>
                  {band.label.toUpperCase()}
                </h2>
                <span style={{ fontSize: 12, opacity: 0.5 }}>{band.hint}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                {EMOTIONS.filter((e) => e.band === band.id).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => openEmotion(e.id)}
                    className="av-emo av-btn"
                    style={{
                      cursor: "pointer", border: `1px solid ${BRAND.teal}44`,
                      background: "#ffffff0c", color: BRAND.cream,
                      borderRadius: 14, padding: "16px 12px",
                      fontFamily: "Sora", fontSize: 15, fontWeight: 500,
                      transition: "all .2s", borderTop: `3px solid ${band.color}`,
                    }}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </section>
          ))}

          {favorites.length > 0 && (
            <section style={{ marginTop: 10, paddingTop: 24, borderTop: `1px solid ${BRAND.teal}33` }}>
              <h2 style={{ fontFamily: "Oswald", fontSize: 16, letterSpacing: "2px", color: BRAND.amber }}>SAVED ANCHORS</h2>
              {favorites.map((f) => (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#ffffff0c", borderRadius: 12, padding: "12px 16px", marginBottom: 8, fontSize: 13 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: BRAND.amber, fontFamily: "Oswald", letterSpacing: "1px" }}>{f.ref}</span>
                    <span style={{ opacity: 0.5 }}> · {f.emotionName}</span>
                  </div>
                  <ShareIconBtn
                    size="sm"
                    label={`Share ${f.ref}`}
                    onClick={() => openShareCard({ text: f.text, ref: f.ref, translation: f.translation || translation, emotionName: f.emotionName, reflection: f.reflection })}
                  />
                </div>
              ))}
            </section>
          )}
          {/* Add to Home Screen — permanent access */}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button
              className="av-btn"
              onClick={() => setA2hsOpen(true)}
              style={{
                cursor: "pointer", border: `1px solid ${BRAND.teal}55`, background: "transparent",
                color: BRAND.cream, borderRadius: 30, padding: "10px 20px",
                fontFamily: "Oswald", letterSpacing: "1px", fontSize: 12, opacity: 0.85,
              }}
            >
              📱 Add to Home Screen
            </button>
          </div>
        </main>
      )}

      {/* Verse card */}
      {emotion && verse && (
        <main className="av-fade" key={emotion.id + verseIndex} style={{ maxWidth: 620, margin: "0 auto", padding: "10px 20px" }}>
          <button
            onClick={() => setActiveEmotion(null)}
            className="av-btn"
            style={{ cursor: "pointer", background: "none", border: "none", color: BRAND.teal, fontFamily: "Oswald", letterSpacing: "1px", fontSize: 13, marginBottom: 16 }}
          >
            ← ALL EMOTIONS
          </button>

          <div
            style={{
              background: `linear-gradient(160deg, ${BRAND.cream}, #fff)`,
              color: BRAND.navy, borderRadius: 22, padding: "34px 30px",
              boxShadow: "0 20px 50px rgba(0,0,0,.4)", position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <ShareIconBtn
                label={`Share ${verse.ref}`}
                onClick={() => openShareCard({ text: verse[translation], ref: verse.ref, translation, emotionName: emotion.name, reflection: pickReflection(emotion) })}
              />
            </div>

            <div style={{ fontFamily: "Oswald", letterSpacing: "3px", fontSize: 13, color: BRAND.teal, textTransform: "uppercase", paddingRight: 44 }}>
              {emotion.name}
            </div>

            <p style={{ fontFamily: "Sora", fontWeight: 400, fontSize: 21, lineHeight: 1.5, margin: "18px 0 16px" }}>
              "{verse[translation]}"
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BRAND.navy}22`, paddingTop: 14 }}>
              <span style={{ fontFamily: "Oswald", fontWeight: 600, letterSpacing: "1px", color: BRAND.navy }}>
                {verse.ref}
              </span>
              <span style={{ fontFamily: "Oswald", fontSize: 12, letterSpacing: "1px", color: BRAND.amber }}>
                {translation}
              </span>
            </div>

            <div style={{ marginTop: 18, background: `${BRAND.teal}14`, borderLeft: `3px solid ${BRAND.teal}`, padding: "12px 16px", borderRadius: 8 }}>
              <div style={{ fontFamily: "Oswald", fontSize: 11, letterSpacing: "2px", color: BRAND.teal, marginBottom: 4 }}>REFLECTION</div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: BRAND.navy, opacity: 0.85 }}>{pickReflection(emotion)}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={toggleFav}
              className="av-btn"
              style={{
                flex: 1, cursor: "pointer", borderRadius: 12, padding: "14px",
                border: `1px solid ${BRAND.amber}`, fontFamily: "Oswald", letterSpacing: "1px", fontSize: 14,
                background: isFav ? BRAND.amber : "transparent",
                color: isFav ? BRAND.navy : BRAND.amber, transition: "all .2s",
              }}
            >
              {isFav ? "★ ANCHORED" : "☆ SAVE ANCHOR"}
            </button>
            {emotion.verses.length > 1 && (
              <button
                onClick={nextVerse}
                className="av-btn"
                style={{
                  flex: 1, cursor: "pointer", borderRadius: 12, padding: "14px",
                  border: "none", fontFamily: "Oswald", letterSpacing: "1px", fontSize: 14,
                  background: BRAND.teal, color: "#fff", transition: "all .2s",
                }}
              >
                ANOTHER VERSE →
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 14 }}>
            <p style={{ textAlign: "center", fontSize: 12, opacity: 0.45, margin: 0, color: BRAND.cream, fontFamily: "Oswald", letterSpacing: "1px" }}>
              {(bagPos + 1)} of {bagLen || emotion.verses.length}
            </p>
            {emotion.verses.length > 1 && (
              <button
                onClick={() => setBrowseOpen(true)}
                className="av-btn"
                style={{
                  cursor: "pointer", background: "transparent", border: `1px solid ${BRAND.teal}55`,
                  color: BRAND.cream, borderRadius: 30, padding: "8px 18px",
                  fontFamily: "Oswald", letterSpacing: "1px", fontSize: 11, opacity: 0.9,
                }}
              >
                ≡ Browse all {emotion.verses.length}
              </button>
            )}
          </div>
        </main>
      )}

      {/* Share card modal */}
      {renderShareCard()}

      {/* Add to Home Screen modal */}
      {a2hsOpen && (
        <div
          onClick={closeA2hs}
          style={{
            position: "fixed", inset: 0, zIndex: 700, padding: 24,
            background: "rgba(10,18,28,.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(160deg, ${BRAND.navy}, #243646)`,
              border: `1px solid ${BRAND.teal}55`, borderRadius: 22,
              padding: "30px 26px", maxWidth: 400, width: "100%",
              maxHeight: "88vh", overflowY: "auto", color: BRAND.cream,
              boxShadow: "0 24px 60px rgba(0,0,0,.5)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 40, marginBottom: 6 }}>📱</div>
              <div style={{ fontFamily: "Oswald", letterSpacing: "2px", fontSize: 18, color: BRAND.amber, textTransform: "uppercase" }}>
                Add to Home Screen
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: 14, opacity: 0.8, lineHeight: 1.6, marginTop: 0, marginBottom: 18 }}>
              Anchored Verse works like a native app — add it to your Home Screen for instant, full-screen access.
            </p>
            {[
              { os: "🍎 iPhone / iPad (Safari)", steps: ["Tap the Share button ⎙ at the bottom of Safari", 'Scroll down and tap "Add to Home Screen"', 'Tap "Add" — done ✓'] },
              { os: "🤖 Android (Chrome)", steps: ["Tap the three-dot menu ⋮ at the top right", 'Tap "Add to Home Screen" or "Install App"', 'Tap "Add" — done ✓'] },
            ].map((p) => (
              <div key={p.os} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Oswald", letterSpacing: "1px", fontSize: 13, color: BRAND.teal, marginBottom: 8 }}>{p.os}</div>
                {p.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 999, background: BRAND.amber, color: BRAND.navy, fontFamily: "Oswald", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            ))}
            <button
              className="av-btn"
              onClick={closeA2hs}
              style={{
                width: "100%", marginTop: 8, cursor: "pointer", border: "none",
                borderRadius: 12, padding: "13px", background: BRAND.amber, color: BRAND.navy,
                fontFamily: "Oswald", letterSpacing: "1px", fontSize: 15,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Browse all verses sheet */}
      {browseOpen && emotion && (
        <div
          onClick={() => setBrowseOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 700, padding: 24,
            background: "rgba(10,18,28,.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(160deg, ${BRAND.navy}, #243646)`,
              border: `1px solid ${BRAND.teal}55`, borderRadius: 22,
              padding: "24px 20px", maxWidth: 440, width: "100%",
              maxHeight: "82vh", display: "flex", flexDirection: "column", color: BRAND.cream,
              boxShadow: "0 24px 60px rgba(0,0,0,.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "Oswald", letterSpacing: "2px", fontSize: 16, color: BRAND.amber, textTransform: "uppercase" }}>
                {emotion.name}
              </div>
              <button
                onClick={() => setBrowseOpen(false)}
                aria-label="Close"
                style={{ background: "none", border: "none", color: BRAND.cream, fontSize: 24, lineHeight: 1, cursor: "pointer", opacity: 0.6 }}
              >×</button>
            </div>
            <div style={{ fontFamily: "Oswald", letterSpacing: "1px", fontSize: 11, color: BRAND.teal, margin: "4px 0 14px", opacity: 0.8 }}>
              {emotion.verses.length} VERSES · TAP TO READ
            </div>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {emotion.verses.map((v, i) => {
                const active = i === verseIndex;
                const fav = favorites.some((f) => f.key === favKey(emotion.id, v.ref));
                const preview = (v[translation] || "").replace(/\s+/g, " ").trim();
                return (
                  <button
                    key={v.ref}
                    onClick={() => jumpToVerse(i)}
                    className="av-btn"
                    style={{
                      textAlign: "left", cursor: "pointer", borderRadius: 12, padding: "12px 14px",
                      background: active ? `${BRAND.teal}26` : "#ffffff0c",
                      border: active ? `1px solid ${BRAND.teal}` : "1px solid transparent",
                      color: BRAND.cream,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: "Oswald", fontWeight: 600, letterSpacing: "1px", fontSize: 13, color: active ? BRAND.amber : BRAND.cream }}>
                        {v.ref}{fav ? "  ★" : ""}
                      </span>
                      {active && <span style={{ fontFamily: "Oswald", fontSize: 10, letterSpacing: "1px", color: BRAND.teal }}>READING</span>}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.7 }}>
                      {preview.length > 90 ? preview.slice(0, 90) + "…" : preview}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {shareToast && (
        <div
          className="av-toast"
          style={{
            position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
            background: BRAND.navy, color: BRAND.cream,
            border: `1px solid ${BRAND.teal}66`, padding: "12px 22px",
            borderRadius: 30, fontFamily: "Oswald", letterSpacing: "1px", fontSize: 13,
            boxShadow: "0 12px 30px rgba(0,0,0,.4)", zIndex: 600,
          }}
        >
          {shareToast}
        </div>
      )}
    </div>
  );
}
