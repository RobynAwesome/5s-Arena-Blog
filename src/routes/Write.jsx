import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { createPost } from "@/services/postService";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const CATEGORIES = ["Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Fitness", "Community", "Roundup", "News"];

export default function Write() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthor } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Write — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "80vh" }} className="flex items-center justify-center px-4">
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">🔒</div>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", marginBottom: "1.5rem" }}>
            You need to be signed in to write posts.
          </p>
          <motion.button onClick={() => navigate("/login")}
            className="btn-primary px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "80vh" }} className="flex items-center justify-center px-4">
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">✍️</div>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", marginBottom: "0.5rem" }}>
            Only authors and admins can write posts.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Apply for the author program on your profile page.
          </p>
          <motion.button onClick={() => navigate("/profile")}
            className="btn-primary px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Go to Profile
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !category || !content.trim()) {
      setError("Please fill in all required fields.");
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        category,
        content,
        image: coverImage || "/youtube-images/postImg.jpeg",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const result = await createPost(postData);

      setSuccess(true);
      showToast("Post published successfully! 🎉", "success");
      setTimeout(() => navigate(`/${result.slug}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to publish post. Please try again.");
      showToast(err.response?.data?.error || "Failed to publish post.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "80vh" }} className="flex items-center justify-center px-4">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <motion.div className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}>
            ✅
          </motion.div>
          <h2 className="gradient-text mb-2"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "2rem", letterSpacing: "0.05em" }}>
            Post Published!
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280" }}>
            Redirecting to your post...
          </p>
        </motion.div>
      </div>
    );
  }

  const inputStyle = {
    fontFamily: "'Inter', sans-serif",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f9fafb",
    borderRadius: "12px",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative overflow-hidden py-10"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.3) 50px,rgba(34,197,94,0.3) 51px)` }} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.h1 className="gradient-text"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.05em", lineHeight: 1 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}>
            ✍️ Write a New Post
          </motion.h1>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", marginTop: "0.5rem" }}>
            Share your football stories with the community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {error && (
          <motion.div className="mb-6 p-4 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "'Inter', sans-serif", color: "#ef4444", fontSize: "0.85rem" }}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
              Post Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ ...inputStyle, fontSize: "1.1rem", fontFamily: "'Oswald', sans-serif" }}
              placeholder="Enter your post title..."
              onFocus={(e) => e.target.style.borderColor = "rgba(34,197,94,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => e.target.style.borderColor = "rgba(34,197,94,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              required
            >
              <option value="" style={{ background: "#111827" }}>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} style={{ background: "#111827" }}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div>
            <label style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              style={inputStyle}
              placeholder="https://example.com/image.jpg"
              onFocus={(e) => e.target.style.borderColor = "rgba(34,197,94,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            {coverImage && (
              <motion.img
                src={coverImage}
                alt="Cover preview"
                className="mt-3 w-full h-48 object-cover rounded-xl"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={inputStyle}
              placeholder="football, tactics, culture"
              onFocus={(e) => e.target.style.borderColor = "rgba(34,197,94,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
              Content *
            </label>
            <div className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Write your post content here..."
                className="write-editor"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`btn-primary px-10 py-3.5 rounded-xl font-bold text-white text-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.05em" }}
            whileHover={!loading ? { y: -2 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </motion.button>
        </form>
      </div>

      {/* Quill dark theme overrides */}
      <style>{`
        .write-editor .ql-toolbar {
          background: rgba(255,255,255,0.04) !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .write-editor .ql-container {
          border: none !important;
          min-height: 250px;
          font-family: 'Inter', sans-serif !important;
          font-size: 0.95rem !important;
          color: #d1d5db !important;
        }
        .write-editor .ql-editor {
          min-height: 250px;
          color: #d1d5db !important;
        }
        .write-editor .ql-editor.ql-blank::before {
          color: #6b7280 !important;
          font-style: normal !important;
        }
        .write-editor .ql-stroke { stroke: #9ca3af !important; }
        .write-editor .ql-fill   { fill: #9ca3af !important; }
        .write-editor .ql-picker-label { color: #9ca3af !important; }
        .write-editor .ql-picker-options { background: #1f2937 !important; border-color: rgba(255,255,255,0.1) !important; }
        .write-editor .ql-picker-item { color: #d1d5db !important; }
        .write-editor .ql-picker-item:hover { color: #22c55e !important; }
        .write-editor .ql-active .ql-stroke { stroke: #22c55e !important; }
        .write-editor .ql-active .ql-fill { fill: #22c55e !important; }
        .write-editor .ql-active { color: #22c55e !important; }
        .write-editor .ql-toolbar button:hover .ql-stroke { stroke: #22c55e !important; }
        .write-editor .ql-toolbar button:hover .ql-fill { fill: #22c55e !important; }
      `}</style>
    </div>
  );
}
