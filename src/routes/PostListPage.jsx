import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts } from "@/services/postService";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";

const categories = ["All", "Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Community", "Fitness", "Wellness"];
const POSTS_PER_PAGE = 9;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PostListPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const sort = searchParams.get("sort");
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam || selectedCategory;

  const { posts, totalPages } = useMemo(() => {
    return getAllPosts({
      page,
      limit: POSTS_PER_PAGE,
      sort,
      search,
      category: activeCategory,
    });
  }, [page, sort, search, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-950">
      <h1 className="text-4xl font-bold text-green-900 dark:text-green-400 mb-2">
        {search ? `Search: "${search}"` : sort === "trending" ? "Trending Posts" : sort === "popular" ? "Most Popular" : "All Posts"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Explore stories from the world of football</p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-green-700 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Post Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <PostCard post={post} index={index} />
              </motion.div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">No posts found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-lg bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-lg bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
