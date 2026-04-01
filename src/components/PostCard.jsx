import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* Category → gradient mapping */
const CATEGORY_GRADIENTS = {
  Culture:       "linear-gradient(135deg,#059669,#22c55e)",
  Legends:       "linear-gradient(135deg,#b45309,#f59e0b)",
  Skills:        "linear-gradient(135deg,#1d4ed8,#06b6d4)",
  Tactics:       "linear-gradient(135deg,#7c3aed,#a78bfa)",
  Fitness:       "linear-gradient(135deg,#0e7490,#22d3ee)",
  Community:     "linear-gradient(135deg,#15803d,#4ade80)",
  News:          "linear-gradient(135deg,#be123c,#f43f5e)",
  "Women's Game":"linear-gradient(135deg,#9d174d,#ec4899)",
  default:       "linear-gradient(135deg,#374151,#6b7280)",
};

const getCategoryGradient = (cat) => CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS.default;

/* ─────────────────────────────────────────────
   FEATURED card — full-width hero variant
   ───────────────────────────────────────────── */
export function FeaturedPostCard({ post }) {
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
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
        style={{ height: "380px", minHeight: "280px" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {/* Background media */}
        {post.video ? (
          <>
            <img src={post.image} alt={post.title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`} />
            <video ref={videoRef} src={post.video} muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
          </>
        ) : (
          <motion.img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          {/* Category badge */}
          <span
            className="label-tag px-3 py-1 rounded-full text-white text-xs mb-3 inline-block"
            style={{ background: getCategoryGradient(post.category) }}
          >
            {post.category}
          </span>
          {post.video && (
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1">
              <span className="inline-block w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white" />
              Video
            </span>
          )}

          <h2
            className="text-white mt-2 line-clamp-2 leading-tight"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              letterSpacing: "0.04em",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            {post.title}
          </h2>

          {post.author && (
            <div className="flex items-center gap-2 mt-3">
              <img src={post.author.avatar} alt={post.author.username} className="w-7 h-7 rounded-full object-cover border border-white/30" />
              <span className="text-gray-300 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{post.author.username}</span>
              <span className="text-gray-500 text-xs ml-auto">{post.readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Hover green left border */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: "linear-gradient(to bottom, #22c55e, #06b6d4)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   STANDARD card — editorial split (40/60)
   ───────────────────────────────────────────── */
export default function PostCard({ post, index = 0, layout = "grid" }) {
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

  /* List layout — horizontal editorial split */
  if (layout === "list") {
    return (
      <Link to={`/${post.slug}`}>
        <motion.div
          className="flex rounded-xl overflow-hidden cursor-pointer ripple-effect"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.4), -3px 0 0 0 #22c55e" : "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 22, delay: index * 0.07 }}
          whileHover={{ y: -4 }}
        >
          {/* Image — 40% */}
          <div className="relative overflow-hidden flex-shrink-0" style={{ width: "40%", minHeight: "160px" }}>
            {post.video ? (
              <>
                <img src={post.image} alt={post.title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${hovered ? "opacity-0" : "opacity-100"}`} />
                <video ref={videoRef} src={post.video} muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${hovered ? "opacity-100" : "opacity-0"}`} />
              </>
            ) : (
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            {post.video && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                <span className="inline-block w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-white" />
                Video
              </div>
            )}
          </div>

          {/* Text — 60% */}
          <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
            <span className="label-tag text-xs px-2 py-0.5 rounded-full text-white inline-block w-fit mb-2" style={{ background: getCategoryGradient(post.category) }}>
              {post.category}
            </span>
            <h3
              className="text-white font-bold line-clamp-2 leading-snug mb-2"
              style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.1rem", textTransform: "uppercase" }}
            >
              {post.title}
            </h3>
            {post.author && (
              <div className="flex items-center gap-2 mt-auto">
                <img src={post.author.avatar} alt={post.author.username} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{post.author.username}</span>
                <span className="text-gray-500 text-xs ml-auto">{post.readingTime} min</span>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  /* Grid layout — stacked card */
  return (
    <Link to={`/${post.slug}`}>
      <motion.div
        className="rounded-xl overflow-hidden cursor-pointer h-full flex flex-col ripple-effect"
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${hovered ? "#22c55e40" : "var(--color-border)"}`,
          boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5), -3px 0 0 0 #22c55e" : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: index * 0.07 }}
        whileHover={{ y: -4 }}
      >
        {/* Image / Video area */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "180px" }}>
          {post.video ? (
            <>
              <img src={post.image} alt={post.title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${hovered ? "opacity-0" : "opacity-100"}`} />
              <video ref={videoRef} src={post.video} muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${hovered ? "opacity-100" : "opacity-0"}`} />
              {/* Play icon overlay (always visible on video posts) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 40, height: 40, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                  animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.8 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-block w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                </motion.div>
              </div>
            </>
          ) : (
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Badges */}
          <span className="absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-full z-10" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
            {post.readingTime} min
          </span>
          {post.video && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
              <span className="inline-block w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-white" />
              Video
            </span>
          )}
        </div>

        {/* Text area */}
        <div className="p-4 flex flex-col flex-1">
          <span
            className="label-tag text-xs px-2 py-0.5 rounded-full text-white inline-block w-fit mb-2"
            style={{ background: getCategoryGradient(post.category) }}
          >
            {post.category}
          </span>
          <h3
            className="font-bold line-clamp-2 leading-snug mb-2 flex-1"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "1rem",
              textTransform: "uppercase",
              color: hovered ? "#22c55e" : "#f9fafb",
              transition: "color 0.25s",
            }}
          >
            {post.title}
          </h3>
          {post.author && (
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-6 h-6 rounded-full object-cover border border-white/10"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=16a34a&color=fff`; }}
              />
              <span className="text-gray-400 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                {post.author.username}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
