import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import BottomNavBar from "@/components/BottomNavBar";

/* ─── Constants ──────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 280, damping: 22 };

const FOOTBALL_TACTICS = [
  {
    id: "pressing",
    name: "Pressing High",
    icon: "⬆️",
    color: "#22c55e",
    desc: "Relentless pressure on the ball carrier in the opponent's half, forcing errors and creating short transition goals.",
    pitch: "high-press",
  },
  {
    id: "counter",
    name: "Counter-Attack",
    icon: "⚡",
    color: "#06b6d4",
    desc: "Absorb pressure deep, then explode forward with pace the moment possession is won — punish over-committed defences.",
    pitch: "counter",
  },
  {
    id: "tiki",
    name: "Tiki-Taka",
    icon: "🔄",
    color: "#f59e0b",
    desc: "Short, rapid one-touch passing triangles to dominate possession and tire the opposition out of shape.",
    pitch: "tiki",
  },
  {
    id: "gegen",
    name: "Gegenpress",
    icon: "🔥",
    color: "#ef4444",
    desc: "Immediately counter-press after losing the ball — the famous Klopp chaos press that wins the ball in dangerous zones.",
    pitch: "gegen",
  },
  {
    id: "lowblock",
    name: "Low Block",
    icon: "🛡️",
    color: "#a855f7",
    desc: "Two compact defensive banks sitting deep, denying space in behind and forcing opponents into speculative long shots.",
    pitch: "lowblock",
  },
  {
    id: "wing",
    name: "Wing Play",
    icon: "↔️",
    color: "#f97316",
    desc: "Utilise wide areas aggressively with overlapping full-backs and wingers cutting inside to create crossing and shooting opportunities.",
    pitch: "wing",
  },
];

const FIVES_TACTICS = [
  {
    id: "pitch-control",
    name: "Small Pitch Control",
    icon: "🎯",
    color: "#22c55e",
    desc: "Compact triangles and constant movement off the ball — dominate the tight spaces and make the pitch feel twice as big.",
  },
  {
    id: "fast-trans",
    name: "Fast Transition",
    icon: "⚡",
    color: "#06b6d4",
    desc: "Switch from defence to attack in two touches max. Five-a-side is won and lost in transition speed.",
  },
  {
    id: "wall-pass",
    name: "Wall Pass Exploitation",
    icon: "🔀",
    color: "#f59e0b",
    desc: "Use the boards and walls as a third man — 1-2 combos off the wall bypass pressing and open goals up instantly.",
  },
  {
    id: "gk-outfield",
    name: "Goalkeeper as Outfield",
    icon: "🧤",
    color: "#a855f7",
    desc: "Your keeper should be a sweeper, distributor, and sixth attacker rolled into one — key in 5-a-side structure.",
  },
  {
    id: "rotational",
    name: "Rotational Play",
    icon: "🔁",
    color: "#f97316",
    desc: "Fluid positional rotations keep defenders guessing. No fixed roles — everyone attacks, everyone defends.",
  },
];

const BETTING_TACTICS = [
  {
    id: "value",
    name: "Value Betting",
    icon: "💎",
    color: "#22c55e",
    desc: "Find odds where the implied probability is lower than your own calculated probability. Long-term edge is built on value, not luck.",
  },
  {
    id: "ou",
    name: "Over/Under Strategy",
    icon: "📊",
    color: "#06b6d4",
    desc: "Analyse average goals per game, head-to-head records, and pitch conditions before betting totals. Stats over gut feelings.",
  },
  {
    id: "live",
    name: "Live Match Betting",
    icon: "🔴",
    color: "#ef4444",
    desc: "In-play markets shift dramatically. Watch the match, read momentum, and strike when the odds haven't caught up to reality.",
  },
  {
    id: "research",
    name: "Research First",
    icon: "🔍",
    color: "#f59e0b",
    desc: "Form, injuries, weather, head-to-head — never place a bet without doing the homework. Information is the only real edge.",
  },
];

const SITE_SECTIONS = [
  { to: "/",           emoji: "🏠", label: "Home",        color: "#22c55e", tip: "Latest posts, featured content, and quick-access hub." },
  { to: "/posts",      emoji: "📰", label: "Posts",       color: "#06b6d4", tip: "Browse all 46+ articles: tactics, fixtures, and football culture." },
  { to: "/fixtures",   emoji: "📅", label: "Fixtures",    color: "#f59e0b", tip: "Upcoming 5s Arena match schedule and results." },
  { to: "/league",     emoji: "🏆", label: "League",      color: "#a855f7", tip: "Full league table, standings, and stats." },
  { to: "/authors",    emoji: "✍️", label: "Authors",     color: "#ef4444", tip: "Meet the writers behind the blog with full author profiles." },
  { to: "/tools",      emoji: "🧮", label: "Tools",       color: "#f97316", tip: "Football calculators, squad builders, and stat tools." },
  { to: "/shop",       emoji: "🛍️", label: "Shop",        color: "#ec4899", tip: "Official 5s Arena merch and gear." },
  { to: "/donate",     emoji: "💸", label: "Donate",      color: "#f59e0b", tip: "Support the blog and keep the content flowing." },
  { to: "/creator",    emoji: "🎨", label: "Creator",     color: "#a855f7", tip: "Meet Robyn — the designer and developer behind it all." },
  { to: "/about",      emoji: "ℹ️", label: "About",       color: "#06b6d4", tip: "The story of 5s Arena and what we stand for." },
];

/* ─── SVG Pitch Diagrams ─────────────────────────────────────── */
function PitchDiagram({ type, color }) {
  const diagrams = {
    "high-press": (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="60" cy="40" r="12" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Pressing players */}
        {[30, 50, 70, 90].map((x, i) => (
          <motion.circle key={i} cx={x} cy={15 + (i % 2) * 8} r="4" fill={color} fillOpacity="0.8"
            animate={{ cy: [15 + (i%2)*8, 20 + (i%2)*8, 15 + (i%2)*8] }}
            transition={{ duration: 1.5, delay: i*0.2, repeat: Infinity }} />
        ))}
        {/* Ball */}
        <motion.circle cx="60" cy="25" r="3" fill="white" fillOpacity="0.9"
          animate={{ cx: [60, 45, 60, 75, 60], cy: [25, 20, 25, 20, 25] }}
          transition={{ duration: 3, repeat: Infinity }} />
        {/* Arrows showing press */}
        {[30, 50, 70, 90].map((x, i) => (
          <motion.line key={`a${i}`} x1={x} y1={22} x2={60} y2={22} stroke={color} strokeWidth="0.8" strokeOpacity="0.5"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, delay: i*0.15, repeat: Infinity }} />
        ))}
      </svg>
    ),
    counter: (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Defensive block */}
        {[25, 45, 65, 85].map((x, i) => (
          <circle key={i} cx={x} cy={65} r="4" fill={color} fillOpacity="0.5" />
        ))}
        {/* Counter runners */}
        {[40, 60, 80].map((x, i) => (
          <motion.circle key={`r${i}`} cx={x} cy={50} r="4" fill={color} fillOpacity="0.9"
            animate={{ cy: [50, 20, 50], cx: [x, x + 5, x] }}
            transition={{ duration: 2, delay: i*0.3, repeat: Infinity }} />
        ))}
        <motion.line x1="60" y1="55" x2="60" y2="20" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3,2"
          animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, repeat: Infinity }} />
      </svg>
    ),
    tiki: (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Triangle passing network */}
        {[[30,30],[60,20],[50,45],[80,35],[65,55],[40,55]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={color} fillOpacity="0.8" />
        ))}
        {[[30,30,60,20],[60,20,50,45],[50,45,30,30],[60,20,80,35],[80,35,65,55],[65,55,50,45]].map(([x1,y1,x2,y2], i) => (
          <motion.line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" strokeOpacity="0.4"
            animate={{ strokeOpacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.2, delay: i*0.2, repeat: Infinity }} />
        ))}
      </svg>
    ),
    gegen: (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Ball lost position */}
        <motion.circle cx="55" cy="35" r="3" fill="white" fillOpacity="0.9"
          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
        {/* Immediate press swarm */}
        {[35, 50, 70, 45, 65].map((x, i) => (
          <motion.circle key={i} cx={x} cy={20 + i * 8} r="4" fill={color} fillOpacity="0.8"
            animate={{ cx: [x, 55, x], cy: [20 + i*8, 35, 20 + i*8] }}
            transition={{ duration: 1.2, delay: i*0.1, repeat: Infinity }} />
        ))}
      </svg>
    ),
    lowblock: (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Back four */}
        {[20, 40, 60, 80, 100].map((x, i) => (
          <circle key={i} cx={x} cy={65} r="4" fill={color} fillOpacity="0.9" />
        ))}
        {/* Mid four */}
        {[30, 50, 70, 90].map((x, i) => (
          <circle key={`m${i}`} cx={x} cy={52} r="4" fill={color} fillOpacity="0.6" />
        ))}
        {/* Shield indicator */}
        <motion.rect x="15" y="48" width="90" height="22" rx="3" fill={color} fillOpacity="0.05"
          stroke={color} strokeWidth="0.8" strokeOpacity="0.3"
          animate={{ strokeOpacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    ),
    wing: (
      <svg viewBox="0 0 120 80" className="w-full h-20 opacity-70">
        <rect x="5" y="5" width="110" height="70" rx="4" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="60" y1="5" x2="60" y2="75" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        {/* Wide runners */}
        <motion.circle cx="15" cy="40" r="4" fill={color} fillOpacity="0.9"
          animate={{ cy: [40, 20, 40] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="105" cy="40" r="4" fill={color} fillOpacity="0.9"
          animate={{ cy: [40, 20, 40] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
        {/* Crossing arrows */}
        <motion.path d="M 15 25 Q 40 10 60 20" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2,2"
          animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, repeat: Infinity }} />
        <motion.path d="M 105 25 Q 80 10 60 20" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2,2"
          animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, delay: 0.3, repeat: Infinity }} />
        {/* Centre players */}
        {[45, 60, 75].map((x, i) => (
          <circle key={i} cx={x} cy={45} r="4" fill={color} fillOpacity="0.6" />
        ))}
      </svg>
    ),
  };
  return diagrams[type] || null;
}

