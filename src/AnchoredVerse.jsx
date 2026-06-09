import React, { useState, useMemo } from "react";
import { BRAND, TRANSLATIONS, BANDS, EMOTIONS } from "./verses";

// ============================================================
// ANCHORED VERSE — Elora Radiance Co.
// Emotion-indexed scripture companion
// All verse data lives in verses.js (259 verses, 17 emotions).
// To add/edit content, edit verses.js — no UI changes needed.
// ============================================================

const APP_URL = "https://anchoredverse.vercel.app";

export default function AnchoredVerse() {
  const [translation, setTranslation] = useState("ESV");
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [verseIndex, setVerseIndex] = useState(0);
  const [favorites, setFavorites] = useState([]); // {emotionId, ref}
  const [shareToast, setShareToast] = useState("");

  const emotion = useMemo(
    () => EMOTIONS.find((e) => e.id === activeEmotion) || null,
    [activeEmotion]
  );
  const verse = emotion ? emotion.verses[verseIndex % emotion.verses.length] : null;

  const openEmotion = (id) => {
    setActiveEmotion(id);
    setVerseIndex(0);
  };

  const nextVerse = () => setVerseIndex((i) => i + 1);

  const favKey = (emId, ref) => `${emId}::${ref}`;
  const isFav = verse && favorites.some((f) => f.key === favKey(emotion.id, verse.ref));
  const toggleFav = () => {
    if (!verse) return;
    const key = favKey(emotion.id, verse.ref);
    setFavorites((prev) =>
      prev.some((f) => f.key === key)
        ? prev.filter((f) => f.key !== key)
        : [...prev, { key, emotionId: emotion.id, emotionName: emotion.name, ref: verse.ref, text: verse[translation], translation }]
    );
  };

  // ============================================================
  // SHARE
  // Builds a clean share payload and uses Web Share API on mobile,
  // falls back to clipboard with a brief toast.
  // ============================================================
  const handleShare = async ({ text, ref, translation: tr, emotionName }) => {
    const body =
      `"${text}"\n` +
      `— ${ref} (${tr})\n\n` +
      `Anchored Verse · ${emotionName}\n` +
      `${APP_URL}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Anchored Verse",
          text: body,
        });
        return;
      } catch (e) {
        // user cancelled — fall through to clipboard
        if (e && e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(body);
      setShareToast("✓ Copied to clipboard");
    } catch {
      setShareToast("Couldn\u2019t copy — please try again");
    }
    setTimeout(() => setShareToast(""), 2200);
  };

  // Compact share icon button used inside the verse card + each saved anchor
  const ShareIconBtn = ({ onClick, label = "Share verse", size = "md" }) => {
    const sz = size === "sm" ? { box: 28, icon: 13, pad: 4 } : { box: 36, icon: 16, pad: 6 };
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={label}
        className="av-btn"
        style={{
          width: sz.box,
          height: sz.box,
          padding: sz.pad,
          background: `${BRAND.teal}14`,
          border: `1px solid ${BRAND.teal}55`,
          borderRadius: 10,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
          color: BRAND.teal,
        }}
      >
        {/* paper-plane / share glyph (SVG, scales cleanly) */}
        <svg width={sz.icon} height={sz.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
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

        {/* Translation toggle */}
        <div style={{ marginTop: 22, display: "inline-flex", gap: 6, background: "#ffffff10", padding: 5, borderRadius: 40, border: `1px solid ${BRAND.teal}55` }}>
          {TRANSLATIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTranslation(t)}
              className="av-chip av-btn"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 30,
                padding: "8px 18px",
                fontFamily: "Oswald",
                letterSpacing: "1px",
                fontSize: 13,
                transition: "all .2s",
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
                      cursor: "pointer",
                      border: `1px solid ${BRAND.teal}44`,
                      background: "#ffffff0c",
                      color: BRAND.cream,
                      borderRadius: 14,
                      padding: "16px 12px",
                      fontFamily: "Sora",
                      fontSize: 15,
                      fontWeight: 500,
                      transition: "all .2s",
                      borderTop: `3px solid ${band.color}`,
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
                    onClick={() => handleShare({ text: f.text, ref: f.ref, translation: f.translation || translation, emotionName: f.emotionName })}
                  />
                </div>
              ))}
            </section>
          )}
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
              color: BRAND.navy,
              borderRadius: 22,
              padding: "34px 30px",
              boxShadow: "0 20px 50px rgba(0,0,0,.4)",
              position: "relative",
            }}
          >
            {/* Share button (top-right of card) */}
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <ShareIconBtn
                label={`Share ${verse.ref}`}
                onClick={() => handleShare({ text: verse[translation], ref: verse.ref, translation, emotionName: emotion.name })}
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
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: BRAND.navy, opacity: 0.85 }}>{emotion.reflection}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={toggleFav}
              className="av-btn"
              style={{
                flex: 1, cursor: "pointer", borderRadius: 12, padding: "14px",
                border: `1px solid ${BRAND.amber}`, fontFamily: "Oswald", letterSpacing: "1px", fontSize: 14,
                background: isFav ? BRAND.amber : "transparent", color: isFav ? BRAND.navy : BRAND.amber, transition: "all .2s",
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
          <p style={{ textAlign: "center", fontSize: 12, opacity: 0.4, marginTop: 12 }}>
            Verse {(verseIndex % emotion.verses.length) + 1} of {emotion.verses.length}
          </p>
        </main>
      )}

      {/* Share toast */}
      {shareToast && (
        <div
          className="av-toast"
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            background: BRAND.navy,
            color: BRAND.cream,
            border: `1px solid ${BRAND.teal}66`,
            padding: "12px 22px",
            borderRadius: 30,
            fontFamily: "Oswald",
            letterSpacing: "1px",
            fontSize: 13,
            boxShadow: "0 12px 30px rgba(0,0,0,.4)",
            zIndex: 200,
          }}
        >
          {shareToast}
        </div>
      )}
    </div>
  );
}
