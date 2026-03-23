import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import PageGateLoader from "@/components/PageGateLoader";

/* ── Donation targets ─────────────────────────────────────── */
const WEBSITE_AMOUNTS = [4000, 2000, 1000, 400, 200, 100];
const CREATOR_AMOUNTS = [2500, 1000, 500, 200, 100, 50];

/* ── Cycling images ─────────────────────────────────────────── */
const WEBSITE_SLIDES = [
  { src: "/donations-and-sponsors/website-donations/website-donations.jpg", caption: "Keeping the pitch alive" },
  { src: null, bg: "linear-gradient(135deg,#052e16,#0d1117)", caption: "Power our servers 🔧" },
  { src: null, bg: "linear-gradient(135deg,#1e3a5f,#0d1117)", caption: "Grow our content team 📰" },
  { src: null, bg: "linear-gradient(135deg,#3b1a5a,#0d1117)", caption: "Expand the arena 🏟️" },
];
const CREATOR_SLIDES = [
  { src: null, bg: "linear-gradient(135deg,#7c3aed,#052e16)", caption: "Support the creator ✨" },
  { src: null, bg: "linear-gradient(135deg,#b45309,#0d1117)", caption: "Fuel more builds 🛠️" },
  { src: null, bg: "linear-gradient(135deg,#be123c,#0d1117)", caption: "Coffee keeps code alive ☕" },
  { src: null, bg: "linear-gradient(135deg,#0e7490,#0d1117)", caption: "Every rand counts 💚" },
];

/* ── Flashing theme colors (image 3 — 8s cycle) ─────────── */
const FLASH_COLORS = [
  "radial-gradient(ellipse at 50% 30%, #052e16 0%, #0d1117 60%, #030712 100%)",
  "radial-gradient(ellipse at 50% 30%, #1e3a5f 0%, #0d1117 60%, #030712 100%)",
  "radial-gradient(ellipse at 50% 30%, #3b1a5a 0%, #0d1117 60%, #030712 100%)",
  "radial-gradient(ellipse at 50% 30%, #1a3d2b 0%, #0d1117 60%, #030712 100%)",
];

