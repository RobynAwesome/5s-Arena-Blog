import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function RelatedArticles({ posts = [] }) {
  const [startIndex, setStartIndex] = useState(0);

  if (posts.length === 0) return null;

  const visiblePost = posts[startIndex];

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
          Related Articles
        </h4>
        <div className="flex gap-1">
          <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiChevronLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiChevronRight className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Featured Related Post */}
      <Link to={`/${visiblePost.slug}`} className="group block mb-4">
        <div className="overflow-hidden rounded-lg mb-3 shadow-md">
          <img
            src={visiblePost.image}
            alt={visiblePost.title}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {visiblePost.video && (
          <span className="text-red-500 text-sm font-medium mb-1 inline-block">&#9658; Video</span>
        )}
        <h5 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
          {visiblePost.title}
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
          {visiblePost.content?.replace(/<[^>]*>/g, "").slice(0, 140)}...
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {visiblePost.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <img src={visiblePost.author?.image} alt={visiblePost.author?.name} className="w-7 h-7 rounded-full object-cover" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{visiblePost.author?.name}</span>
        </div>
      </Link>

      {/* Other Related Posts List */}
      {posts.length > 1 && (
        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          {posts.filter((_, i) => i !== startIndex).slice(0, 3).map((p) => (
            <Link key={p.id} to={`/${p.slug}`} className="flex gap-3 group">
              <img src={p.image} alt={p.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {p.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{p.readingTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
