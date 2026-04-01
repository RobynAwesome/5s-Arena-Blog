import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FaFacebookF, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiClock } from "react-icons/fi";
import { 
  getPostBySlug, 
  getRelatedPosts, 
  getAdjacentPosts,
  getAllPosts 
} from "@/services/postService";
import { getComments, postComment } from "@/services/commentService";
import { useAuth } from "@/context/AuthContext";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import FloatingSocialBar from "@/components/FloatingSocialBar";
import ArticleFooter from "@/components/ArticleFooter";
import RelatedArticles from "@/components/RelatedArticles";
import InPostFixturesWidget from "@/components/InPostFixturesWidget";
import SeriesNav from "@/components/SeriesNav";
import TableOfContents from "@/components/TableOfContents";
import { useToast } from "@/components/Toast";

/* ── Category gradients (shared with PostCard) ────────────── */
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

/* ── Inner navbar view mode buttons ───────────────────────── */
const VIEW_MODES = [
  { id: "rectangular", icon: "▤", label: "Standard",  hue: 45,  color: "#d1d5db" },
  { id: "tiktok",      icon: "🎵", label: "TikTok",   hue: 185, color: "#06b6d4" },
  { id: "facebook",    icon: "📘", label: "Facebook",  hue: 220, color: "#1877f2" },
  { id: "instagram",   icon: "📸", label: "Instagram", hue: 330, color: "#e1306c" },
  { id: "whatsapp",    icon: "📱", label: "WhatsApp",  hue: 145, color: "#25d366" },
  { id: "grid",        icon: "⊞",  label: "Grid",      hue: 35,  color: "#f59e0b" },
];

const ALL_CATEGORIES = ["Culture", "Legends", "Skills", "Tactics", "Fitness", "Community", "News", "Women's Game"];

