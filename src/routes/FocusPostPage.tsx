import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ArticleFocusView, { type FocusArticle } from '@/components/ArticleFocusView';
import { useArenaWeather } from '@/hooks/useArenaWeather';
import { getPostBySlug } from '@/services/postService';

export default function FocusPostPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const requestedProvince = searchParams.get('province');
  const weatherContext = useArenaWeather(requestedProvince);
  const [post, setPost] = useState<FocusArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getPostBySlug(slug);
      if (!mounted) return;
      setPost(result as FocusArticle | null);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Focus View — 5s Arena Blog`;
    return () => {
      document.title = '5s Arena Blog | Football Culture, Stories & Legends';
    };
  }, [post]);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#030712]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500/25 border-t-green-500" />
      </div>
    );
  }

  if (!post || !slug) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#030712] px-4 text-center text-white">
        <h1 className="text-4xl font-black uppercase" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>
          Article not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-gray-400" style={{ fontFamily: "'Inter',sans-serif" }}>
          Focus view uses the same article source as the standard reader. If the article is unavailable here, it is unavailable there too.
        </p>
        <Link
          to="/posts"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-green-500 px-5 text-xs font-black uppercase tracking-[0.12em] text-black"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Browse articles
        </Link>
      </div>
    );
  }

  return <ArticleFocusView post={post} weatherContext={weatherContext} />;
}
