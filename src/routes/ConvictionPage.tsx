import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiRadio,
} from 'react-icons/fi';
import ConvictionAtmosphere from '@/components/ConvictionAtmosphere';
import { areeceConvictionStory } from '@/data/convictionStories';

const PHASE_LABELS = {
  prediction: 'PREDICTION',
  rupture: 'RUPTURE',
  pressure: 'PRESSURE',
  recovery: 'RECOVERY',
  proof: 'PROOF',
} as const;

function clampIndex(index: number) {
  return Math.max(0, Math.min(areeceConvictionStory.chapters.length - 1, index));
}

export default function ConvictionPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const story = areeceConvictionStory;
  const activeChapter = story.chapters[activeIndex];
  const progress = ((activeIndex + 1) / story.chapters.length) * 100;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.chapterIndex);
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      { threshold: [0.45, 0.6, 0.75], rootMargin: '-12% 0px -28% 0px' },
    );

    chapterRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const surroundingLines = useMemo(() => {
    const before = story.contextLines[(activeIndex + story.contextLines.length - 1) % story.contextLines.length];
    const after = story.contextLines[activeIndex % story.contextLines.length];
    return { before, after };
  }, [activeIndex, story.contextLines]);

  const moveTo = (nextIndex: number) => {
    const index = clampIndex(nextIndex);
    chapterRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setActiveIndex(index);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080b0c] text-white">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(71,85,105,0.32),transparent_42%),linear-gradient(180deg,#111820_0%,#090d10_48%,#050708_100%)]" />
      <ConvictionAtmosphere state={activeChapter.scene} phase={activeChapter.phase} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(3,7,9,0.12),rgba(3,7,9,0.62))]" />
      <div className="pointer-events-none fixed inset-0 z-[2] opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:32px_32px]" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="sticky top-2 z-30 rounded-[2rem] border border-white/10 bg-black/45 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Back to Five's Arena Blog"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/[0.1]"
            >
              <FiArrowLeft size={18} />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                <FiRadio className="text-green-400" /> Conviction stream
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="truncate text-base font-black tracking-tight text-white sm:text-lg">
                  {story.title}
                </p>
                <p className="shrink-0 text-xs font-bold text-slate-400">{activeChapter.year}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-green-400"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 24 }}
            />
          </div>
        </header>

        <section className="flex min-h-[82vh] flex-col justify-end pb-14 pt-20 sm:min-h-[88vh] sm:pb-20">
          <div className="max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-green-400">
              {story.eyebrow}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              {story.deck}
            </p>

            <div className="mt-12 space-y-7 sm:mt-16 sm:space-y-9">
              <p className="max-w-4xl text-[clamp(1.7rem,8vw,4.9rem)] font-black leading-[1.05] tracking-[-0.045em] text-white/12">
                {surroundingLines.before}
              </p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl text-[clamp(2.2rem,10vw,6.5rem)] font-black leading-[0.98] tracking-[-0.05em] text-white"
              >
                {story.activeLine}
              </motion.p>
              <p className="max-w-4xl text-[clamp(1.7rem,8vw,4.9rem)] font-black leading-[1.05] tracking-[-0.045em] text-white/10">
                {surroundingLines.after}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                Active evidence state
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChapter.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-green-300/20 bg-green-300/10 px-3 py-1 text-[9px] font-black tracking-[0.16em] text-green-200">
                      {PHASE_LABELS[activeChapter.phase]}
                    </span>
                    <span className="text-4xl font-black tracking-[-0.05em] text-white/20">
                      {activeChapter.year}
                    </span>
                  </div>

                  <h1 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl">
                    {activeChapter.headline}
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {activeChapter.statement}
                  </p>
                  <p className="mt-4 border-l-2 border-white/10 pl-4 text-xs leading-6 text-slate-500">
                    {activeChapter.evidence}
                  </p>
                  <a
                    href={activeChapter.sourceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 transition hover:border-green-300/30 hover:text-white"
                  >
                    Source receipt <FiExternalLink />
                  </a>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
                <button
                  type="button"
                  onClick={() => moveTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white disabled:opacity-20"
                  aria-label="Previous evidence state"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => moveTo(activeIndex + 1)}
                  disabled={activeIndex === story.chapters.length - 1}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-black transition hover:bg-green-400 disabled:bg-white/10 disabled:text-white/30"
                >
                  Next receipt <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </aside>

          <section aria-label="A-Reece conviction timeline" className="space-y-[14vh] pb-20 pt-4 sm:space-y-[18vh]">
            {story.chapters.map((chapter, index) => {
              const active = activeIndex === index;
              return (
                <motion.article
                  key={chapter.id}
                  ref={(node) => {
                    chapterRefs.current[index] = node;
                  }}
                  data-chapter-index={index}
                  animate={{ opacity: active ? 1 : 0.28, scale: active ? 1 : 0.975 }}
                  transition={{ duration: 0.28 }}
                  className="min-h-[58vh] rounded-[2.2rem] border border-white/10 bg-black/25 p-6 backdrop-blur-md sm:min-h-[62vh] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-green-400">
                        {String(index + 1).padStart(2, '0')} / {String(story.chapters.length).padStart(2, '0')}
                      </p>
                      <h2 className="mt-3 max-w-2xl text-[clamp(2rem,7vw,4.4rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] text-white">
                        {chapter.headline}
                      </h2>
                    </div>
                    <span className="text-5xl font-black tracking-[-0.06em] text-white/10 sm:text-7xl">
                      {chapter.year}
                    </span>
                  </div>

                  <p className="mt-8 max-w-2xl text-base font-semibold leading-7 text-slate-200 sm:text-lg sm:leading-8">
                    {chapter.statement}
                  </p>
                  <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.035] p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Evidence
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{chapter.evidence}</p>
                    <a
                      href={chapter.sourceHref}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-green-300 hover:text-green-200"
                    >
                      {chapter.sourceLabel} <FiExternalLink />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </section>
        </div>

        <section className="mt-8 rounded-[2.3rem] border border-yellow-300/15 bg-yellow-300/[0.035] p-6 sm:p-8">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-yellow-200">
            Conviction primitive
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-5xl">
            Prediction is interesting. Receipts make it conviction.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
            This interface is intentionally reusable. Swap the story contract and it can become a player journey, club season, founder build log, township project or match narrative without changing the interaction model.
          </p>
        </section>
      </main>
    </div>
  );
}
