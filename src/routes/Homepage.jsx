import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { getFeaturedPosts, getRecentPosts } from "@/services/postService";
import Newsletter from "@/components/Newsletter";
import NewsletterPopup from "@/components/NewsletterPopup";
import PostCard, { FeaturedPostCard } from "@/components/PostCard";
import posts from "@/data/posts";

/* ── Data ── */
const allPosts        = posts;
const featuredPosts   = getFeaturedPosts();
const recentPosts     = getRecentPosts(9);
const videoPosts      = allPosts.filter(p => p.video).slice(0, 7);

/* ── Fixtures preview data (3 live matches) ── */
const LIVE_PREVIEW = [
  { id:1, home:'Arsenal',        away:'Chelsea',        homeScore:2, awayScore:1, minute:67, league:'Premier League' },
  { id:2, home:'Manchester City',away:'Liverpool',      homeScore:1, awayScore:1, minute:34, league:'Premier League' },
  { id:3, home:'Real Madrid',    away:'Sevilla',        homeScore:2, awayScore:0, minute:78, league:'La Liga' },
];

/* ── Social links ── */
const SOCIAL = [
  { href:'https://www.facebook.com/profile.php?id=61588019843126', label:'Facebook',  color:'#1877f2', followers:'2.4K', icon:'📘' },
  { href:'https://www.instagram.com/fivesarena',                   label:'Instagram', color:'#e1306c', followers:'3.1K', icon:'📸' },
  { href:'https://www.tiktok.com/@fivesarena',                     label:'TikTok',   color:'#69c9d0', followers:'5.8K', icon:'🎵' },
  { href:'https://wa.me/27637820245',                              label:'WhatsApp', color:'#25d366', followers:'Message Us', icon:'💬' },
];

/* ── Animation variants ── */
const fadeUp   = { hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{type:'spring',stiffness:280,damping:22}} };
const stagger  = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.08}} };

/* ── Animated counter hook ── */
function useCounter(target, isInView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return count;
}

