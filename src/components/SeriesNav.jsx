import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SeriesNav({ currentPost, allPosts }) {
  if (!currentPost?.series) return null;

  const { name, part, total } = currentPost.series;

  // Find all posts in the same series, sorted by part number
  const seriesPosts = allPosts
    .filter((p) => p.series?.name === name)
    .sort((a, b) => a.series.part - b.series.part);

  if (seriesPosts.length < 2) return null;

  const currentIndex = seriesPosts.findIndex((p) => p._id === currentPost._id);
  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4
          style={{
            fontFamily: "'Oswald', sans-serif",
            color: "#22c55e",
            fontSize: "1.1rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            margin: 0,
          }}
        >
          {name}
        </h4>
        <span
          className="inline-flex items-center rounded-full px-3 py-1"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#22c55e",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          Part {part} of {total}
        </span>
      </div>

      {/* Series post list */}
      <div className="space-y-2 mb-4">
        {seriesPosts.map((post) => {
          const isCurrent = post._id === currentPost._id;
          return (
            <Link
              key={post._id}
              to={`/${post.slug}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
              style={{
                background: isCurrent
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(255,255,255,0.03)",
                border: isCurrent
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: isCurrent
                    ? "rgba(34,197,94,0.25)"
                    : "rgba(255,255,255,0.08)",
                  color: isCurrent ? "#22c55e" : "#6b7280",
                }}
              >
                {post.series.part}
              </span>
              <span
                className="line-clamp-1"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  color: isCurrent ? "#f9fafb" : "#9ca3af",
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {post.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Prev / Next navigation */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {prevPost ? (
          <Link to={`/${prevPost.slug}`} style={{ textDecoration: "none" }}>
            <motion.div
              className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              whileHover={{
                background: "rgba(34,197,94,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ color: "#22c55e", fontSize: "0.9rem" }}>&larr;</span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                }}
              >
                Previous
              </span>
            </motion.div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link to={`/${nextPost.slug}`} style={{ textDecoration: "none" }}>
            <motion.div
              className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              whileHover={{
                background: "rgba(34,197,94,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                }}
              >
                Next
              </span>
              <span style={{ color: "#22c55e", fontSize: "0.9rem" }}>&rarr;</span>
            </motion.div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
