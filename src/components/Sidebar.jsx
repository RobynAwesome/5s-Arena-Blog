import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPopularPosts, getAuthors } from "@/services/postService";
import PollWidget from "@/components/PollWidget";
import { BuyMeACoffeeCard } from "@/components/BuyMeACoffee";
import ReadingHistory from "@/components/ReadingHistory";

const categories = ["Culture", "Legends", "Skills", "Tactics", "Fitness", "Community", "News", "Women's Game"];

const categoryGradients = {
  Culture: { from: "#059669", to: "#10b981" },
  Legends: { from: "#d97706", to: "#f59e0b" },
  Skills: { from: "#0891b2", to: "#06b6d4" },
  Tactics: { from: "#7c3aed", to: "#8b5cf6" },
  Fitness: { from: "#dc2626", to: "#ef4444" },
  Community: { from: "#2563eb", to: "#3b82f6" },
  News: { from: "#059669", to: "#34d399" },
  "Women's Game": { from: "#db2777", to: "#ec4899" },
};

export default function Sidebar() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [spotlightAuthor, setSpotlightAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sidebarBg] = useState(() => {
    const num = Math.floor(Math.random() * 5) + 1;
    return `/sidebar-backgrounds/sidebar-background-${num}.jpg`;
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [posts, authors] = await Promise.all([
          getPopularPosts(5),
          getAuthors()
        ]);
        setPopularPosts(posts);
        if (authors && authors.length > 0) {
          setSpotlightAuthor(authors[Math.floor(Math.random() * authors.length)]);
        }
      } catch (err) {
        console.error("Sidebar data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <aside className="space-y-6">
      <ReadingHistory />

      {/* Sidebar Header Image */}
      <motion.div
        className="h-40 rounded-2xl bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `url('${sidebarBg}')`,
          border: "1px solid rgba(34,197,94,0.15)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.85), rgba(13,17,23,0.8))" }}>
          <h3 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "1.8rem", letterSpacing: "0.08em", color: "#f9fafb" }}>
            5s Arena
          </h3>
        </div>
      </motion.div>

      {/* Popular Posts */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.05 }}
      >
        <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
          Popular Posts
        </h4>
        <ul className="space-y-3">
          {popularPosts.map((post, i) => (
            <motion.li key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 200 }}
            >
              <Link to={`/${post.slug}`} className="flex gap-3 group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.title.slice(0,2))}&background=16a34a&color=fff&size=56`; }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium line-clamp-2 transition-colors"
                    style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db" }}
                    onMouseEnter={e => e.target.style.color = "#22c55e"}
                    onMouseLeave={e => e.target.style.color = "#d1d5db"}>
                    {post.title}
                  </p>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.7rem", marginTop: "0.25rem" }}>
                    {post.readingTime} min read
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      >
        <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
          Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const grad = categoryGradients[cat] || { from: "#059669", to: "#10b981" };
            return (
              <Link
                key={cat}
                to={`/posts?category=${encodeURIComponent(cat)}`}
                className="px-3 py-1 text-xs font-semibold rounded-full transition-all hover:scale-105"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  background: `linear-gradient(135deg, ${grad.from}33, ${grad.to}22)`,
                  border: `1px solid ${grad.from}55`,
                  color: grad.to,
                  letterSpacing: "0.05em",
                }}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Author Spotlight */}
      {spotlightAuthor && (
        <motion.div
          className="glass-card rounded-2xl p-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.15 }}
        >
          <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
            Author Spotlight
          </h4>
          <img
            src={spotlightAuthor.image}
            alt={spotlightAuthor.name}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            style={{ border: "2px solid rgba(34,197,94,0.3)", boxShadow: "0 0 16px rgba(34,197,94,0.2)" }}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(spotlightAuthor.name)}&background=16a34a&color=fff`; }}
          />
          <h5 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {spotlightAuthor.name}
          </h5>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5, marginTop: "0.5rem" }}>
            {spotlightAuthor.bio}
          </p>
        </motion.div>
      )}

      {/* Weekly Poll */}
      <PollWidget
        pollId="weekly-march-2026"
        question="Who is the greatest 5-a-side player of all time?"
        options={["Ronaldinho", "Falcão (Futsal)", "Ricardinho", "Neymar", "Messi"]}
      />

      {/* Buy Me a Coffee */}
      <BuyMeACoffeeCard />
    </aside>
  );
}
