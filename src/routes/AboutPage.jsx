import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { getAuthors, getPostsByAuthor } from "@/services/postService";

/* ── Data ── */
/* authorList is now fetched via state */

/* ── Animation variants ── */
const fadeUp  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } } };
const fadeIn  = { hidden: { opacity: 0 },         visible: { opacity: 1, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 },         visible: { opacity: 1, transition: { staggerChildren: 0.09 } } };

/* ── Category cards data ── */
const CATEGORIES = [
  {
    name: "Culture",
    color: "#10b981",
    icon: "🎨",
    description: "The rituals, slang, celebrations, and community spirit that make football more than a sport.",
    badge: "badge-culture",
  },
  {
    name: "Legends",
    color: "#f59e0b",
    icon: "🏆",
    description: "Profiles on icons who shaped the game — from township heroes to global superstars.",
    badge: "badge-legends",
  },
  {
    name: "Skills",
    color: "#06b6d4",
    icon: "⚡",
    description: "Step-by-step technique guides, drill breakdowns, and training tips for all levels.",
    badge: "badge-skills",
  },
  {
    name: "Tactics",
    color: "#8b5cf6",
    icon: "🧠",
    description: "Deep dives into formations, pressing systems, and the chess moves that win matches.",
    badge: "badge-tactics",
  },
  {
    name: "Fitness",
    color: "#ef4444",
    icon: "💪",
    description: "Conditioning, nutrition, recovery, and the physical edge that separates good from great.",
    badge: "badge-fitness",
  },
  {
    name: "Community",
    color: "#3b82f6",
    icon: "🤝",
    description: "Local leagues, grassroots stories, and the people keeping the beautiful game alive.",
    badge: "badge-community",
  },
];

/* ── Animated counter hook ── */
function useCounter(target, isInView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 22);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return count;
}

/* ── Stats bar ── */
const STATS = [
  { value: 46, label: "Articles",     suffix: "",  icon: "📰" },
  { value: 7,  label: "Video Posts",  suffix: "",  icon: "🎬" },
  { value: 6,  label: "Authors",      suffix: "",  icon: "✍️" },
  { value: 1,  label: "Cape Town",    suffix: "",  icon: "📍", isText: true, display: "CPT" },
];

function StatItem({ stat, inView }) {
  const count = useCounter(stat.isText ? 0 : stat.value, inView);
  return (
    <motion.div variants={fadeUp} className="text-center">
      <div className="text-3xl mb-2">{stat.icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3rem)", color: "#22c55e", textShadow: "0 0 24px rgba(34,197,94,0.45)", lineHeight: 1 }}>
        {stat.isText ? stat.display : count}{stat.suffix}
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginTop: "0.25rem" }}>
        {stat.label}
      </div>
    </motion.div>
  );
}

function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="py-12 px-4"
      style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        {STATS.map(stat => <StatItem key={stat.label} stat={stat} inView={inView} />)}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ABOUT PAGE
   ══════════════════════════════════════════════════ */
