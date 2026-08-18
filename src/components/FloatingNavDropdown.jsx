import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const BASE_NAV_ITEMS = [
  { icon: "🏠", label: "Home",     to: "/",          hue: 145, color: "#22c55e" },
  { icon: "⚽", label: "Fixtures", to: "/fixtures",  hue: 185, color: "#06b6d4" },
  { icon: "🏆", label: "League",   to: "/league",    hue: 45,  color: "#f59e0b" },
  { icon: "📰", label: "Articles", to: "/posts",     hue: 150, color: "#10b981" },
  { icon: "✍️", label: "Authors",  to: "/authors",   hue: 300, color: "#ec4899" },
  { icon: "🧮", label: "Tools",    to: "/tools",     hue: 30,  color: "#f97316" },
  { icon: "👤", label: "Profile",  to: "/profile",   hue: 210, color: "#3b82f6" },
  { icon: "💸", label: "Donate",   to: "/donate",    hue: 45,  color: "#f59e0b" },
  { icon: "🎨", label: "Creator",  to: "/creator",   hue: 280, color: "#a855f7" },
];
const AUTHOR_ITEM = { icon: "📝", label: "Write",   to: "/write",    hue: 270, color: "#a855f7" };
const ADMIN_ITEM  = { icon: "⚙️", label: "Admin",   to: "/admin",    hue: 0,   color: "#ef4444" };

const RESERVED_ROOTS = new Set([
  "posts",
  "write",
  "login",
  "register",
  "about",
  "league",
  "profile",
  "admin",
  "fixtures",
  "author",
  "most-popular",
  "authors",
  "tools",
  "analytics",
  "roadmap",
  "shop",
  "jobs",
  "affiliate-disclosure",
  "donate",
  "creator",
  "tactics",
  "fitness",
  "community",
  "terms",
  "focus",
]);

function getReaderModeItem(pathname, search = "") {
  const contextSuffix = search || "";
  const focusMatch = pathname.match(/^\/focus\/([^/]+)\/?$/);
  if (focusMatch) {
    return {
      icon: "▤",
      label: "Standard",
      to: `/${focusMatch[1]}${contextSuffix}`,
      hue: 145,
      color: "#22c55e",
    };
  }

  const articleMatch = pathname.match(/^\/([^/]+)\/?$/);
  const slug = articleMatch?.[1];
  if (!slug || RESERVED_ROOTS.has(slug)) return null;

  return {
    icon: "◉",
    label: "Focus",
    to: `/focus/${slug}${contextSuffix}`,
    hue: 45,
    color: "#f59e0b",
  };
}

export default function FloatingNavDropdown() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin  = user?.role === "admin";
  const isAuthor = user?.role === "author" || isAdmin;
  const readerModeItem = getReaderModeItem(location.pathname, location.search);

  const NAV_ITEMS = [
    ...(readerModeItem ? [readerModeItem] : []),
    ...BASE_NAV_ITEMS,
    ...(isAuthor ? [AUTHOR_ITEM] : []),
    ...(isAdmin  ? [ADMIN_ITEM]  : []),
  ];

  /* Show after 300px scroll */
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close on route change */
  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2">
      {/* Dropdown items */}
      <AnimatePresence>
        {open && NAV_ITEMS.map((item, i) => {
          const ItemWrapper = item.external ? "a" : Link;
          const extraProps = item.external
            ? { href: item.to, target: "_blank", rel: "noopener noreferrer" }
            : { to: item.to };

          return (
            <motion.div key={`${item.label}-${item.to}`}
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.05 }}>
              <ItemWrapper {...extraProps}
                onClick={() => !item.external && setOpen(false)}
                className="flex items-center gap-2.5 no-underline">
                <motion.span
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(3,7,18,0.9)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${item.color}40`,
                    color: item.color,
                    letterSpacing: "0.05em",
                    boxShadow: `0 4px 12px rgba(0,0,0,0.4)`,
                  }}
                  whileHover={{ borderColor: item.color, boxShadow: `0 0 16px ${item.color}40` }}>
                  {item.label}
                </motion.span>

                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${item.hue},70%,35%), hsl(${item.hue},90%,50%))`,
                    boxShadow: `0 0 14px hsl(${item.hue},80%,50%50), inset 0 1px 0 rgba(255,255,255,0.25)`,
                    border: `1px solid hsl(${item.hue},70%,60%)`,
                  }}
                  whileHover={{ scale: 1.15, boxShadow: `0 0 24px hsl(${item.hue},80%,50%)` }}
                  whileTap={{ scale: 0.9 }}>
                  {item.icon}
                </motion.div>
              </ItemWrapper>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
        style={{
          background: open
            ? "linear-gradient(135deg,#dc2626,#ef4444)"
            : "linear-gradient(135deg,#052e16,#16a34a)",
          boxShadow: open
            ? "0 4px 20px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          border: open
            ? "1px solid rgba(239,68,68,0.6)"
            : "1px solid rgba(34,197,94,0.6)",
        }}
        initial={{ x: 60 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? "Close quick navigation" : "Open quick navigation"}
        aria-expanded={open}
      >
        <motion.span className="text-xl" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? "✕" : "⚽"}
        </motion.span>
      </motion.button>
    </div>
  );
}
