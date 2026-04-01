import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPosts } from "@/services/postService";

const categoryColors = {
  Culture: "#10b981", Legends: "#f59e0b", Skills: "#06b6d4", Tactics: "#8b5cf6",
  Fitness: "#ef4444", Community: "#3b82f6", News: "#34d399", "Women's Game": "#ec4899",
};

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search
  const handleSearch = useCallback(async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const data = await getAllPosts({ page: 1, limit: 10, search: value });
      setResults(data.posts?.slice(0, 8) || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  }, []);

  const goTo = (slug) => {
    setOpen(false);
    navigate(`/${slug}`);
  };

  const quickLinks = [
    { label: "All Posts", path: "/posts", icon: "📰" },
    { label: "Fixtures", path: "/fixtures", icon: "⚽" },
    { label: "League", path: "/league", icon: "🏆" },
    { label: "About", path: "/about", icon: "ℹ️" },
    { label: "Most Popular", path: "/most-popular", icon: "🔥" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-[15%] left-1/2 z-[9999] w-full max-w-xl"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(17,24,39,0.95)",
                border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.1)",
                backdropFilter: "blur(20px)",
              }}>
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search posts, categories, authors..."
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "'Inter',sans-serif", color: "#f9fafb", fontSize: "0.9rem" }}
                />
                <kbd className="px-2 py-0.5 rounded text-xs"
                  style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.08)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
                {query.trim() === "" ? (
                  /* Quick Links when no query */
                  <div className="px-5 py-4">
                    <p style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                      Quick Links
                    </p>
                    <div className="space-y-1">
                      {quickLinks.map((link) => (
                        <button key={link.path}
                          onClick={() => { setOpen(false); navigate(link.path); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                          style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.85rem" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.1)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span style={{ fontSize: "1rem" }}>{link.icon}</span>
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="px-3 py-3">
                    <p className="px-2 mb-2" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {results.length} Result{results.length !== 1 ? "s" : ""}
                    </p>
                    {results.map((post, i) => (
                      <motion.button key={post._id}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => goTo(post.slug)}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <img
                          src={post.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#f9fafb" }}>
                            {post.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-semibold"
                              style={{
                                fontFamily: "'Montserrat',sans-serif",
                                background: `${categoryColors[post.category] || "#22c55e"}22`,
                                color: categoryColors[post.category] || "#22c55e",
                                border: `1px solid ${categoryColors[post.category] || "#22c55e"}44`,
                              }}>
                              {post.category}
                            </span>
                            <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.65rem" }}>
                              {post.author?.username}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem" }}>
                      No posts found for &quot;{query}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.65rem" }}>Navigate with ↑↓</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded text-[0.6rem]"
                    style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.08)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)" }}>
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded text-[0.6rem]"
                    style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.08)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)" }}>
                    K
                  </kbd>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.6rem", marginLeft: "0.25rem" }}>to toggle</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