export default function AboutPage() {
  const [authorList, setAuthorList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "About — 5s Arena Blog";
    window.scrollTo(0, 0);

    async function fetchAuthors() {
      try {
        const data = await getAuthors();
        setAuthorList(data || []);
      } catch (err) {
        console.error("Failed to fetch authors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthors();
  }, []);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ══ 1. HERO ══ */}
      <div className="relative overflow-hidden py-28 text-center"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}>
        {/* Pitch line texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 58px, rgba(34,197,94,0.5) 58px, rgba(34,197,94,0.5) 59px),
              repeating-linear-gradient(90deg, transparent, transparent 96px, rgba(34,197,94,0.25) 96px, rgba(34,197,94,0.25) 97px)
            `,
          }} />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.12) 0%, transparent 62%)" }} />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none"
          style={{ background: "radial-gradient(circle at top left, rgba(34,197,94,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom right, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

        <motion.div className="relative z-10 px-4"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}>
          {/* Eyebrow label */}
          <motion.div className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#22c55e", padding: "4px 14px", border: "1px solid rgba(34,197,94,0.35)", borderRadius: "999px", background: "rgba(34,197,94,0.08)" }}>
              Cape Town, South Africa
            </span>
          </motion.div>

          <h1 className="gradient-text mb-5"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(3.5rem, 12vw, 7rem)", letterSpacing: "0.04em", lineHeight: 1 }}>
            About 5s Arena
          </h1>

          <p className="max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "1.05rem", lineHeight: 1.7 }}>
            The premier football content destination born on the streets of Cape Town — celebrating the beautiful game from grassroots pitches to global arenas.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ width: 32, height: 1, background: "linear-gradient(to right, transparent, rgba(34,197,94,0.5))" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }} />
            <div style={{ width: 32, height: 1, background: "linear-gradient(to left, transparent, rgba(34,197,94,0.5))" }} />
          </div>
        </motion.div>
      </div>

      {/* ══ 2. STATS BAR ══ */}
      <StatsBar />

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-24">

        {/* ══ 3. OUR MISSION ══ */}
        <section>
          <motion.div className="section-heading mb-8 text-2xl text-white"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 220 }}>
            Our Mission
          </motion.div>
          <motion.div className="glass-card rounded-2xl p-8 md:p-10"
            style={{ borderLeft: "3px solid #22c55e", borderRadius: "0 16px 16px 0" }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#d1d5db", fontSize: "1.05rem", lineHeight: 1.85 }}>
              At <strong style={{ color: "#22c55e" }}>5s Arena Blog</strong>, our mission is simple: make football content that actually matters to players, fans, and communities. We don&apos;t chase clicks with transfer rumours or manufactured controversy. We go deeper — into the tactics, the culture, the skills, and the human stories that make football the world&apos;s most powerful sport.
            </p>
            <p className="mt-4" style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "1rem", lineHeight: 1.8 }}>
              Every article we publish is crafted by someone who genuinely loves the game. Whether it&apos;s a tactical breakdown of a pressing system, a profile of a grassroots legend, or a guide to mastering your first Rabona — we write it because it deserves to be written.
            </p>
          </motion.div>
        </section>

        {/* ══ 4. OUR STORY ══ */}
        <section>
          <motion.div className="section-heading mb-8 text-2xl text-white"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 220 }}>
            Our Story
          </motion.div>
          <motion.div className="glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
            {/* Cover image */}
            <div className="relative overflow-hidden" style={{ maxHeight: 320 }}>
              <img src="/posts/about.png" alt="5s Arena community"
                className="w-full object-cover"
                style={{ filter: "brightness(0.75)" }}
                onError={e => { e.target.style.display = "none"; }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(3,7,18,0.95) 100%)" }} />
            </div>

            <div className="p-8 md:p-10 space-y-5"
              style={{ fontFamily: "'Inter', sans-serif", color: "#d1d5db", fontSize: "1rem", lineHeight: 1.85 }}>
              <p>
                5s Arena Blog was born out of a caged pitch in Cape Town, where a group of friends couldn&apos;t stop talking football long after the final whistle. What started as WhatsApp threads and voice notes turned into a proper media project — a place to write the articles we wished existed.
              </p>
              <p>
                Cape Town&apos;s football culture is electric. From the dusty township pitches of Khayelitsha to the astroturf arenas of the northern suburbs, the game runs through this city&apos;s veins. Our writers are part of that culture — they&apos;ve played in those leagues, coached those teams, and felt every last-minute heartbreak.
              </p>
              <p>
                We launched with six writers and a shared belief: that <strong style={{ color: "#06b6d4" }}>football content should be as passionate as the game itself</strong>. Since then we&apos;ve grown into a community of readers from across South Africa and beyond, united by an obsession with the beautiful game in all its forms.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ══ 5. WHAT WE COVER ══ */}
        <section>
          <motion.div className="section-heading mb-8 text-2xl text-white"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 220 }}>
            What We Cover
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {CATEGORIES.map(cat => (
              <motion.div key={cat.name} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: `0 16px 40px ${cat.color}22` }}
                className="glass-card rounded-2xl p-6 cursor-default"
                style={{ transition: "box-shadow 0.3s ease" }}>
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div style={{ fontSize: "1.75rem", lineHeight: 1 }}>{cat.icon}</div>
                  <span className="label-tag px-3 py-1 rounded-full text-white text-xs"
                    style={{ background: cat.color, opacity: 0.9 }}>
                    {cat.name}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", color: "#f9fafb", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  {cat.name}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  {cat.description}
                </p>
                {/* Color bar accent */}
                <div className="mt-4 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, ${cat.color}, transparent)` }} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ 6. OUR TEAM ══ */}
        <section>
          <motion.div className="section-heading mb-8 text-2xl text-white"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 220 }}>
            Meet the Team
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {authorList.map((author, i) => {
              const postCount = getPostsByAuthor(author.name).length;
              return (
                <motion.div key={author.name} variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(34,197,94,0.15)" }}>
                  <Link to={`/authors/${encodeURIComponent(author.name)}`} className="block h-full">
                    <div className="glass-card rounded-2xl p-6 text-center h-full"
                      style={{ transition: "box-shadow 0.3s ease" }}>
                      {/* Avatar */}
                      <div className="relative inline-block mb-4">
                        <img src={author.image} alt={author.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto"
                          style={{ border: "3px solid rgba(34,197,94,0.35)", boxShadow: "0 0 22px rgba(34,197,94,0.22)" }}
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=16a34a&color=fff&size=96`; }}
                        />
                        {/* Online glow dot */}
                        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                          style={{ background: "#22c55e", border: "2px solid #030712", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
                      </div>

                      <h3 style={{ fontFamily: "'Oswald', sans-serif", color: "#f9fafb", fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                        {author.name}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "0.78rem", lineHeight: 1.55, marginBottom: "1rem" }}>
                        {author.bio}
                      </p>

                      {/* Article count badge */}
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ fontFamily: "'Montserrat', sans-serif", background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                        {postCount} Article{postCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

      </div>{/* /max-w-5xl */}

      {/* ══ 7. JOIN US CTA ══ */}
      <section className="relative overflow-hidden py-24 text-center"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 70%, #111827 100%)",
          borderTop: "1px solid rgba(34,197,94,0.15)",
        }}>
        {/* Pitch texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 58px, rgba(34,197,94,0.5) 58px, rgba(34,197,94,0.5) 59px),
              repeating-linear-gradient(90deg, transparent, transparent 96px, rgba(34,197,94,0.25) 96px, rgba(34,197,94,0.25) 97px)
            `,
          }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 65%)" }} />

        <motion.div className="relative z-10 px-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 24 }}>

          {/* Football icon */}
          <div className="text-5xl mb-5 animate-spin-slow inline-block">⚽</div>

          <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", letterSpacing: "0.04em", lineHeight: 1, color: "#f9fafb", marginBottom: "1rem" }}>
            Be Part of the Game
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Dive into our articles, follow our authors, and connect with the 5s Arena community. Football is better together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Browse Articles */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/posts"
                className="btn-primary ripple-effect inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white"
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
                <span>📰</span> Browse Articles
              </Link>
            </motion.div>

            {/* WhatsApp */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold"
                style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", textTransform: "uppercase",
                  letterSpacing: "0.1em", textDecoration: "none", color: "#f9fafb",
                  background: "linear-gradient(135deg, #075e54, #25d366)",
                  boxShadow: "0 0 20px rgba(37,211,102,0.3)",
                }}>
                <span>💬</span> WhatsApp Us
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