/* ── Animated count-up number ──────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) val.set(target); }, [inView, target, val]);
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

/* ── Slide carousel ─────────────────────────────────────── */
function ImageCycler({ slides }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: 480 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 flex flex-col items-end justify-end"
          style={
            slides[current].src
              ? {
                  backgroundImage: `url(${slides[current].src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: slides[current].bg }
          }
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(3,7,18,0.85) 0%, transparent 50%)" }}
          />
          {/* Caption */}
          <motion.p
            className="relative z-10 px-6 pb-5 text-sm"
            style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", letterSpacing: "0.06em", textTransform: "uppercase" }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {slides[current].caption}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? "#22c55e" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED TITLE — "FUEL THE PITCH"
   ═══════════════════════════════════════════════════════════════ */
const TITLE_WORDS = ["FUEL", "THE", "PITCH"];
const TITLE_COLORS = ["#22c55e", "#06b6d4", "#f59e0b"];

function AnimatedTitle() {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-6">
      {TITLE_WORDS.map((word, wi) => (
        <motion.div
          key={word}
          className="relative"
          initial={{ opacity: 0, y: 60, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: wi * 0.15 }}
        >
          {/* Glow blur behind */}
          <div
            className="absolute inset-0 blur-2xl opacity-60 rounded-xl"
            style={{ background: TITLE_COLORS[wi], transform: "scale(0.9) translateY(10px)" }}
          />
          {/* Each letter bouncing */}
          <div className="relative flex">
            {word.split("").map((letter, li) => (
              <motion.span
                key={li}
                style={{
                  fontFamily: "'Bebas Neue',Impact,sans-serif",
                  fontSize: "clamp(3.5rem,10vw,7rem)",
                  letterSpacing: "0.05em",
                  color: TITLE_COLORS[wi],
                  display: "inline-block",
                  textShadow: `0 0 30px ${TITLE_COLORS[wi]}, 0 4px 20px rgba(0,0,0,0.8)`,
                  lineHeight: 1,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (wi * word.length + li) * 0.07,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Yearly tier data ─────────────────────────────────────── */
const TIER_ARENA_PASS = {
  name: "Arena Pass",
  price: 1200,
  color: "#22c55e",
  gradient: "linear-gradient(135deg,#15803d,#22c55e)",
  glow: "rgba(34,197,94,0.4)",
  icon: "🏟️",
  benefits: [
    "Early access to articles",
    "Monthly newsletter",
    "Author badge on comments",
    "Ad-free reading",
    "Priority WhatsApp support",
  ],
  requirements: [
    "Opt in to newsletter email updates",
    "Enable push notifications",
  ],
  ctaLabel: "Subscribe — R 1,200/yr",
};

const TIER_ARENA_ELITE = {
  name: "Arena Elite",
  price: 2400,
  color: "#a855f7",
  gradient: "linear-gradient(135deg,#7c3aed,#f59e0b)",
  glow: "rgba(168,85,247,0.4)",
  icon: "⭐",
  benefits: [
    "All Arena Pass benefits",
    "Exclusive video content",
    "Direct author Q&A access",
    "Featured supporter badge",
    "Analytics insights newsletter",
    "Data partnership opt-in (personalized content)",
  ],
  requirements: [
    "All Arena Pass requirements",
    "Consent to data sharing",
  ],
  ctaLabel: "Subscribe — R 2,400/yr",
};

/* ── Yearly tiers panel ──────────────────────────────────── */
function YearlyTiers({ isCreator }) {
  const kofiUrl = "https://ko-fi.com/robynawesome";

  return (
    <div className="space-y-5">
      {[TIER_ARENA_PASS, TIER_ARENA_ELITE].map((tier) => (
        <motion.div
          key={tier.name}
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${tier.color}30`,
            boxShadow: `0 0 24px ${tier.glow}20`,
          }}
          whileHover={{ y: -2, boxShadow: `0 8px 32px ${tier.glow}30` }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontSize: "1.6rem" }}>{tier.icon}</span>
            <div>
              <h4
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "1.3rem",
                  letterSpacing: "0.06em",
                  color: tier.color,
                  lineHeight: 1,
                }}
              >
                {tier.name}
              </h4>
              <p style={{ fontFamily: "'Montserrat',sans-serif", color: "#9ca3af", fontSize: "0.75rem" }}>
                R {tier.price.toLocaleString()} / year
              </p>
            </div>
          </div>

          {/* Benefits checklist */}
          <ul className="space-y-1.5 mb-4">
            {tier.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span style={{ color: tier.color, fontSize: "0.8rem", marginTop: "0.15rem", flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.8rem" }}>{b}</span>
              </li>
            ))}
          </ul>

          {/* Requirements */}
          <div
            className="rounded-xl px-4 py-3 mb-4"
            style={{ background: `${tier.color}0d`, border: `1px solid ${tier.color}20` }}
          >
            <p style={{ fontFamily: "'Montserrat',sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              Requirements
            </p>
            <ul className="space-y-1">
              {tier.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.1rem", flexShrink: 0 }}>•</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.75rem" }}>
                    {r === "Consent to data sharing" ? (
                      <>
                        Consent to data sharing —{" "}
                        <a href="/terms" style={{ color: tier.color, textDecoration: "underline" }}>
                          see Terms
                        </a>
                      </>
                    ) : r}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA buttons */}
          <motion.a
            href={kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl font-bold text-white text-sm mb-2"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              letterSpacing: "0.04em",
              background: tier.gradient,
              boxShadow: `0 6px 24px ${tier.glow}`,
            }}
            whileHover={{ y: -2, boxShadow: `0 10px 32px ${tier.glow}` }}
            whileTap={{ scale: 0.97 }}
          >
            ☕ {tier.ctaLabel} via Ko-fi
          </motion.a>
          <motion.a
            href={`https://www.paypal.me/osheenviews/${tier.price}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 rounded-xl font-bold text-sm"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              letterSpacing: "0.04em",
              background: "rgba(0,112,243,0.12)",
              border: "1px solid rgba(0,112,243,0.35)",
              color: "#60a5fa",
            }}
            whileHover={{ background: "rgba(0,112,243,0.22)", y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🅿️ Pay R {tier.price.toLocaleString()} via PayPal
          </motion.a>
        </motion.div>
      ))}

      {/* T&C small print */}
      <p className="text-center" style={{ fontFamily: "'Inter',sans-serif", color: "#4b5563", fontSize: "0.68rem", lineHeight: 1.6 }}>
        By subscribing you agree to our{" "}
        <a href="/terms" style={{ color: "#6b7280", textDecoration: "underline" }}>
          Terms &amp; Conditions
        </a>
      </p>
    </div>
  );
}

/* ── Donation widget ─────────────────────────────────────── */
function DonationWidget({ mode }) {
  const isCreator = mode === "creator";
  const amounts = isCreator ? CREATOR_AMOUNTS : WEBSITE_AMOUNTS;
  const [selectedAmt, setSelectedAmt] = useState(amounts[4]);
  const [payType, setPayType] = useState("once"); // once | monthly | yearly
  const [customAmt, setCustomAmt] = useState("");
  const [dedicated, setDedicated] = useState(false);
  const [comment, setComment] = useState(false);

  const finalAmt = customAmt ? parseFloat(customAmt) || selectedAmt : selectedAmt;

  const kofiUrl = `https://ko-fi.com/robynawesome`;
  const paypalUrl = `https://www.paypal.me/osheenviews/${finalAmt}`;

  return (
    <motion.div
      className="rounded-3xl p-6 md:p-8"
      style={{
        background: "rgba(17,24,39,0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(34,197,94,0.2)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
    >
      {/* One-time / Monthly / Yearly tabs */}
      <div className="flex gap-1.5 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
        {[["once", "One-time"], ["monthly", "Monthly ♥"], ["yearly", "Yearly ⭐"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setPayType(val)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              background: payType === val ? (val === "yearly" ? "linear-gradient(135deg,#7c3aed,#f59e0b)" : isCreator ? "#a855f7" : "#22c55e") : "transparent",
              color: payType === val ? "#fff" : "#9ca3af",
              boxShadow: payType === val
                ? val === "yearly"
                  ? "0 0 16px rgba(168,85,247,0.4)"
                  : `0 0 16px ${isCreator ? "#a855f7" : "#22c55e"}40`
                : "none",
              border: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Yearly tiers view */}
      {payType === "yearly" ? (
        <YearlyTiers isCreator={isCreator} />
      ) : (
        <>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
            Your donation supports {isCreator ? "the creator" : "our mission"}
          </p>

          {/* Amount grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {amounts.map((amt) => (
              <motion.button
                key={amt}
                onClick={() => { setSelectedAmt(amt); setCustomAmt(""); }}
                className="py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  background: selectedAmt === amt && !customAmt
                    ? (isCreator ? "rgba(168,85,247,0.25)" : "rgba(34,197,94,0.25)")
                    : "rgba(255,255,255,0.05)",
                  border: selectedAmt === amt && !customAmt
                    ? `1px solid ${isCreator ? "#a855f7" : "#22c55e"}`
                    : "1px solid rgba(255,255,255,0.08)",
                  color: selectedAmt === amt && !customAmt
                    ? (isCreator ? "#a855f7" : "#22c55e")
                    : "#d1d5db",
                  boxShadow: selectedAmt === amt && !customAmt
                    ? `0 0 12px ${isCreator ? "#a855f7" : "#22c55e"}30`
                    : "none",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                R {amt.toLocaleString()}
              </motion.button>
            ))}
          </div>

          {/* Custom amount input */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${customAmt ? (isCreator ? "#a855f7" : "#22c55e") : "rgba(255,255,255,0.1)"}` }}
          >
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem", color: isCreator ? "#a855f7" : "#22c55e" }}>R</span>
            <input
              type="number"
              value={customAmt}
              onChange={(e) => setCustomAmt(e.target.value)}
              placeholder={selectedAmt.toString()}
              className="flex-1 bg-transparent outline-none text-xl font-bold"
              style={{ fontFamily: "'Bebas Neue',sans-serif", color: "#f9fafb", letterSpacing: "0.05em" }}
            />
            <span style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", fontSize: "0.75rem" }}>ZAR</span>
          </div>

          {/* Dedicate + Comment */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setDedicated(!dedicated)}
                className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: dedicated ? (isCreator ? "#a855f7" : "#22c55e") : "rgba(255,255,255,0.3)",
                  background: dedicated ? (isCreator ? "#a855f7" : "#22c55e") : "transparent",
                }}
              >
                {dedicated && <span className="text-white text-xs">✓</span>}
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.85rem" }}>
                Dedicate this donation
              </span>
            </label>
            <button
              onClick={() => setComment(!comment)}
              style={{ fontFamily: "'Inter',sans-serif", color: isCreator ? "#a855f7" : "#22c55e", fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              {comment ? "Hide comment" : "Add comment"}
            </button>
            <AnimatePresence>
              {comment && (
                <motion.textarea
                  rows={2}
                  placeholder="Leave a message..."
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <motion.a
              href={kofiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 rounded-2xl font-bold text-white text-sm"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                letterSpacing: "0.05em",
                background: isCreator
                  ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                  : "linear-gradient(135deg,#15803d,#22c55e)",
                boxShadow: `0 8px 32px ${isCreator ? "rgba(168,85,247,0.4)" : "rgba(34,197,94,0.4)"}`,
              }}
              whileHover={{ y: -2, boxShadow: `0 12px 40px ${isCreator ? "rgba(168,85,247,0.6)" : "rgba(34,197,94,0.6)"}` }}
              whileTap={{ scale: 0.97 }}
            >
              ☕ Donate via Ko-fi — R {finalAmt.toLocaleString()}
            </motion.a>
            <motion.a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3.5 rounded-2xl font-bold text-sm"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                letterSpacing: "0.05em",
                background: "rgba(0,112,243,0.15)",
                border: "1px solid rgba(0,112,243,0.4)",
                color: "#60a5fa",
                boxShadow: "0 4px 16px rgba(0,112,243,0.2)",
              }}
              whileHover={{ background: "rgba(0,112,243,0.25)", y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              🅿️ Donate via PayPal
            </motion.a>
          </div>

          {/* Secure note */}
          <p className="text-center mt-4" style={{ fontFamily: "'Inter',sans-serif", color: "#374151", fontSize: "0.7rem" }}>
            🔒 Secure • 100% goes to {isCreator ? "the creator" : "the website"} • Thank you! ⚽
          </p>
        </>
      )}
    </motion.div>
  );
}

/* ── Image 3 — Stats section (8s flash cycle) ────────────── */
const STATS = [
  { label: "Articles Published", value: 46, suffix: "", icon: "📰" },
  { label: "Video Posts",        value: 7,  suffix: "",  icon: "🎥" },
  { label: "Authors Writing",    value: 6,  suffix: "",  icon: "✍️" },
  { label: "Readers Monthly",    value: 1,  suffix: "K+", icon: "👥" },
];

function StatsSection() {
  const [flashIdx, setFlashIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFlashIdx((i) => (i + 1) % FLASH_COLORS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
      animate={{ background: FLASH_COLORS[flashIdx] }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {/* Pitch lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.4) 50px,rgba(34,197,94,0.4) 51px)` }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Image-3 style headline */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <motion.h2
            className="mb-6"
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(2rem,6vw,4.5rem)",
              letterSpacing: "0.04em",
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: "#06b6d4" }}>
              46 POSTS & COUNTING —
            </span>
            <br />
            <span style={{ color: "#f9fafb" }}>WE NEED YOUR SUPPORT</span>
          </motion.h2>
          <motion.h3
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(1.5rem,4vw,2.8rem)",
              color: "#f9fafb",
              letterSpacing: "0.04em",
            }}
          >
            WE ENVISION THE GREATEST FOOTBALL COMMUNITY
            <br />
            <span style={{ color: "#22c55e" }}>IN THE SOUTHERN HEMISPHERE</span>
          </motion.h3>
          <motion.button
            className="mt-8 px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              background: "#22c55e",
              color: "#030712",
              boxShadow: "0 0 24px rgba(34,197,94,0.5)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,197,94,0.7)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("donate-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            DISCOVER OUR IMPACT
          </motion.button>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ label, value, suffix, icon }, i) => (
            <motion.div
              key={label}
              className="text-center p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(34,197,94,0.2)" }}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3rem", color: "#22c55e", lineHeight: 1 }}>
                <AnimatedNumber target={value} suffix={suffix} />
              </div>
              <p style={{ fontFamily: "'Montserrat',sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.5rem" }}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ── Image 4 — "Together we can make a bigger impact" ──────── */
const IMPACT_CARDS = [
  {
    title: "INDIVIDUAL FANS",
    sub: "Your weekly coffee could keep the blog running",
    bg: "linear-gradient(135deg,#15803d,#22c55e)",
    icon: "👤",
    emoji: ["⚽","🏃","💪"],
  },
  {
    title: "CLUBS & ORGANISATIONS",
    sub: "Partner with us to reach thousands of football fans",
    bg: "linear-gradient(135deg,#7c3aed,#a855f7)",
    icon: "🏆",
    emoji: ["🏟️","🤝","📢"],
  },
];

function ImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              color: "#f9fafb",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            TOGETHER, WE BUILD A BIGGER ARENA
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", marginTop: "0.75rem" }}>
            Get involved — help us bring football culture to the world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {IMPACT_CARDS.map(({ title, sub, bg, icon, emoji }, i) => (
            <motion.div
              key={title}
              className="rounded-3xl p-8 relative overflow-hidden cursor-pointer"
              style={{ background: bg, minHeight: 320 }}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.15 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* Floating emoji decorations */}
              {emoji.map((e, ei) => (
                <motion.span
                  key={ei}
                  className="absolute text-5xl opacity-20 pointer-events-none"
                  style={{
                    top: `${20 + ei * 25}%`,
                    right: `${10 + ei * 12}%`,
                  }}
                  animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2 + ei * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {e}
                </motion.span>
              ))}

              <div className="relative z-10">
                <div className="text-5xl mb-4">{icon}</div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "2rem",
                    color: "#fff",
                    letterSpacing: "0.05em",
                    lineHeight: 1.1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {sub}
                </p>
                <motion.button
                  className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                  whileHover={{ background: "rgba(255,255,255,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("donate-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Contribute Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Image 5 — Upcoming Events section ──────────────────────── */
const UPCOMING_EVENTS = [
  {
    id: 1,
    type: "LEAGUE",
    location: "CAPE TOWN ARENA, WESTERN CAPE",
    title: "5S ARENA SEASON OPENER 2026",
    date: "April 5, 2026",
    img: "/posts/Blog1.png",
    description: "The biggest kick-off of the year — all 8 teams battle for early points.",
  },
  {
    id: 2,
    type: "TOURNAMENT",
    location: "BELLVILLE SPORTS COMPLEX",
    title: "SUMMER CUP KNOCKOUT ROUND",
    date: "April 19, 2026",
    img: "/posts/Blog2.png",
    description: "Knockout rounds begin — only the strongest sides advance.",
  },
  {
    id: 3,
    type: "COMMUNITY",
    location: "BRACKENFELL COMMUNITY GROUNDS",
    title: "COMMUNITY 5-A-SIDE CHARITY DAY",
    date: "May 3, 2026",
    img: "/posts/Blog3.png",
    description: "Play for the community — entry fees go directly to youth development.",
  },
];

function EventsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const TYPE_COLORS = { LEAGUE: "#22c55e", TOURNAMENT: "#f59e0b", COMMUNITY: "#06b6d4" };

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: "#0d1117" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              color: "#f9fafb",
              letterSpacing: "0.05em",
            }}
          >
            EVENTS TO LOOK OUT FOR
          </h2>
        </motion.div>

        <div className="space-y-4">
          {UPCOMING_EVENTS.map(({ id, type, location, title, date, img, description }, i) => (
            <motion.div
              key={id}
              className="flex gap-4 p-4 rounded-2xl cursor-pointer group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${TYPE_COLORS[type]}`,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.1 }}
              whileHover={{ background: "rgba(255,255,255,0.06)", x: 4 }}
            >
              {/* Thumbnail */}
              <img
                src={img}
                alt={title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                onError={(e) => { e.target.style.background = "#1f2937"; e.target.style.border = "1px solid #374151"; }}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded uppercase"
                    style={{ fontFamily: "'Montserrat',sans-serif", color: TYPE_COLORS[type], background: `${TYPE_COLORS[type]}15`, letterSpacing: "0.08em" }}
                  >
                    {type}
                  </span>
                  <span style={{ color: "#6b7280", fontSize: "0.75rem", fontFamily: "'Montserrat',sans-serif" }}>
                    📍 {location}
                  </span>
                </div>
                <h4
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "1.1rem",
                    color: "#f9fafb",
                    letterSpacing: "0.04em",
                    marginBottom: "0.25rem",
                  }}
                  className="group-hover:text-green-400 transition-colors"
                >
                  {title}
                </h4>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>
                  {description}
                </p>
              </div>
              {/* Date */}
              <div className="flex-shrink-0 text-right">
                <span style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                  {date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="/fixtures"
            className="inline-block px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e",
            }}
            whileHover={{ background: "rgba(34,197,94,0.2)", boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}
          >
            VIEW ALL FIXTURES →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function DonationsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [mode, setMode] = useState("website"); // website | creator

  useEffect(() => { document.title = "Fuel the Pitch — 5s Arena Blog"; }, []);

  const slides = mode === "creator" ? CREATOR_SLIDES : WEBSITE_SLIDES;

  return (
    <>
      {/* Gate loader — blocks entry */}
      {!unlocked && <PageGateLoader onUnlock={() => setUnlocked(true)} />}

      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ background: "var(--color-bg)", minHeight: "100vh" }}
          >

            {/* ══ SECTION 1 — ANIMATED TITLE HERO ════════════════ */}
            <section
              className="relative overflow-hidden py-16 px-4"
              style={{
                background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
                borderBottom: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              {/* Pitch lines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
                style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.5) 50px,rgba(34,197,94,0.5) 51px)` }} />
              {/* Radial glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)" }} />

              <div className="max-w-6xl mx-auto relative z-10 text-center">
                {/* Tag line */}
                <motion.p
                  className="text-xs tracking-[0.3em] mb-6 uppercase"
                  style={{ fontFamily: "'Montserrat',sans-serif", color: "#22c55e" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ⚽ Support Football Culture
                </motion.p>

                {/* THE BIG ANIMATED TITLE */}
                <AnimatedTitle />

                {/* Subtitle */}
                <motion.p
                  className="mt-4 max-w-lg mx-auto"
                  style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "1rem", lineHeight: 1.7 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  Every rand keeps the stories alive — help us cover the beautiful game
                  from Cape Town to the world.
                </motion.p>

                {/* Scroll CTA */}
                <motion.div
                  className="mt-10 flex justify-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span style={{ color: "#22c55e", fontSize: "1.5rem" }}>↓</span>
                </motion.div>
              </div>
            </section>

            {/* ══ SECTION 2 — DONATION HERO: FULL-BLEED IMAGE | WIDGET ═ */}
            <section
              id="donate-section"
              className="relative"
              style={{ background: "var(--color-bg)", minHeight: "100vh" }}
            >
              {/* Mode switcher — centred above the split */}
              <div className="flex gap-3 justify-center pt-10 pb-6 px-4 relative z-10">
                {[
                  { val: "website", label: "🏟️ Support the Website", color: "#22c55e" },
                  { val: "creator", label: "🎨 Support the Creator", color: "#a855f7" },
                ].map(({ val, label, color }) => (
                  <motion.button
                    key={val}
                    onClick={() => setMode(val)}
                    className="px-6 py-3 rounded-2xl font-bold text-sm"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      letterSpacing: "0.04em",
                      background: mode === val ? `${color}20` : "rgba(255,255,255,0.04)",
                      border: mode === val ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.08)",
                      color: mode === val ? color : "#9ca3af",
                      boxShadow: mode === val ? `0 0 20px ${color}30` : "none",
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Full-bleed split: left = image cycler, right = widget */}
              <div
                className="flex"
                style={{ minHeight: "calc(100vh - 120px)" }}
              >
                {/* ── Left: full-bleed image cycler (50vw) ── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode + "-image"}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.45 }}
                    style={{
                      width: "calc(50vw - 0px)",
                      minHeight: "calc(100vh - 120px)",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <ImageCycler slides={slides} />
                  </motion.div>
                </AnimatePresence>

                {/* ── Right: donation widget, scrollable ── */}
                <div
                  className="flex-1 flex items-start justify-center px-6 py-6 overflow-y-auto"
                  style={{ maxWidth: "50vw" }}
                >
                  <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mode + "-widget"}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.45 }}
                      >
                        <DonationWidget mode={mode} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ SECTION 3 — STATS + FLASH BG (image 3) ══════════ */}
            <StatsSection />

            {/* ══ SECTION 4 — BIGGER IMPACT (image 4) ════════════ */}
            <ImpactSection />

            {/* ══ SECTION 5 — EVENTS (image 5) ════════════════════ */}
            <EventsSection />

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