/* ── LED button component ─────────────────────────────────── */
function LedButton({ active, hue, color, icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
      style={{
        fontFamily: "'Montserrat',sans-serif",
        background: active
          ? `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${hue},90%,55%))`
          : "rgba(255,255,255,0.05)",
        boxShadow: active
          ? `0 0 14px hsl(${hue},80%,50%), inset 0 1px 0 rgba(255,255,255,0.3)`
          : "none",
        border: active
          ? `1px solid hsl(${hue},70%,60%)`
          : "1px solid rgba(255,255,255,0.1)",
        color: active ? "#fff" : "#9ca3af",
        letterSpacing: "0.03em",
      }}
      whileHover={{
        boxShadow: `0 0 20px hsl(${hue},80%,50%)`,
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

/* ── Reading progress bar ─────────────────────────────────── */
function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #22c55e, #06b6d4)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function SinglePostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentVersion, setCommentVersion] = useState(0);
  const [viewMode, setViewMode] = useState("rectangular");
  const [showInnerNav, setShowInnerNav] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const headerRef = useRef(null);
  const { addToHistory } = useReadingHistory();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [adjacent, setAdjacent] = useState({ prev: null, next: null });
  const [comments, setComments] = useState([]);
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await getPostBySlug(slug);
        setPost(p);
        if (p) {
          const [rel, adj, comms] = await Promise.all([
            getRelatedPosts(slug, 6),
            getAdjacentPosts(slug),
            getComments(p._id)
          ]);
          setRelated(rel);
          setAdjacent(adj);
          setComments(comms);
          
          if (p.series) {
            const seriesData = await getAllPosts({ 
              page: 1, 
              limit: 50, 
              search: p.series.name 
            });
            setSeriesPosts(seriesData.posts);
          }
          
          addToHistory(p);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPostData();
  }, [slug]);

  const filteredRelated = useMemo(() => {
    if (!categoryFilter) return related.slice(0, 4);
    return related.filter(p => p.category === categoryFilter).slice(0, 4);
  }, [related, categoryFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) addToHistory(post._id);
    setViewMode("rectangular");
    setCategoryFilter(null);
  }, [slug, post, addToHistory]);

  /* Show inner nav after scrolling past header */
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setShowInnerNav(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Update Open Graph meta tags per article for social sharing previews */
  useEffect(() => {
    if (!post) return;
    // Update page title
    document.title = `${post.title} — 5s Arena Blog`;

    // Helper to set meta tag
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        // extract property or name from selector
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const url = window.location.href;
    const image = post.image || '/posts/Blog1.png';
    const description = post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160) + '...';

    setMeta('meta[property="og:title"]', post.title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', 'article');
    setMeta('meta[name="twitter:title"]', post.title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image);
    setMeta('meta[name="description"]', description);

    // Cleanup: reset to site defaults when leaving
    return () => {
      document.title = '5s Arena Blog | Football Culture, Stories & Legends';
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', '5s Arena Blog | Football Culture, Stories & Legends');
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/posts/Blog1.png');
    };
  }, [post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to post a comment.", "error");
      return;
    }
    try {
      const newComment = await postComment(post._id, commentForm.content);
      setComments([newComment, ...comments]);
      setCommentForm({ name: "", email: "", content: "" });
      setCommentSuccess(true);
      showToast("Comment posted! Thanks for joining the conversation. 💬", "success");
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (error) {
      showToast("Failed to post comment. Please try again.", "error");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const catGradient = post ? (CATEGORY_GRADIENTS[post.category] || CATEGORY_GRADIENTS.default) : "";

  /* ── Extract images from content for Grid view ── */
  const contentImages = useMemo(() => {
    if (!post) return [];
    if (!post.content) return [post.image].filter(Boolean);
    const matches = post.content.match(/<img[^>]+src="([^"]+)"/g) || [];
    const srcs = matches.map(m => { const s = m.match(/src="([^"]+)"/); return s ? s[1] : null; }).filter(Boolean);
    if (post.image) srcs.unshift(post.image);
    return srcs;
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center" style={{ background: "var(--color-bg)" }}>
        <h1 className="gradient-text mb-4" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "4rem" }}>Post Not Found</h1>
        <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", marginBottom: "2rem" }}>
          Sorry, we couldn&apos;t find the post you&apos;re looking for.
        </p>
        <Link to="/posts">
          <motion.button className="btn-primary px-8 py-3 rounded-xl font-semibold"
            style={{ fontFamily: "'Montserrat',sans-serif" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            Browse All Posts
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Floating Social Icons (left side) */}
      <FloatingSocialBar title={post.title} />

      {/* ── Inner Post Navbar (sticky, shows after header scrolls out) ── */}
      <AnimatePresence>
        {showInnerNav && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-40"
            style={{
              background: "rgba(3,7,18,0.92)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(34,197,94,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            exit={{ y: -80 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5">
              {/* View mode buttons */}
              <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs flex-shrink-0 mr-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  View:
                </span>
                {VIEW_MODES.map(vm => (
                  <LedButton key={vm.id} active={viewMode === vm.id} hue={vm.hue} color={vm.color}
                    icon={vm.icon} label={vm.label} onClick={() => setViewMode(vm.id)} />
                ))}
              </div>

              {/* Category filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                <button onClick={() => setCategoryFilter(null)}
                  className="px-2.5 py-1 rounded-full text-xs flex-shrink-0 transition-all"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: !categoryFilter ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                    border: !categoryFilter ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: !categoryFilter ? "#22c55e" : "#9ca3af",
                    letterSpacing: "0.05em",
                  }}>
                  All
                </button>
                {ALL_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className="px-2.5 py-1 rounded-full text-xs flex-shrink-0 transition-all"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      background: categoryFilter === cat ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                      border: categoryFilter === cat ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      color: categoryFilter === cat ? "#22c55e" : "#9ca3af",
                      letterSpacing: "0.05em",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ══════════════════════════════════════════════════
             MAIN CONTENT
             ══════════════════════════════════════════════════ */}
          <article className="lg:w-2/3">
            {/* Post header */}
            <div ref={headerRef}>
              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag}
                      className="px-3 py-1 text-xs font-semibold rounded uppercase"
                      style={{ fontFamily: "'Montserrat',sans-serif", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af", letterSpacing: "0.08em" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <motion.h1
                className="mb-3 leading-tight"
                style={{
                  fontFamily: "'Bebas Neue',Impact,sans-serif",
                  fontSize: "clamp(2rem,5vw,3.5rem)",
                  letterSpacing: "0.04em",
                  color: "#f9fafb",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(34,197,94,0.15)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {post.title}
              </motion.h1>

              {/* Category badge */}
              <span className="label-tag px-3 py-1 rounded-full text-white text-xs mb-4 inline-block"
                style={{ background: catGradient, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {post.category}
              </span>

              {/* Author + date + share */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 mt-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || "/authors/Jackson Wayne.png"}
                    alt={post.author?.username || "Author"}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: "2px solid rgba(34,197,94,0.3)" }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "Author")}&background=16a34a&color=fff`; }}
                  />
                  <div>
                    <p style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{post.author?.username}</p>
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.8rem" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "#6b7280" }} onMouseEnter={e => e.target.style.color = "#1877f2"} onMouseLeave={e => e.target.style.color = "#6b7280"}><FaFacebookF size={15} /></a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "#6b7280" }} onMouseEnter={e => e.target.style.color = "#f9fafb"} onMouseLeave={e => e.target.style.color = "#6b7280"}><FaXTwitter size={15} /></a>
                  <a href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "#6b7280" }} onMouseEnter={e => e.target.style.color = "#25d366"} onMouseLeave={e => e.target.style.color = "#6b7280"}><FaWhatsapp size={15} /></a>
                  <button
                    onClick={() => { navigator.clipboard.writeText(shareUrl).then(() => showToast("Link copied to clipboard! 🔗", "info")); }}
                    className="transition-colors cursor-pointer"
                    style={{ color: "#6b7280", background: "transparent", border: "none", padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#22c55e"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                    title="Copy link"
                  ><FaLink size={15} /></button>
                  <span className="flex items-center gap-1 text-sm ml-2" style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif" }}>
                    <FiClock size={14} /> {post.readingTime}min
                  </span>
                </div>
              </div>
            </div>

            {/* Video or Cover Image */}
            {post.video ? (
              <video controls className="w-full rounded-xl mb-8" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} poster={post.image}>
                <source src={post.video} type="video/mp4" />
              </video>
            ) : (
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-72 md:h-[450px] object-cover rounded-xl mb-8"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* ── ARTICLE CONTENT (VIEW-MODE DEPENDENT) ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* RECTANGULAR (default) */}
                {viewMode === "rectangular" && (
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none mb-10"
                    style={{ color: "#d1d5db", fontFamily: "'Inter',sans-serif", lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}

                {/* TIKTOK */}
                {viewMode === "tiktok" && (
                  <div className="max-w-sm mx-auto mb-10 rounded-2xl overflow-hidden"
                    style={{ background: "#000", border: "2px solid rgba(6,182,212,0.4)" }}>
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-5">
                      <div
                        className="text-2xl leading-relaxed"
                        style={{ color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      <div className="mt-4 flex items-center gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ color: "#06b6d4", fontSize: "0.8rem" }}>🎵 @fivesarena</span>
                        <span className="ml-auto" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                          ❤️ {Math.floor(Math.random() * 5000 + 500)} · 💬 {Math.floor(Math.random() * 200 + 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* FACEBOOK */}
                {viewMode === "facebook" && (
                  <div className="max-w-xl mx-auto mb-10 rounded-lg overflow-hidden"
                    style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
                    {/* FB header */}
                    <div className="flex items-center gap-3 p-3">
                      <img src={post.author?.avatar} alt="" className="w-10 h-10 rounded-full object-cover"
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "A")}&background=16a34a&color=fff`; }} />
                      <div>
                        <div style={{ color: "#e4e6eb", fontWeight: 600, fontSize: "0.9rem" }}>{post.author?.username}</div>
                        <div style={{ color: "#b0b3b8", fontSize: "0.75rem" }}>
                          {new Date(post.createdAt).toLocaleDateString()} · 🌐
                        </div>
                      </div>
                    </div>
                    {post.image && <img src={post.image} alt="" className="w-full" />}
                    <div className="p-4"
                      style={{ color: "#e4e6eb", fontFamily: "'Inter',sans-serif", fontSize: "0.9rem", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: post.content }} />
                    {/* Reactions */}
                    <div className="px-4 py-2 flex items-center gap-1" style={{ borderTop: "1px solid #3a3b3c" }}>
                      <span style={{ fontSize: "1rem" }}>👍</span>
                      <span style={{ fontSize: "1rem" }}>❤️</span>
                      <span style={{ fontSize: "1rem" }}>⚽</span>
                      <span style={{ color: "#b0b3b8", fontSize: "0.8rem", marginLeft: "0.25rem" }}>
                        {Math.floor(Math.random() * 300 + 50)} reactions
                      </span>
                      <span style={{ color: "#b0b3b8", fontSize: "0.8rem", marginLeft: "auto" }}>
                        {comments.length} comments
                      </span>
                    </div>
                    <div className="grid grid-cols-3 py-1 px-4" style={{ borderTop: "1px solid #3a3b3c" }}>
                      {["👍 Like", "💬 Comment", "↗️ Share"].map(action => (
                        <button key={action} className="py-2 text-center text-sm font-semibold rounded-lg transition-colors"
                          style={{ color: "#b0b3b8", background: "transparent" }}
                          onMouseEnter={e => e.target.style.background = "#3a3b3c"}
                          onMouseLeave={e => e.target.style.background = "transparent"}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* INSTAGRAM */}
                {viewMode === "instagram" && (
                  <div className="max-w-md mx-auto mb-10">
                    {/* IG header */}
                    <div className="flex items-center gap-3 mb-3">
                      <img src={post.author?.avatar} alt="" className="w-8 h-8 rounded-full object-cover"
                        style={{ border: "2px solid #e1306c" }}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "A")}&background=16a34a&color=fff`; }} />
                      <span style={{ color: "#f9fafb", fontWeight: 600, fontSize: "0.85rem" }}>fivesarena</span>
                    </div>
                    {post.image && (
                      <img src={post.image} alt="" className="w-full aspect-square object-cover rounded-lg mb-3" />
                    )}
                    <div className="flex gap-4 mb-3">
                      {["❤️", "💬", "📤", "🔖"].map((e, i) => (
                        <span key={i} className="text-xl cursor-pointer" style={{ marginLeft: i === 3 ? "auto" : 0 }}>{e}</span>
                      ))}
                    </div>
                    <p style={{ color: "#f9fafb", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif" }}>
                      <strong>fivesarena</strong>{" "}
                      {post.title}
                    </p>
                    <p style={{ color: "#8e8e8e", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                      View all {comments.length} comments
                    </p>
                  </div>
                )}

                {/* WHATSAPP */}
                {viewMode === "whatsapp" && (
                  <div className="max-w-lg mx-auto mb-10 rounded-2xl p-5"
                    style={{ background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"><rect fill=\"%230b141a\" width=\"300\" height=\"300\"/></svg>') #0b141a" }}>
                    <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <img src={post.author?.avatar} alt="" className="w-8 h-8 rounded-full object-cover"
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "A")}&background=16a34a&color=fff`; }} />
                      <span style={{ color: "#e9edef", fontWeight: 600, fontSize: "0.9rem" }}>{post.author?.username}</span>
                      <span className="text-xs ml-auto" style={{ color: "#8696a0" }}>online</span>
                    </div>
                    {/* Bubbles */}
                    {post.content.split("</p>").filter(Boolean).slice(0, 6).map((para, i) => (
                      <div key={i} className="whatsapp-bubble mb-2 max-w-[85%] p-3 rounded-xl"
                        style={{
                          background: i === 0 ? "#005c4b" : "#1f2c34",
                          marginLeft: i === 0 ? "auto" : 0,
                          borderTopRightRadius: i === 0 ? "4px" : "12px",
                          borderTopLeftRadius: i !== 0 ? "4px" : "12px",
                        }}>
                        <div className="text-sm" style={{ color: "#e9edef", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}
                          dangerouslySetInnerHTML={{ __html: para.replace(/<[^>]*>/g, "").trim() }} />
                        <div className="text-right mt-1">
                          <span style={{ fontSize: "0.65rem", color: "#8696a0" }}>
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* GRID */}
                {viewMode === "grid" && (
                  <div className="mb-10">
                    <div className="grid grid-cols-3 gap-2">
                      {(contentImages.length > 0 ? contentImages : [post.image]).map((src, i) => (
                        <motion.div key={i}
                          className="aspect-square rounded-xl overflow-hidden"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}>
                          <img src={src} alt="" className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = "none"; }} />
                        </motion.div>
                      ))}
                    </div>
                    {contentImages.length <= 1 && (
                      <p className="text-center mt-4" style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem" }}>
                        Only the cover image is available for this post.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Series Navigation */}
            <SeriesNav currentPost={post} allPosts={seriesPosts} />

            {/* Article Footer (tags, prev/next, share) */}
            <ArticleFooter post={post} prevPost={adjacent.prev} nextPost={adjacent.next} />

            {/* ── Comments Section ── */}
            <section className="pt-8 mt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.4rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                Comments ({comments.length})
              </h3>

              {comments.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {comments.map((comment) => (
                    <motion.div key={comment._id}
                      className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center gap-2 mb-2">
                        {comment.author?.avatar ? (
                          <img src={comment.author.avatar} alt={comment.author.username} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: "linear-gradient(135deg,#059669,#22c55e)" }}>
                            {comment.author?.username?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                        )}
                        <span style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.85rem", textTransform: "uppercase" }}>{comment.author?.username}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="ml-10" style={{ color: "#d1d5db", fontFamily: "'Inter',sans-serif", fontSize: "0.875rem" }}>{comment.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif", marginBottom: "2rem" }}>
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}

              {user ? (
                <form onSubmit={handleCommentSubmit}
                  className="rounded-xl p-6 space-y-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h4 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em" }}>Leave a Comment</h4>
                  {commentSuccess && (
                    <p style={{ color: "#22c55e", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif" }}>Comment posted successfully!</p>
                  )}
                  <textarea placeholder="Write your comment..." value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg outline-none text-sm resize-y"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                    required />
                  <motion.button type="submit"
                    className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}>
                    Post Comment
                  </motion.button>
                </form>
              ) : (
                <div className="rounded-xl p-8 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                   <p style={{ color: "#9ca3af", fontFamily: "'Inter',sans-serif", marginBottom: "1.5rem" }}>
                     You must be logged in to post a comment.
                   </p>
                   <Link to="/login">
                     <motion.button
                       className="btn-primary px-6 py-2 rounded-xl font-semibold text-sm"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       Login to Comment
                     </motion.button>
                   </Link>
                </div>
              )}
            </section>
          </article>

          {/* ══════════════════════════════════════════════════
             SIDEBAR
             ══════════════════════════════════════════════════ */}
          <aside className="lg:w-1/3 space-y-6">
            {/* Table of Contents */}
            <TableOfContents content={post.content} />

            {/* Related Articles */}
            <RelatedArticles posts={filteredRelated} />

            {/* Fixtures + Standings + League CTA */}
            <InPostFixturesWidget />

            {/* Author Bio Card */}
            <motion.div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "rgba(17,24,39,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
            >
              <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "0.9rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                About the Author
              </h4>
              <img
                src={post.author?.avatar}
                alt={post.author?.username}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                style={{ border: "3px solid rgba(34,197,94,0.3)", boxShadow: "0 0 20px rgba(34,197,94,0.2)" }}
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || "Author")}&background=16a34a&color=fff`; }}
              />
              <h5 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {post.author?.username}
              </h5>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5, marginTop: "0.5rem" }}>
                {post.author?.bio}
              </p>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
