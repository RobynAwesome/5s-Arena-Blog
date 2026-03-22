import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiTrash2, FiPlus, FiUsers, FiFileText, FiCheck, FiX, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { posts as allPostsData } from "@/data/posts";

/* ── Local post management via localStorage ── */
function loadManagedPosts() {
  const stored = localStorage.getItem("5s_managed_posts");
  if (stored) return JSON.parse(stored);
  // Initialize from static data
  const initial = allPostsData.map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category, author: p.author?.name || "Unknown", createdAt: p.createdAt, status: "published" }));
  localStorage.setItem("5s_managed_posts", JSON.stringify(initial));
  return initial;
}

function saveManagedPosts(posts) {
  localStorage.setItem("5s_managed_posts", JSON.stringify(posts));
}

/* ── Tab Components ── */

function PostManager() {
  const [posts, setPosts] = useState(loadManagedPosts);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Culture");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = (id) => {
    const updated = posts.filter((p) => p.id !== id);
    saveManagedPosts(updated);
    setPosts(updated);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: newTitle,
      category: newCategory,
      author: "Admin",
      createdAt: new Date().toISOString(),
      status: "draft",
    };
    const updated = [newPost, ...posts];
    saveManagedPosts(updated);
    setPosts(updated);
    setNewTitle("");
    setShowAdd(false);
  };

  const handleEditSave = (id) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, title: editTitle } : p));
    saveManagedPosts(updated);
    setPosts(updated);
    setEditId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Posts ({posts.length})</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <FiPlus size={16} /> Add Post
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-3 overflow-hidden"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Post title..."
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-green-500"
            >
              {["Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Community", "Fitness", "Wellness"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold">Create Draft</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl hover:bg-gray-800/60 transition-colors group">
            <div className="flex-1 min-w-0 mr-4">
              {editId === post.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button onClick={() => handleEditSave(post.id)} className="p-1.5 text-green-500 hover:text-green-400"><FiCheck size={16} /></button>
                  <button onClick={() => setEditId(null)} className="p-1.5 text-gray-400 hover:text-gray-300"><FiX size={16} /></button>
                </div>
              ) : (
                <>
                  <p className="text-white text-sm font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{post.category}</span>
                    <span className="text-xs text-gray-600">|</span>
                    <span className="text-xs text-gray-500">{post.author}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}>
                      {post.status}
                    </span>
                  </div>
                </>
              )}
            </div>
            {editId !== post.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditId(post.id); setEditTitle(post.title); }}
                  className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                  title="Edit"
                >
                  <FiEdit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorReview() {
  const { authorApps, approveAuthor, rejectAuthor } = useAuth();
  const pending = authorApps.filter((a) => a.status === "pending");
  const reviewed = authorApps.filter((a) => a.status !== "pending");

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Author Applications</h2>

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FiUsers size={48} className="mx-auto mb-4 opacity-30" />
          <p>No author applications yet.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">Pending ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map((app) => (
              <div key={app.id} className="p-5 bg-gray-900/60 border border-yellow-800/30 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{app.userName}</p>
                    <p className="text-gray-400 text-xs">{app.userEmail}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm mb-1"><strong className="text-gray-400">Reason:</strong> {app.reason}</p>
                <p className="text-gray-300 text-sm mb-4"><strong className="text-gray-400">Sample Topic:</strong> {app.sampleTopic}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveAuthor(app.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    <FiCheck size={14} /> Approve
                  </button>
                  <button
                    onClick={() => rejectAuthor(app.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-semibold rounded-lg transition-all border border-red-800/50"
                  >
                    <FiX size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Reviewed ({reviewed.length})</h3>
          <div className="space-y-2">
            {reviewed.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                <div>
                  <p className="text-gray-300 text-sm">{app.userName}</p>
                  <p className="text-gray-500 text-xs">{app.sampleTopic}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  app.status === "approved" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserManager() {
  const { users } = useAuth();

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Users ({users.length})</h2>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                {u.image ? (
                  <img src={u.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUsers className="text-gray-500" size={14} />
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{u.name}</p>
                <p className="text-gray-500 text-xs">{u.email}</p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              u.role === "admin" ? "bg-red-900/50 text-red-400" :
              u.role === "author" ? "bg-green-900/50 text-green-400" :
              "bg-gray-800 text-gray-400"
            }`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Admin Page ── */
export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("posts");

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-4">Access Denied</p>
          <p className="text-gray-500 mb-6">You need admin privileges to view this page.</p>
          <button onClick={() => navigate("/login")} className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", icon: FiFileText },
    { id: "authors", label: "Author Applications", icon: FiEdit3 },
    { id: "users", label: "Users", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/profile")} className="p-2 text-gray-400 hover:text-white transition-colors">
              <FiChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage posts, authors, and users</p>
            </div>
          </div>
          <img src="/logo.png" alt="" className="w-10 h-10 rounded-full opacity-50" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-900 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                tab === t.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <t.icon size={15} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "posts" && <PostManager />}
          {tab === "authors" && <AuthorReview />}
          {tab === "users" && <UserManager />}
        </motion.div>
      </div>
    </div>
  );
}
