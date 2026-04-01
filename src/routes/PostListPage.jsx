import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts } from "@/services/postService";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";

const categories = ["All", "Culture", "Legends", "Skills", "Tactics", "Fitness", "Community", "News", "Women's Game"];
const POSTS_PER_PAGE = 9;

export default function PostListPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewLayout, setViewLayout] = useState("grid"); // grid | list
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get("sort");
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam || selectedCategory;

  useEffect(() => {
    document.title = search ? `Search: ${search}` : sort === "popular" ? "Most Popular" : "All Posts — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, [search, sort]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = await getAllPosts({ page, limit: POSTS_PER_PAGE, sort, search, category: activeCategory });
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, sort, search, activeCategory]);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div className="relative overflow-hidden py-12"
        style={{ background: "linear-gradient(135deg,#052e16 0%,#0d1117 60%,#111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.3) 50px,rgba(34,197,94,0.3) 51px)` }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1 className="gradient-text mb-2"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2rem,6vw,4rem)", letterSpacing: "0.05em", lineHeight: 1 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            {search ? `Search: "${search}"` : sort === "trending" ? "Trending Posts" : sort === "popular" ? "Most Popular" : "All Posts"}
          </motion.h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}>Explore stories from the world of football</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Category Filter + View Toggle ── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map(cat => (
            <motion.button key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                background: activeCategory === cat ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                border: activeCategory === cat ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: activeCategory === cat ? "#22c55e" : "#9ca3af",
                letterSpacing: "0.05em",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {cat}
            </motion.button>
          ))}

          {/* View toggle */}
          <div className="ml-auto flex gap-1">
            <button onClick={() => setViewLayout("grid")}
              className="p-2 rounded-lg transition-colors"
              style={{ background: viewLayout === "grid" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)", color: viewLayout === "grid" ? "#22c55e" : "#6b7280" }}>
              ⊞
            </button>
            <button onClick={() => setViewLayout("list")}
              className="p-2 rounded-lg transition-colors"
              style={{ background: viewLayout === "list" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)", color: viewLayout === "list" ? "#22c55e" : "#6b7280" }}>
              ▤
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Post Grid / List ── */}
          <div className="lg:w-2/3">
            {viewLayout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post, i) => (
                  <motion.div key={post.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.05 }}>
                    <PostCard post={post} index={i} layout="grid" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post, i) => (
                  <motion.div key={post.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.05 }}>
                    <PostCard post={post} index={i} layout="list" />
                  </motion.div>
                ))}
              </div>
            )}

            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📭</div>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280" }}>No posts found.</p>
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <motion.button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-30"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22c55e",
                  }}
                  whileHover={{ background: "rgba(34,197,94,0.25)" }}>
                  ← Previous
                </motion.button>
                <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.85rem" }}>
                  Page {page} of {totalPages}
                </span>
                <motion.button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-30"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22c55e",
                  }}
                  whileHover={{ background: "rgba(34,197,94,0.25)" }}>
                  Next →
                </motion.button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
