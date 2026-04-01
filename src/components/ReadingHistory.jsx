import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReadingHistory } from "@/hooks/useReadingHistory";

const DISPLAY_LIMIT = 8;

export default function ReadingHistory() {
  const { history, clearHistory } = useReadingHistory();
  const stripRef = useRef(null);

  const recentPosts = useMemo(() => {
    // history now contains minimal post objects
    return history.slice(0, DISPLAY_LIMIT).filter(Boolean);
  }, [history]);

  if (recentPosts.length === 0) return null;

  return (
    <motion.div
      className="glass-card rounded-2xl p-4"
      style={{ border: "none" }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h4
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "0.9rem",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Continue Reading
        </h4>
        <button
          onClick={clearHistory}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#9ca3af")}
          onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
        >
          Clear History
        </button>
      </div>

      {/* Scroll strip with edge shadows */}
      <div className="relative">
        {/* Left shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(13,17,23,0.6), transparent)",
          }}
        />
        {/* Right shadow */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(13,17,23,0.6), transparent)",
          }}
        />

        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 22,
                delay: i * 0.04,
              }}
              className="flex-shrink-0"
            >
              <Link
                to={`/${post.slug}`}
                className="flex flex-col items-center gap-1 group"
                style={{ width: "3.5rem", textDecoration: "none" }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.title.slice(0, 2)
                    )}&background=16a34a&color=fff&size=40`;
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    color: "#9ca3af",
                    lineHeight: 1.3,
                    textAlign: "center",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  {post.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
