import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuthors } from "@/services/postService";

export default function AuthorsPage() {
  const [authorList, setAuthorList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Our Authors — 5s Arena Blog";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-16 text-center"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px),repeating-linear-gradient(90deg,transparent,transparent 100px,rgba(34,197,94,0.15) 100px,rgba(34,197,94,0.15) 101px)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)" }} />
        <motion.div className="relative z-10 px-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}>
          <h1 className="gradient-text mb-3"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2.5rem,8vw,5rem)", letterSpacing: "0.05em", lineHeight: 1 }}>
            Our Authors
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}>
            Meet the passionate writers behind 5s Arena Blog
          </p>
        </motion.div>
      </div>

      {/* Authors Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorList.map((author, i) => (
            <motion.div key={author.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.08 }}>
              <Link to={`/authors/${encodeURIComponent(author.name)}`}>
                <motion.div
                  className="glass-card rounded-2xl p-6 text-center cursor-pointer h-full"
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(34,197,94,0.15)" }}>
                  <img src={author.image} alt={author.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    style={{ border: "3px solid rgba(34,197,94,0.3)", boxShadow: "0 0 20px rgba(34,197,94,0.2)" }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=16a34a&color=fff&size=96`; }}
                  />
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    {author.name}
                  </h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                    {author.bio}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
                      style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                      View Profile
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