/* ── Video Post Card — full-bleed 21/9 banner with hover-to-play ── */
function VideoPostCard({ post, index = 0 }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    setHovered(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <Link to={`/${post.slug}`}>
      <motion.div
        className="relative w-full rounded-xl overflow-hidden cursor-pointer"
        style={{ aspectRatio: '21/9', background: '#000' }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: index * 0.07 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Poster image — shown when not hovered */}
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 0 : 1 }}
        />
        {/* Video — plays on hover */}
        <video
          ref={videoRef}
          src={post.video}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        />

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }} />

        {/* Top-left badge — ▶ Video */}
        <div className="absolute top-3 left-3 z-10">
          {hovered ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 bg-green-500 text-black text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
            >
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-black"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              Playing
            </motion.span>
          ) : (
            <span className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full" style={{ fontFamily: "'Montserrat',sans-serif" }}>
              ▶ Video
            </span>
          )}
        </div>

        {/* Reading time badge */}
        <span className="absolute top-3 right-3 z-10 text-white text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', fontFamily: "'Inter',sans-serif" }}>
          {post.readingTime} min
        </span>

        {/* Center play icon — fades out on hover */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-block w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[17px] border-l-white ml-1" />
        </motion.div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className="label-tag text-xs px-2 py-0.5 rounded-full text-white inline-block mb-2"
            style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)' }}
          >
            {post.category}
          </span>
          <h3
            className="text-white line-clamp-2 leading-none"
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: '0.04em',
              color: hovered ? '#22c55e' : '#f9fafb',
              transition: 'color 0.25s',
            }}
          >
            {post.title}
          </h3>
          {post.author && (
            <div className="flex items-center gap-2 mt-2">
              <img src={post.author.image} alt={post.author.name} className="w-5 h-5 rounded-full object-cover border border-white/20"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=16a34a&color=fff`; }} />
              <span className="text-gray-300 text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Green left border on hover */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
          style={{ background: 'linear-gradient(to bottom, #22c55e, #06b6d4)' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

/* ── Stats Bar component ── */
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const stats = [
    { value:46, label:'Articles', suffix:'', icon:'📰' },
    { value:7,  label:'Video Posts', suffix:'', icon:'🎬' },
    { value:6,  label:'Leagues', suffix:'', icon:'🏆' },
    { value:1,  label:'K+ Readers', suffix:'K+', icon:'👥' },
  ];
  return (
    <div ref={ref} className="py-8 px-4" style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ value, label, suffix, icon }) => {
          const count = useCounter(value, inView);
          return (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'2.5rem', color:'#22c55e', textShadow:'0 0 20px rgba(34,197,94,0.4)' }}>
                {count}{suffix}
              </div>
              <div style={{ fontFamily:"'Montserrat', sans-serif", fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'#6b7280' }}>
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Video cycling strip ── */
function VideoCyclingStrip() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoveredSidebar, setHoveredSidebar] = useState(null); // index hovered in sidebar, or null
  const videoRef = useRef(null);
  const sidebarVideoRefs = useRef([]); // refs for each sidebar card video

  /* Main player auto-cycle — pauses when main player is hovered OR sidebar is hovered */
  useEffect(() => {
    if (paused || hoveredSidebar !== null) return;
    const t = setInterval(() => setActiveIdx(i => (i + 1) % videoPosts.length), 10000);
    return () => clearInterval(t);
  }, [paused, hoveredSidebar]);

  /* Reset main player on active change */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeIdx]);

  /* Handle sidebar card hover — stop auto-cycling, play that card's video preview */
  const onSidebarEnter = (i) => {
    setHoveredSidebar(i);
    const vid = sidebarVideoRefs.current[i];
    if (vid) vid.play().catch(() => {});
  };

  const onSidebarLeave = (i) => {
    setHoveredSidebar(null);
    const vid = sidebarVideoRefs.current[i];
    if (vid) { vid.pause(); vid.currentTime = 0; }
  };

  if (!videoPosts.length) return null;
  const active = videoPosts[activeIdx];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="mb-6">
        <h2 className="section-heading text-white text-2xl">🎬 Video Posts</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Main video player */}
        <motion.div
          key={activeIdx}
          initial={{opacity:0, scale:0.97}}
          animate={{opacity:1, scale:1}}
          transition={{type:'spring',stiffness:280,damping:22}}
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{ aspectRatio:'16/9', background:'#000' }}
          onMouseEnter={() => { setPaused(true); videoRef.current?.play().catch(()=>{}); }}
          onMouseLeave={() => { setPaused(false); videoRef.current?.pause(); }}
        >
          <video ref={videoRef} src={active.video} muted loop playsInline className="w-full h-full object-cover" poster={active.image} />
          <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)'}} />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="label-tag text-xs px-2 py-0.5 rounded-full text-white mb-2 inline-block" style={{background:'linear-gradient(135deg,#b45309,#f59e0b)'}}>
              {active.category}
            </span>
            <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.6rem',letterSpacing:'0.04em',color:'#f9fafb',lineHeight:1.1}}>
              {active.title}
            </h3>
          </div>
          {/* Play icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}}>
            <span className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1.5" />
          </div>
        </motion.div>

        {/* Right side — vertical list of larger preview cards */}
        <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '360px' }}>
          {videoPosts.map((vp, i) => {
            const isActive   = i === activeIdx;
            const isHovered  = i === hoveredSidebar;
            return (
              <motion.div
                key={vp.id}
                className="relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                style={{
                  border: `2px solid ${isActive ? 'rgba(34,197,94,0.8)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isActive ? '0 0 18px rgba(34,197,94,0.45)' : 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  background: '#000',
                }}
                onClick={() => { setActiveIdx(i); setPaused(false); }}
                onMouseEnter={() => onSidebarEnter(i)}
                onMouseLeave={() => onSidebarLeave(i)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {/* Thumbnail area — fixed 140px height */}
                <div className="relative w-full" style={{ height: '140px' }}>
                  <img
                    src={vp.image}
                    alt={vp.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
                    style={{ opacity: isHovered ? 0 : 1 }}
                  />
                  <video
                    ref={el => { sidebarVideoRefs.current[i] = el; }}
                    src={vp.video}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
                    style={{ opacity: isHovered ? 1 : 0 }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

                  {/* Top-left badge */}
                  <div className="absolute top-2 left-2 z-10">
                    {isHovered ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-0.5 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.65rem' }}
                      >
                        <motion.span
                          className="inline-block w-1 h-1 rounded-full bg-black"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.9, repeat: Infinity }}
                        />
                        Playing
                      </motion.span>
                    ) : (
                      <span className="flex items-center gap-1 bg-red-600 text-white font-bold px-2 py-0.5 rounded-full" style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.65rem' }}>
                        ▶ Video
                      </span>
                    )}
                  </div>

                  {/* Active green glow border pulse */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: '2px solid rgba(34,197,94,0.7)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>

                {/* Title below thumbnail */}
                <div className="px-3 py-2.5" style={{ background: 'rgba(10,10,10,0.85)' }}>
                  <p
                    className="line-clamp-2 leading-tight"
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: '0.95rem',
                      letterSpacing: '0.03em',
                      color: isActive ? '#22c55e' : '#f9fafb',
                      transition: 'color 0.25s',
                    }}
                  >
                    {vp.title}
                  </p>
                  <p className="mt-0.5" style={{ color: '#9ca3af', fontFamily: "'Inter',sans-serif", fontSize: '0.65rem' }}>
                    {vp.readingTime} min · {vp.category}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 justify-center mt-5">
        {videoPosts.map((_, i) => (
          <button key={i} onClick={() => setActiveIdx(i)} className="transition-all rounded-full"
            style={{ width: i===activeIdx ? 20 : 8, height: 8, background: i===activeIdx ? '#22c55e' : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </section>
  );
}

/* local category gradient helper (mirrors PostCard mapping) */
function getCategoryGradientLocal(cat) {
  const MAP = {
    Culture:       'linear-gradient(135deg,#059669,#22c55e)',
    Legends:       'linear-gradient(135deg,#b45309,#f59e0b)',
    Skills:        'linear-gradient(135deg,#1d4ed8,#06b6d4)',
    Tactics:       'linear-gradient(135deg,#7c3aed,#a78bfa)',
    Fitness:       'linear-gradient(135deg,#0e7490,#22d3ee)',
    Community:     'linear-gradient(135deg,#15803d,#4ade80)',
    News:          'linear-gradient(135deg,#be123c,#f43f5e)',
    "Women's Game":'linear-gradient(135deg,#9d174d,#ec4899)',
  };
  return MAP[cat] ?? 'linear-gradient(135deg,#374151,#6b7280)';
}

/* ── Fixtures Preview Widget ── */
function FixturesPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-12">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="mb-5">
        <h2 className="section-heading text-white text-2xl">⚽ Live Now</h2>
      </motion.div>
      <div className="grid gap-3 md:grid-cols-3 mb-5">
        {LIVE_PREVIEW.map((match, i) => (
          <motion.div
            key={match.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{once:true}}
            transition={{delay:i*0.1}}
            className="rounded-2xl p-4"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(239,68,68,0.2)', boxShadow:'0 0 20px rgba(239,68,68,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.span className="w-2 h-2 rounded-full bg-red-500" animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}} />
              <span className="text-red-400 text-xs font-bold" style={{fontFamily:"'Montserrat',sans-serif"}}>LIVE {match.minute}'</span>
              <span className="text-gray-500 text-xs ml-auto" style={{fontFamily:"'Inter',sans-serif"}}>{match.league}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-white font-semibold text-sm text-right flex-1 truncate" style={{fontFamily:"'Oswald',sans-serif",textTransform:'uppercase'}}>{match.home}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-green-400 font-black text-xl" style={{fontFamily:"'Bebas Neue',sans-serif"}}>{match.homeScore}</span>
                <span className="text-gray-500 font-bold">-</span>
                <span className="text-green-400 font-black text-xl" style={{fontFamily:"'Bebas Neue',sans-serif"}}>{match.awayScore}</span>
              </div>
              <p className="text-white font-semibold text-sm flex-1 truncate" style={{fontFamily:"'Oswald',sans-serif",textTransform:'uppercase'}}>{match.away}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <Link to="/fixtures">
          <motion.button className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-white text-sm" style={{fontFamily:"'Montserrat',sans-serif"}} whileHover={{y:-2}} whileTap={{scale:0.97}}>
            See All Fixtures →
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

/* ── Featured cycling carousel ── */
function FeaturedCarousel() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const advance = (dir) => {
    setDirection(dir);
    setIdx(i => (i + dir + allPosts.length) % allPosts.length);
  };

  useEffect(() => {
    const t = setInterval(() => advance(1), 5000);
    return () => clearInterval(t);
  }, []);

  const visible = [
    allPosts[idx % allPosts.length],
    allPosts[(idx + 1) % allPosts.length],
    allPosts[(idx + 2) % allPosts.length],
  ];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type:'spring', stiffness:280, damping:22 } },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.2 } }),
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-heading text-white text-2xl">🔥 All Posts</h2>
        <div className="flex gap-2">
          <motion.button onClick={() => advance(-1)} className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}} whileHover={{background:'rgba(34,197,94,0.2)'}} whileTap={{scale:0.9}}>
            ←
          </motion.button>
          <motion.button onClick={() => advance(1)} className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}} whileHover={{background:'rgba(34,197,94,0.2)'}} whileTap={{scale:0.9}}>
            →
          </motion.button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={idx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {visible.map((post, i) =>
              post.video ? (
                <VideoPostCard key={`${post.id}-${i}`} post={post} index={i} />
              ) : (
                <PostCard key={`${post.id}-${i}`} post={post} index={i} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 justify-center mt-5 flex-wrap">
        {allPosts.map((_, i) => (
          <button key={i} onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); }}
            className="rounded-full transition-all"
            style={{ width: i===idx ? 16 : 6, height: 6, background: i===idx ? '#22c55e' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
    </section>
  );
}

/* ── Social Section ── */
function SocialSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="mb-8 text-center">
        <h2 style={{fontFamily:"'Oswald',sans-serif",fontSize:'1.8rem',textTransform:'uppercase',letterSpacing:'0.05em',color:'#f9fafb'}}>
          Connect With The <span style={{color:'#22c55e'}}>Community</span>
        </h2>
        <p style={{fontFamily:"'Inter',sans-serif",color:'#6b7280',marginTop:'8px'}}>Follow the action. Read the stories. Be part of the game.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SOCIAL.map(({ href, label, color, followers, icon }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{once:true}}
            transition={{delay:i*0.1}}
            className="rounded-2xl p-5 text-center cursor-pointer"
            style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${color}20` }}
            whileHover={{ y:-5, boxShadow:`0 12px 30px ${color}25`, borderColor:`${color}50` }}
            whileTap={{ scale:0.97 }}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:'1.1rem',textTransform:'uppercase',color:'#f9fafb'}}>{label}</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:'0.8rem',color,marginTop:'4px'}}>{followers} Followers</div>
            <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{background:`${color}20`,color,fontFamily:"'Montserrat',sans-serif",textTransform:'uppercase'}}>
              Follow
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN HOMEPAGE
══════════════════════════════════════════════════════════════ */
export default function Homepage() {
  /* DeviceOrientation parallax (mobile) */
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!window.DeviceOrientationEvent) return;
    const handler = (e) => {
      const x = (e.gamma || 0) / 9;
      const y = (e.beta  || 0) / 18;
      setTilt({ x: Math.max(-12, Math.min(12, x)), y: Math.max(-8, Math.min(8, y)) });
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  return (
    <div style={{ background:'var(--color-bg)', minHeight:'100vh' }}>
      <NewsletterPopup />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center text-white overflow-hidden" style={{minHeight:'90vh'}}>
        {/* Parallax bg */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center animate-hero-bg"
          style={{
            backgroundImage:"url('/backgrounds/football-legends-background-1.jpg')",
            transform:`translate(${tilt.x}px, ${tilt.y}px) scale(1.04)`,
            transition:'transform 0.1s ease-out',
          }}
        />
        {/* Dark + gradient overlay */}
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, rgba(3,7,18,0.3) 0%, rgba(3,7,18,0.7) 60%, rgba(3,7,18,1) 100%)'}} />
        {/* Green glow */}
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.08) 0%, transparent 70%)'}} />

        {/* Watermark */}
        <img src="/logo.png" alt="" className="absolute right-8 bottom-8 w-32 h-32 opacity-10 pointer-events-none select-none hidden md:block" />

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl"
          initial={{opacity:0, y:30}}
          animate={{opacity:1, y:0}}
          transition={{type:'spring',stiffness:200,damping:20}}
        >
          <motion.img src="/logo.png" alt="5s Arena" className="w-20 h-20 mx-auto mb-6 drop-shadow-lg rounded-full"
            style={{boxShadow:'0 0 30px rgba(34,197,94,0.4)'}}
            animate={{boxShadow:['0 0 20px rgba(34,197,94,0.3)','0 0 50px rgba(34,197,94,0.6)','0 0 20px rgba(34,197,94,0.3)']}}
            transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}
          />

          <motion.h1
            className="animate-text-focus-in"
            style={{
              fontFamily:"'Bebas Neue', Impact, sans-serif",
              fontSize:'clamp(4rem, 12vw, 10rem)',
              letterSpacing:'0.05em',
              lineHeight:0.9,
              background:'linear-gradient(135deg, #f9fafb 0%, #22c55e 50%, #06b6d4 100%)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              backgroundClip:'text',
              textShadow:'none',
            }}
            whileHover={{
              scale:1.02,
              transition:{type:'spring',stiffness:300,damping:20},
            }}
          >
            5s Arena Blog
          </motion.h1>

          <motion.p
            className="mt-4 mb-8 text-lg md:text-xl text-gray-300 animate-slide-in-bottom"
            style={{fontFamily:"'Inter', sans-serif",animationDelay:'0.3s'}}
          >
            Football culture, stories, legends, and the beautiful game.
          </motion.p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/posts">
              <motion.button className="btn-primary px-8 py-3 rounded-full font-bold text-white text-base" style={{fontFamily:"'Montserrat',sans-serif"}} whileHover={{y:-3}} whileTap={{scale:0.97}}>
                Explore Posts
              </motion.button>
            </Link>
            <Link to="/fixtures">
              <motion.button className="px-8 py-3 rounded-full font-bold text-white text-base" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',fontFamily:"'Montserrat',sans-serif",backdropFilter:'blur(8px)'}} whileHover={{y:-3,background:'rgba(255,255,255,0.15)'}} whileTap={{scale:0.97}}>
                ⚽ Live Fixtures
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}}>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE STRIP ──────────────────────────────────────── */}
      <div className="py-4 overflow-hidden" style={{background:'rgba(34,197,94,0.06)',borderTop:'1px solid rgba(34,197,94,0.15)',borderBottom:'1px solid rgba(34,197,94,0.15)'}}>
        <div className="flex gap-0">
          <div className="animate-marquee flex gap-8 whitespace-nowrap pr-8" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.2rem',letterSpacing:'0.08em',color:'rgba(34,197,94,0.7)',textShadow:'0 0 20px rgba(34,197,94,0.4)'}}>
            {Array(4).fill(null).map((_, j) => (
              <span key={j}>LATEST ARTICLES · LIVE FIXTURES · VIDEO POSTS · LEAGUE NEWS · TACTICS · LEGENDS · CULTURE · SKILLS ·&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <StatsBar />

      {/* ── FIXTURES PREVIEW ───────────────────────────────────── */}
      <FixturesPreview />

      {/* ── FEATURED 3-PANEL GRID ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} className="mb-6">
          <h2 className="section-heading text-white text-2xl">⭐ Featured</h2>
        </motion.div>
        {featuredPosts.length >= 3 && (
          <div className="grid md:grid-cols-2 gap-5" style={{gridTemplateRows:'auto auto'}}>
            {/* Large video card — spans 2 rows */}
            <div className="md:row-span-2">
              <FeaturedPostCard post={featuredPosts.find(p => p.video) || featuredPosts[0]} />
            </div>
            {/* Top post */}
            <FeaturedPostCard post={featuredPosts.find(p => !p.video) || featuredPosts[1]} />
            {/* Star author spotlight */}
            {(() => {
              const starPost = featuredPosts[2];
              const author   = starPost?.author;
              return (
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}
                  className="rounded-2xl p-5 flex flex-col justify-between"
                  style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(34,197,94,0.15)'}}>
                  <div>
                    <p className="label-tag text-xs text-green-400 mb-3" style={{fontFamily:"'Montserrat',sans-serif",textTransform:'uppercase',letterSpacing:'0.1em'}}>⭐ Star Author</p>
                    {author && (
                      <div className="flex items-center gap-3 mb-3">
                        <img src={author.image} alt={author.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-500/30"
                          onError={(e)=>{e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=16a34a&color=fff`;}} />
                        <div>
                          <p style={{fontFamily:"'Oswald',sans-serif",textTransform:'uppercase',fontSize:'1.1rem',color:'#f9fafb'}}>{author.name}</p>
                          <p style={{fontFamily:"'Inter',sans-serif",fontSize:'0.75rem',color:'#6b7280'}}>Staff Writer</p>
                        </div>
                      </div>
                    )}
                    <p style={{fontFamily:"'Inter',sans-serif",fontSize:'0.875rem',color:'#9ca3af',lineHeight:1.6}} className="line-clamp-3">
                      {author?.bio || "A passionate football writer covering culture, tactics, and the beautiful game."}
                    </p>
                  </div>
                  <Link to={`/${starPost?.slug}`} className="mt-4 btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white text-center" style={{fontFamily:"'Montserrat',sans-serif"}}>
                    Read Latest →
                  </Link>
                </motion.div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ── VIDEO CYCLING STRIP ────────────────────────────────── */}
      <VideoCyclingStrip />

      {/* ── SOCIAL SECTION ─────────────────────────────────────── */}
      <SocialSection />

      {/* ── CYCLING CAROUSEL (all posts) ───────────────────────── */}
      <FeaturedCarousel />

      {/* ── RECENT POSTS GRID ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading text-white text-2xl">📰 Recent Posts</h2>
          <Link to="/posts" className="text-green-400 hover:text-green-300 font-semibold text-sm transition-colors" style={{fontFamily:"'Montserrat',sans-serif"}}>
            View All →
          </Link>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPosts.map((post, index) => (
            <motion.div key={post.id} variants={fadeUp}>
              {post.video ? (
                <VideoPostCard post={post} index={index} />
              ) : (
                <PostCard post={post} index={index} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────────── */}
      <Newsletter />
    </div>
  );
}
