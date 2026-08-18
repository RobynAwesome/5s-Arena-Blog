import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiClock, FiGrid } from 'react-icons/fi';
import { extractFocusFrames } from '@/lib/articleFocus';

const FocusAtmosphere = lazy(() => import('@/components/FocusAtmosphere'));

const CATEGORY_ACCENTS: Record<string, string> = {
  Culture: '#22c55e',
  Legends: '#f59e0b',
  Skills: '#06b6d4',
  Tactics: '#a78bfa',
  Fitness: '#22d3ee',
  Community: '#4ade80',
  News: '#f43f5e',
  "Women's Game": '#ec4899',
  '5-a-Side': '#22c55e',
  Development: '#3b82f6',
  Wellness: '#14b8a6',
};

type ArticleAuthor = {
  username?: string;
  avatar?: string;
};

export type FocusArticle = {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  readingTime?: number;
  createdAt?: string;
  author?: ArticleAuthor;
};

type ArticleFocusViewProps = {
  post: FocusArticle;
};

function frameSize(kind: string) {
  if (kind === 'title') return 'text-[clamp(2.8rem,11vw,6.5rem)]';
  if (kind === 'heading') return 'text-[clamp(2.35rem,9vw,5.4rem)]';
  if (kind === 'quote') return 'text-[clamp(2.15rem,8vw,4.8rem)]';
  return 'text-[clamp(1.9rem,7vw,4.2rem)]';
}

export default function ArticleFocusView({ post }: ArticleFocusViewProps) {
  const frames = useMemo(
    () => extractFocusFrames(post.content, post.title, post.excerpt),
    [post.content, post.excerpt, post.title],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const accent = CATEGORY_ACCENTS[post.category || ''] || '#22c55e';
  const active = frames[activeIndex];
  const previous = frames[activeIndex - 1];
  const next = frames[activeIndex + 1];
  const progress = frames.length > 1 ? activeIndex / (frames.length - 1) : 1;

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => Math.max(0, Math.min(frames.length - 1, current + direction)));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') move(-1);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
        move(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [frames.length]);

  return (
    <section
      className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-[#070b0d] text-white"
      onTouchStart={(event) => {
        touchStartRef.current = event.changedTouches[0]?.clientY ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartRef.current;
        const end = event.changedTouches[0]?.clientY;
        touchStartRef.current = null;
        if (start == null || end == null) return;
        const delta = start - end;
        if (Math.abs(delta) < 48) return;
        move(delta > 0 ? 1 : -1);
      }}
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_12%,rgba(34,197,94,0.12),transparent_42%),linear-gradient(180deg,#111827_0%,#080b0d_48%,#040506_100%)]" />
      {post.image ? (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-[0.08] blur-2xl scale-110"
          style={{ backgroundImage: `url(${post.image})` }}
          aria-hidden="true"
        />
      ) : null}
      {!reducedMotion ? (
        <Suspense fallback={null}>
          <FocusAtmosphere accent={accent} progress={progress} />
        </Suspense>
      ) : null}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.72))]" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <header className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl sm:p-4">
          <Link
            to={`/${post.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-[10px] font-black uppercase tracking-[0.14em] text-gray-200 transition hover:border-green-300/25 hover:text-white"
            style={{ fontFamily: "'Montserrat',sans-serif" }}
          >
            <FiGrid /> Standard
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-500" style={{ fontFamily: "'Montserrat',sans-serif" }}>
              <span style={{ color: accent }}>{post.category || 'Article'}</span>
              {post.readingTime ? <><span>•</span><FiClock /><span>{post.readingTime} min</span></> : null}
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-gray-200 sm:text-base" style={{ fontFamily: "'Oswald',sans-serif" }}>
              {post.title}
            </p>
          </div>
          <span className="shrink-0 text-xs font-black text-gray-500" style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {activeIndex + 1}/{frames.length}
          </span>
        </header>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
          <motion.div
            className="h-full origin-left rounded-full"
            style={{ background: accent }}
            animate={{ width: `${Math.max(4, progress * 100)}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          />
        </div>

        <div className="flex flex-1 items-center py-8 sm:py-12">
          <div className="w-full">
            <motion.p
              key={`previous-${activeIndex}`}
              initial={false}
              animate={{ opacity: previous ? 0.12 : 0 }}
              className="mb-8 max-w-5xl text-[clamp(1.55rem,6vw,3.4rem)] font-black leading-[1.05] tracking-[-0.035em] text-white"
              style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
              aria-hidden={!previous}
            >
              {previous?.text || ' '}
            </motion.p>

            <motion.div
              key={active.id}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              aria-live="polite"
            >
              <p
                className={`${frameSize(active.kind)} max-w-5xl font-black leading-[0.98] tracking-[-0.045em] text-white`}
                style={{ fontFamily: active.kind === 'paragraph' ? "'Oswald',sans-serif" : "'Bebas Neue',Impact,sans-serif" }}
              >
                {active.text}
              </p>
            </motion.div>

            <motion.p
              key={`next-${activeIndex}`}
              initial={false}
              animate={{ opacity: next ? 0.1 : 0 }}
              className="mt-8 max-w-5xl text-[clamp(1.55rem,6vw,3.4rem)] font-black leading-[1.05] tracking-[-0.035em] text-white"
              style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
              aria-hidden={!next}
            >
              {next?.text || ' '}
            </motion.p>
          </div>
        </div>

        <footer className="rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl sm:p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={activeIndex === 0}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] disabled:opacity-20"
              aria-label="Previous part"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="min-w-0 flex-1 px-1">
              <p className="text-[9px] font-black uppercase tracking-[0.17em] text-gray-500" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                Focus view
              </p>
              <p className="mt-1 truncate text-xs text-gray-300 sm:text-sm" style={{ fontFamily: "'Inter',sans-serif" }}>
                Swipe or use the arrows. Your place stays inside the same article.
              </p>
            </div>

            <button
              type="button"
              onClick={() => move(1)}
              disabled={activeIndex === frames.length - 1}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.14em] text-black transition disabled:bg-white/10 disabled:text-white/30"
              style={{ background: activeIndex === frames.length - 1 ? undefined : accent, fontFamily: "'Montserrat',sans-serif" }}
            >
              Next <FiChevronRight size={18} />
            </button>
          </div>

          {post.author?.username ? (
            <div className="mt-3 border-t border-white/8 pt-3 text-[10px] text-gray-500" style={{ fontFamily: "'Inter',sans-serif" }}>
              By <span className="text-gray-300">{post.author.username}</span>
              {post.createdAt ? ` · ${new Date(post.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}` : ''}
            </div>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
