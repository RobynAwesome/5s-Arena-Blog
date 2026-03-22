import { useState } from "react";
import { Link } from "react-router-dom";
import { getPopularPosts } from "@/services/postService";
import { authors } from "@/data/posts";

const categories = ["Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Community", "Fitness", "Wellness"];

export default function Sidebar() {
  const popularPosts = getPopularPosts(5);
  const [sidebarBg] = useState(() => {
    const num = Math.floor(Math.random() * 5) + 1;
    return `/sidebar-backgrounds/sidebar-background-${num}.jpg`;
  });
  const [spotlightAuthor] = useState(() => {
    const names = Object.keys(authors);
    return names[Math.floor(Math.random() * names.length)];
  });

  const author = authors[spotlightAuthor];

  return (
    <aside className="space-y-8">
      {/* Sidebar Header Image */}
      <div
        className="h-40 rounded-xl bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url('${sidebarBg}')` }}
      >
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">5s Arena</h3>
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Popular Posts</h4>
        <ul className="space-y-3">
          {popularPosts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/${post.slug}`}
                className="flex gap-3 group"
              >
                <img src={post.image} alt={post.title} className="w-14 h-14 rounded object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors font-medium line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.readingTime} min read</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/posts?category=${encodeURIComponent(cat)}`}
              className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Author Spotlight */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow text-center">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Author Spotlight</h4>
        <img
          src={author?.image}
          alt={spotlightAuthor}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-md"
        />
        <h5 className="font-semibold text-gray-900 dark:text-white">{spotlightAuthor}</h5>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {author?.bio}
        </p>
      </div>
    </aside>
  );
}