/* ─── Orbiting Tab ────────────────────────────────────────────── */
function OrbitingTab({ label, angle, radius, isActive, onClick, color }) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return (
    <motion.button
      onClick={onClick}
      className="absolute rounded-full px-4 py-2 text-sm font-bold cursor-pointer border"
      style={{
        left: "50%",
        top: "50%",
        fontFamily: "'Montserrat',sans-serif",
        background: isActive ? color : `${color}20`,
        borderColor: `${color}60`,
        color: isActive ? "#030712" : color,
        x: x - 70,
        y: y - 20,
        zIndex: 10,
        letterSpacing: "0.04em",
        fontSize: "0.75rem",
      }}
      animate={{
        x: x - 70,
        y: y - 20,
        scale: isActive ? 1.15 : 1,
        boxShadow: isActive ? `0 0 20px ${color}80` : "none",
      }}
      transition={SPRING}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}

/* ─── Glass Card ─────────────────────────────────────────────── */
function GlassCard({ children, className = "", style = {}, delay = 0, inView = true }) {
  return (
    <motion.div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.10)",
        ...style,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...SPRING, delay }}
      whileHover={{ y: -4, background: "rgba(255,255,255,0.08)" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Site Section Icon ──────────────────────────────────────── */
function SiteIcon({ to, emoji, label, color, tip }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <motion.div
        className="relative flex flex-col items-center gap-2 cursor-pointer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${color}15`, border: `1px solid ${color}40` }}
          animate={{ boxShadow: hovered ? `0 0 20px ${color}50` : "none" }}
          transition={SPRING}
        >
          {emoji}
        </motion.div>
        <span style={{ fontFamily: "'Montserrat',sans-serif", color: "#9ca3af", fontSize: "0.65rem", textAlign: "center", letterSpacing: "0.04em" }}>
          {label}
        </span>
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute -top-16 left-1/2 z-20 px-3 py-2 rounded-xl text-xs pointer-events-none"
              style={{
                fontFamily: "'Inter',sans-serif",
                background: "rgba(3,7,18,0.95)",
                border: `1px solid ${color}40`,
                color: "#e5e7eb",
                width: 160,
                transform: "translateX(-50%)",
                lineHeight: 1.5,
              }}
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={SPRING}
            >
              {tip}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function TacticsPage() {
  const [activeTab, setActiveTab] = useState("football");
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [userRole, setUserRole] = useState("visitor");

  const footballRef = useRef(null);
  const fivesRef = useRef(null);
  const bettingRef = useRef(null);
  const tutorialRef = useRef(null);
  const calloutRef = useRef(null);

  const footballInView = useInView(footballRef, { once: true, margin: "-60px" });
  const fivesInView = useInView(fivesRef, { once: true, margin: "-60px" });
  const bettingInView = useInView(bettingRef, { once: true, margin: "-60px" });
  const tutorialInView = useInView(tutorialRef, { once: true, margin: "-60px" });
  const calloutInView = useInView(calloutRef, { once: true, margin: "-60px" });

  useEffect(() => {
    document.title = "Tactics Hub — 5s Arena Blog";
    try {
      const u = JSON.parse(localStorage.getItem("5s_current_user") || "{}");
      if (u?.role) setUserRole(u.role);
    } catch {}
  }, []);

  /* Rotate orbit angle continuously when tab is not locked */
  useEffect(() => {
    const id = setInterval(() => {
      setOrbitAngle((a) => (a + 0.4) % 360);
    }, 16);
    return () => clearInterval(id);
  }, []);

  const TAB_DEFS = [
    { id: "football", label: "⚽ Football",  color: "#22c55e", baseAngle: 270 },
    { id: "fives",    label: "🏟️ 5s Arena",  color: "#06b6d4", baseAngle: 30  },
    { id: "betting",  label: "💰 Betting",   color: "#f59e0b", baseAngle: 150 },
  ];

  const ROLE_MESSAGES = {
    admin: {
      icon: "👑",
      color: "#f59e0b",
      title: "Admin Full Access",
      body: "You have full access to all tactical content, betting analysis, and site-wide navigation. Use the tutorial below to explore every section.",
    },
    author: {
      icon: "✍️",
      color: "#a855f7",
      title: "Author Tactics Mode",
      body: "Use these tactical frameworks as inspiration for your next post. The 5s Arena and Football sections are especially content-rich for articles.",
    },
    visitor: {
      icon: "📖",
      color: "#06b6d4",
      title: "Reader Tactics Guide",
      body: "Explore our tactical breakdowns to deepen your football knowledge. Click any card to learn more, and check the site tutorial below.",
    },
  };

  const role = ROLE_MESSAGES[userRole] || ROLE_MESSAGES.visitor;

  return (
    <div style={{ background: "#030712", minHeight: "100vh", color: "#f9fafb" }}>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center py-28 px-4 text-center"
        style={{
          background: "linear-gradient(160deg, #030712 0%, #0a1a0a 40%, #030712 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
          minHeight: "520px",
        }}
      >
        {/* Pitch texture lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full pointer-events-none"
            style={{
              height: 1,
              top: `${15 + i * 14}%`,
              background: `rgba(34,197,94,0.04)`,
            }}
          />
        ))}
        {/* Vertical pitch lines */}
        {[20, 40, 60, 80].map((pct, i) => (
          <div
            key={i}
            className="absolute h-full pointer-events-none"
            style={{ width: 1, left: `${pct}%`, background: "rgba(34,197,94,0.03)" }}
          />
        ))}

        {/* Ambient glow orbs */}
        {["#22c55e", "#06b6d4", "#f59e0b"].map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 350,
              height: 350,
              background: `radial-gradient(circle, ${c}10 0%, transparent 70%)`,
              left: `${10 + i * 35}%`,
              top: "20%",
            }}
            animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Title */}
        <div className="relative z-10">
          <motion.p
            style={{ fontFamily: "'Montserrat',sans-serif", color: "#22c55e", fontSize: "0.8rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            5s Arena Blog
          </motion.p>
          {"TACTICS HUB".split("").map((ch, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: "clamp(3.5rem,12vw,7rem)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                display: "inline-block",
                color: i < 7 ? "#22c55e" : "#f9fafb",
                textShadow: i < 7 ? "0 0 40px rgba(34,197,94,0.5)" : "none",
              }}
              initial={{ y: -60, opacity: 0, rotate: (i % 2 === 0 ? -8 : 8) }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ ...SPRING, delay: 0.15 + i * 0.04 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}

          {/* Orbiting tabs */}
          <div className="relative mx-auto mt-12" style={{ width: 280, height: 140 }}>
            {TAB_DEFS.map((tab) => {
              const finalAngle = tab.baseAngle + (activeTab === tab.id ? 0 : orbitAngle);
              return (
                <OrbitingTab
                  key={tab.id}
                  label={tab.label}
                  angle={finalAngle}
                  radius={110}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  color={tab.color}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FOOTBALL TACTICS ══════════════════════════════════════ */}
      <section ref={footballRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Swirling gradient tab header */}
          <motion.div
            className="mb-10 inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #22c55e30, #06b6d430, #f59e0b30)",
              border: "1px solid rgba(34,197,94,0.3)",
              backgroundSize: "300% 300%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ fontSize: "1.5rem" }}>⚽</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.4rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Football Tactics
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FOOTBALL_TACTICS.map((t, i) => (
              <GlassCard key={t.id} delay={i * 0.08} inView={footballInView} style={{ borderColor: `${t.color}20` }}>
                <div className="flex items-center gap-3 mb-3">
                  <motion.span
                    style={{ fontSize: "1.8rem" }}
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  >
                    {t.icon}
                  </motion.span>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", color: t.color, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t.name}
                  </h3>
                </div>
                <PitchDiagram type={t.pitch} color={t.color} />
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.65, marginTop: "0.75rem" }}>
                  {t.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5S ARENA TACTICS ══════════════════════════════════════ */}
      <section ref={fivesRef} className="py-16 px-4" style={{ background: "rgba(6,182,212,0.03)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #06b6d430, #22c55e30, #06b6d430)",
              border: "1px solid rgba(6,182,212,0.3)",
            }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            <span style={{ fontSize: "1.5rem" }}>🏟️</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.4rem", color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              5s Arena Tactics
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {FIVES_TACTICS.map((t, i) => (
              <GlassCard key={t.id} delay={i * 0.08} inView={fivesInView} style={{ borderColor: `${t.color}20` }}>
                <motion.span
                  style={{ fontSize: "2rem", display: "block", marginBottom: "0.6rem" }}
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
                >
                  {t.icon}
                </motion.span>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", color: t.color, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  {t.name}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.65 }}>
                  {t.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BETTING TACTICS ═══════════════════════════════════════ */}
      <section ref={bettingRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #f59e0b30, #ef444430, #f59e0b30)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            <span style={{ fontSize: "1.5rem" }}>💰</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.4rem", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Betting Tactics
            </h2>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            className="mb-8 px-5 py-4 rounded-2xl flex items-start gap-4"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.5)",
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            <motion.span
              style={{ fontSize: "1.5rem", flexShrink: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚠️
            </motion.span>
            <div>
              <p style={{ fontFamily: "'Oswald',sans-serif", color: "#f59e0b", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                Gambling Disclaimer
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#fcd34d", fontSize: "0.82rem", lineHeight: 1.6 }}>
                Betting tactics are for educational and entertainment purposes only. Always gamble responsibly. Only bet what you can afford to lose. If gambling is causing problems, visit{" "}
                <a href="https://www.responsiblegambling.org" target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b" }}>responsiblegambling.org</a>.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BETTING_TACTICS.map((t, i) => (
              <GlassCard key={t.id} delay={i * 0.1} inView={bettingInView} style={{ borderColor: `${t.color}20` }}>
                <motion.span
                  style={{ fontSize: "2rem", display: "block", marginBottom: "0.6rem" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                >
                  {t.icon}
                </motion.span>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", color: t.color, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  {t.name}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.65 }}>
                  {t.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USER ROLE CALLOUT ═════════════════════════════════════ */}
      <section ref={calloutRef} className="py-12 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="rounded-2xl p-6 flex items-start gap-5"
            style={{
              background: `${role.color}10`,
              border: `1px solid ${role.color}40`,
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={calloutInView ? { opacity: 1, y: 0 } : {}}
            transition={SPRING}
          >
            <motion.span
              style={{ fontSize: "2.5rem", flexShrink: 0 }}
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {role.icon}
            </motion.span>
            <div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", color: role.color, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                {role.title}
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.88rem", lineHeight: 1.7 }}>
                {role.body}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ WEBSITE INTERACTIVE TUTORIAL ══════════════════════════ */}
      <section ref={tutorialRef} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="mb-2"
            style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.1em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={tutorialInView ? { opacity: 1, y: 0 } : {}}
            transition={SPRING}
          >
            <span style={{ color: "#22c55e" }}>/// </span>WEBSITE NAVIGATION GUIDE
          </motion.h2>
          <motion.p
            className="mb-10"
            style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.85rem" }}
            initial={{ opacity: 0 }}
            animate={tutorialInView ? { opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            Hover over any icon to learn what each section of the 5s Arena Blog does.
          </motion.p>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-6 justify-items-center">
            {SITE_SECTIONS.map((s, i) => (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, y: 20 }}
                animate={tutorialInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...SPRING, delay: i * 0.07 }}
              >
                <SiteIcon {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BottomNavBar />
    </div>
  );
}
