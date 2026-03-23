import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

const fadeUp  = { hidden: { opacity:0, y:30 }, visible: { opacity:1, y:0, transition:{ type:"spring", stiffness:280, damping:22 } } };
const stagger = { hidden: { opacity:0 }, visible: { opacity:1, transition:{ staggerChildren:0.09 } } };

/* ── Animated counter ── */
function useCounter(target, active) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let n = 0; const step = target / 55;
    const t = setInterval(() => { n += step; if (n >= target) { setV(target); clearInterval(t); } else setV(Math.floor(n)); }, 22);
    return () => clearInterval(t);
  }, [active, target]);
  return v;
}

/* ── Stats bar ── */
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const stats = [
    { label:"Members",  target:1200, suffix:"+" , icon:"👥" },
    { label:"Articles", target:46,   suffix:"",   icon:"📰" },
    { label:"Videos",   target:7,    suffix:"",   icon:"🎬" },
    { label:"Authors",  target:6,    suffix:"",   icon:"✍️" },
  ];
  return (
    <div ref={ref} className="py-10 px-4" style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ label, target, suffix, icon }) => {
          const count = useCounter(target, inView);
          return (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.5rem", color:"#22c55e", textShadow:"0 0 20px rgba(34,197,94,0.4)" }}>
                {count.toLocaleString()}{suffix}
              </div>
              <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"#6b7280" }}>
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Discussions ── */
const DISCUSSIONS = [
  { emoji:"⚽", author:"Jackson Wayne", cat:"Tactics", title:"What formation works best in 5-a-side?", likes:24, replies:11, time:"2h ago", color:"#8b5cf6" },
  { emoji:"💪", author:"Dent Prov", cat:"Fitness", title:"How do you train between matches?", likes:18, replies:7, time:"5h ago", color:"#ef4444" },
  { emoji:"🏆", author:"Halley Watikise", cat:"Legends", title:"Greatest 5-a-side player of all time?", likes:41, replies:22, time:"1d ago", color:"#f59e0b" },
  { emoji:"🎯", author:"Hell Mandat", cat:"Skills", title:"Best drills for close ball control", likes:15, replies:5, time:"1d ago", color:"#06b6d4" },
  { emoji:"🤝", author:"Johannes Cobelt", cat:"Community", title:"Join our Cape Town Saturday league", likes:33, replies:14, time:"2d ago", color:"#3b82f6" },
  { emoji:"📰", author:"John Stu", cat:"Culture", title:"How 5-a-side is changing Cape Town", likes:29, replies:9, time:"3d ago", color:"#10b981" },
];

/* ── Rules accordion ── */
const RULES = [
  { icon:"🤝", title:"Respect Everyone", body:"Treat all members with respect. No hate speech, discrimination, or personal attacks. Football is for everyone." },
  { icon:"🚫", title:"No Spam or Self-Promo", body:"Don't flood the community with repetitive posts or unsolicited promotions. Quality over quantity." },
  { icon:"⚽", title:"Stay on Topic", body:"Keep discussions football-related. For off-topic chats, use the WhatsApp group." },
  { icon:"💬", title:"Support Each Other", body:"Help fellow community members. Share knowledge, offer tips, and celebrate wins together." },
  { icon:"🔒", title:"Respect Privacy", body:"Don't share personal information about other members. What's shared in the community stays in the community." },
];

