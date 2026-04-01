import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuthors, getPostsByAuthor } from "@/services/postService";
import PostCard from "@/components/PostCard";

const categoryColors = {
  Culture: "#10b981", Legends: "#f59e0b", Skills: "#06b6d4", Tactics: "#8b5cf6",
  Fitness: "#ef4444", Community: "#3b82f6", News: "#34d399", "Women's Game": "#ec4899",
};

export default function AuthorProfilePage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [author, setAuthor] = useState(null);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [authors, posts] = await Promise.all([
          getAuthors(),
          getPostsByAuthor(decodedName)
        ]);
        
        // authors is now an array
        const found = authors.find(a => a.name === decodedName);
        setAuthor(found);
        setAuthorPosts(posts || []);
      } catch (err) {
        console.error("Failed to fetch author data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [decodedName]);

  useEffect(() => {
    document.title = author ? `${decodedName} — 5s Arena Blog` : loading ? "Loading..." : "Author Not Found";
    window.scrollTo(0, 0);
  }, [decodedName, author, loading]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    authorPosts.forEach(p => {
      breakdown[p.category] = (breakdown[p.category] || 0) + 1;
    });
    return breakdown;
  }, [authorPosts]);

  const totalViews = useMemo(() => {
    return authorPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  }, [authorPosts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "80vh" }} className="flex items-center justify-center px-4">
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">🔍</div>
          <h2 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", color: "#f9fafb", fontSize: "2rem" }}>Author Not Found</h2>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
            We couldn&apos;t find an author named &quot;{decodedName}&quot;.
          </p>
          <Link to="/authors">
            <motion.button className="btn-primary px-6 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif" }} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              View All Authors
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-16"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)" }} />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div className="flex flex-col md:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}>
            <motion.img
              src={author.image}
              alt={author.name}
              className="w-28 h-28 rounded-full object-cover flex-shrink-0"
              style={{ border: "3px solid rgba(34,197,94,0.4)", boxShadow: "0 0 30px rgba(34,197,94,0.25)" }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=16a34a&color=fff&size=112`; }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="text-center md:text-left">
              <h1 className="gradient-text mb-2"
                style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2rem,6vw,3.5rem)", letterSpacing: "0.05em", lineHeight: 1 }}>
                {author.name}
              </h1>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "32rem" }}>
                {author.bio}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#22c55e" }}>{authorPosts.length}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#06b6d4" }}>{totalViews.toLocaleString()}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#f59e0b" }}>{Object.keys(categoryBreakdown).length}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Categories</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Category breakdown pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(categoryBreakdown).map(([cat, count]) => (
            <span key={cat} className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                background: `${categoryColors[cat] || "#22c55e"}22`,
                color: categoryColors[cat] || "#22c55e",
                border: `1px solid ${categoryColors[cat] || "#22c55e"}44`,
              }}>
              {cat} ({count})
            </span>
          ))}
        </div>

        {/* Posts grid */}
        <motion.div className="section-heading mb-6"
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>
            Articles by {author.name}
          </h2>
        </motion.div>

        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {authorPosts.map((post, i) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.05 }}>
                <PostCard post={post} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280" }}>No posts by this author yet.</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link to="/authors" className="transition-colors text-sm font-semibold"
            style={{ fontFamily: "'Montserrat',sans-serif", color: "#22c55e" }}>
            ← All Authors
          </Link>
        </div>
      </div>
    </div>
  );
}
