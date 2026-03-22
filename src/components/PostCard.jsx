import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post, index = 0 }) {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={`/${post.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden h-48 relative">
        {post.video ? (
          <>
            {/* Video poster shown by default, video plays on hover */}
            <img
              src={post.image}
              alt={post.title}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
            />
            <video
              ref={videoRef}
              src={post.video}
              muted
              loop
              playsInline
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Badges */}
        <span className="absolute top-2 right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full z-10">
          {post.readingTime} min read
        </span>
        {post.video && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10 flex items-center gap-1">
            <span className="inline-block w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white" />
            Video
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">{post.category}</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.author && (
          <div className="flex items-center gap-2 mt-3">
            <img
              src={post.author?.image}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.author?.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