function RuleAccordion({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}
      whileHover={{ borderColor:"rgba(34,197,94,0.25)" }}
    >
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between p-4 text-left"
        style={{ background:"transparent", border:"none", cursor:"pointer" }}
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{rule.icon}</span>
          <span style={{ fontFamily:"'Oswald',sans-serif", color:"#f9fafb", fontSize:"0.95rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>{rule.title}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.25 }} style={{ color:"#6b7280", fontSize:"0.9rem" }}>▾</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.28 }} style={{ overflow:"hidden" }}
          >
            <p className="px-4 pb-4 pt-0" style={{ fontFamily:"'Inter',sans-serif", color:"#9ca3af", fontSize:"0.875rem", lineHeight:"1.6" }}>
              {rule.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) { setJoined(true); localStorage.setItem("5s_newsletter_email", email.trim()); }
  };

  return (
    <div style={{ background:"#030712", minHeight:"100vh", color:"#f9fafb" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-28 px-4 text-center">
        {/* Pitch lines */}
        <div className="absolute inset-0 pointer-events-none opacity-8"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.15) 60px,rgba(34,197,94,0.15) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(34,197,94,0.08) 60px,rgba(34,197,94,0.08) 61px)" }} />
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.12) 0%, transparent 65%)" }} />

        <motion.div className="relative z-10 max-w-4xl mx-auto" variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.8rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#22c55e", marginBottom:"1rem" }}>
            📍 Cape Town, South Africa
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
            {["THE", "5S", "ARENA", "COMMUNITY"].map((word, wi) => (
              <motion.span
                key={word}
                style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"clamp(3rem,10vw,7rem)",
                  letterSpacing:"0.05em",
                  lineHeight:1,
                  color: wi === 1 ? "#22c55e" : wi === 3 ? "#06b6d4" : "#f9fafb",
                  textShadow: wi === 1 ? "0 0 40px rgba(34,197,94,0.6)" : wi === 3 ? "0 0 40px rgba(6,182,212,0.6)" : "none",
                  display:"inline-block",
                }}
                animate={{ y:[0,-8,0] }}
                transition={{ duration:2.4, repeat:Infinity, delay:wi*0.2, ease:"easeInOut" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} style={{ fontFamily:"'Inter',sans-serif", color:"#9ca3af", fontSize:"1.05rem", maxWidth:"560px", margin:"0 auto 2rem" }}>
            Where football lovers connect, learn, and play together. Cape Town's home for 5-a-side passion.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/27637820245?text=I%20want%20to%20join%20the%205s%20Arena%20community!" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ fontFamily:"'Montserrat',sans-serif", background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#fff", boxShadow:"0 0 24px rgba(34,197,94,0.4)", border:"none", cursor:"pointer" }}
                whileHover={{ y:-2, boxShadow:"0 0 40px rgba(34,197,94,0.6)" }} whileTap={{ scale:0.97 }}
              >
                💬 Join the WhatsApp Group
              </motion.button>
            </a>
            <Link to="/posts">
              <motion.button
                className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ fontFamily:"'Montserrat',sans-serif", background:"rgba(255,255,255,0.06)", color:"#f9fafb", border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer" }}
                whileHover={{ background:"rgba(255,255,255,0.1)", y:-2 }} whileTap={{ scale:0.97 }}
              >
                📰 Browse Articles
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <StatsBar />

      {/* ── What We're About ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
          className="section-heading text-center mb-12 text-white text-3xl"
          style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.06em" }}>
          What We're About
        </motion.h2>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}} className="grid md:grid-cols-3 gap-6">
          {[
            { icon:"🤝", title:"Connect", color:"#22c55e", desc:"Meet fellow 5-a-side enthusiasts from Cape Town and beyond. Share your passion, find new teammates, and build lasting football friendships." },
            { icon:"📚", title:"Learn", color:"#06b6d4", desc:"Sharpen your tactics, fitness, and skills with content from our expert authors. Every article is written by people who live and breathe the beautiful game." },
            { icon:"⚽", title:"Play Together", color:"#f59e0b", desc:"Find local games, join our Saturday leagues, and get involved in 5s Arena events. Football is always better when we play it together." },
          ].map(({ icon, title, color, desc }) => (
            <motion.div
              key={title} variants={fadeUp}
              className="rounded-2xl p-7 text-center"
              style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${color}20`, backdropFilter:"blur(8px)" }}
              whileHover={{ y:-4, boxShadow:`0 16px 40px ${color}20`, borderColor:`${color}50` }}
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", letterSpacing:"0.06em", color, marginBottom:"0.75rem" }}>{title}</h3>
              <p style={{ fontFamily:"'Inter',sans-serif", color:"#9ca3af", fontSize:"0.9rem", lineHeight:"1.65" }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Latest Discussions ── */}
      <section className="max-w-6xl mx-auto px-4 py-16" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-8">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:"0.06em", color:"#f9fafb" }}>
            💬 Latest Discussions
          </motion.h2>
          <Link to="/posts" style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.8rem", color:"#22c55e", textDecoration:"none" }}>
            View All →
          </Link>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISCUSSIONS.map(({ emoji, author, cat, title, likes, replies, time, color }) => (
            <motion.div
              key={title} variants={fadeUp}
              className="rounded-2xl p-5"
              style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${color}18`, backdropFilter:"blur(8px)" }}
              whileHover={{ y:-3, borderColor:`${color}50`, boxShadow:`0 8px 24px ${color}18` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background:`${color}25`, border:`1px solid ${color}50` }}>{emoji}</span>
                <span style={{ fontFamily:"'Inter',sans-serif", color:"#6b7280", fontSize:"0.75rem" }}>{author}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs" style={{ fontFamily:"'Montserrat',sans-serif", background:`${color}20`, color, fontWeight:600 }}>{cat}</span>
              </div>
              <Link to="/posts" style={{ textDecoration:"none" }}>
                <h4 style={{ fontFamily:"'Oswald',sans-serif", color:"#f9fafb", fontSize:"1rem", textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.3, marginBottom:"0.75rem" }}>{title}</h4>
              </Link>
              <div className="flex items-center gap-4" style={{ fontFamily:"'Inter',sans-serif", color:"#6b7280", fontSize:"0.75rem" }}>
                <span>❤️ {likes}</span>
                <span>💬 {replies}</span>
                <span className="ml-auto">{time}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Community Rules ── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
          className="text-center mb-8"
          style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.2rem", letterSpacing:"0.06em", color:"#f9fafb" }}>
          📋 Community Rules
        </motion.h2>
        <div className="space-y-3">
          {RULES.map((rule) => <RuleAccordion key={rule.title} rule={rule} />)}
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center" style={{ background:"linear-gradient(180deg,#052e16 0%,#030712 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 60%)" }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            animate={{ rotate:[0,10,-10,0] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
            style={{ fontSize:"4rem", display:"inline-block", marginBottom:"1.5rem" }}
          >⚽</motion.div>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
            style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,7vw,4rem)", letterSpacing:"0.05em", color:"#f9fafb", marginBottom:"0.75rem" }}>
            READY TO JOIN THE ARENA?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
            style={{ fontFamily:"'Inter',sans-serif", color:"#9ca3af", marginBottom:"2rem", lineHeight:1.65 }}>
            Subscribe to our newsletter and never miss a match, article, or community event.
          </motion.p>

          {!joined ? (
            <motion.form onSubmit={handleNewsletter} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#f9fafb", fontFamily:"'Inter',sans-serif" }}
              />
              <motion.button type="submit"
                className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ fontFamily:"'Montserrat',sans-serif", background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#fff", border:"none", cursor:"pointer", whiteSpace:"nowrap" }}
                whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
              >
                Join the Community
              </motion.button>
            </motion.form>
          ) : (
            <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:280, damping:22 }}
              style={{ fontFamily:"'Oswald',sans-serif", color:"#22c55e", fontSize:"1.2rem", letterSpacing:"0.05em" }}>
              🎉 Welcome to the Arena, legend!
            </motion.div>
          )}

          <div className="mt-6">
            <a href="https://wa.me/27637820245?text=Hey%205s%20Arena%2C%20I%20want%20to%20join%20the%20community!" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:"'Inter',sans-serif", color:"#25d366", fontSize:"0.9rem", textDecoration:"none" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
              📱 Or join via WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
