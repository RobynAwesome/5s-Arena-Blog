import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { AuthProvider, GOOGLE_CLIENT_ID } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./index.css";

/* ── Eager imports (critical path) ── */
import Homepage      from "@/routes/Homepage.jsx";
import MainLayout    from "@/layouts/MainLayout.jsx";
import NotFoundPage  from "@/routes/NotFoundPage.jsx";

/* ── Lazy imports (code-split) ── */
const PostListPage      = lazy(() => import("@/routes/PostListPage.jsx"));
const Write             = lazy(() => import("@/routes/Write.jsx"));
const LoginPage         = lazy(() => import("@/routes/LoginPage.jsx"));
const RegisterPage      = lazy(() => import("@/routes/RegisterPage.jsx"));
const SinglePostPage    = lazy(() => import("@/routes/SinglePostPage.jsx"));
const AboutPage         = lazy(() => import("@/routes/AboutPage.jsx"));
const LeaguePage        = lazy(() => import("@/routes/LeaguePage.jsx"));
const ProfilePage       = lazy(() => import("@/routes/ProfilePage.jsx"));
const AdminPage         = lazy(() => import("@/routes/AdminPage.jsx"));
const FixturesPage      = lazy(() => import("@/routes/FixturesPage.jsx"));
const AuthorDashboard   = lazy(() => import("@/routes/AuthorDashboard.jsx"));
const MostPopularPage   = lazy(() => import("@/routes/MostPopularPage.jsx"));
const LeagueFixturesPage= lazy(() => import("@/routes/LeagueFixturesPage.jsx"));
const AuthorsPage       = lazy(() => import("@/routes/AuthorsPage.jsx"));
const AuthorProfilePage = lazy(() => import("@/routes/AuthorProfilePage.jsx"));
const ToolsPage         = lazy(() => import("@/routes/ToolsPage.jsx"));
const AnalyticsPage     = lazy(() => import("@/routes/AnalyticsPage.jsx"));
const RoadmapPage       = lazy(() => import("@/routes/RoadmapPage.jsx"));
const ShopPage          = lazy(() => import("@/routes/ShopPage.jsx"));
const JobsPage          = lazy(() => import("@/routes/JobsPage.jsx"));
const AffiliateDisclosurePage = lazy(() => import("@/routes/AffiliateDisclosurePage.jsx"));
const DonationsPage           = lazy(() => import("@/routes/DonationsPage.jsx"));
const CreatorPage             = lazy(() => import("@/routes/CreatorPage.jsx"));
const TacticsPage             = lazy(() => import("@/routes/TacticsPage.jsx"));
const FitnessPage             = lazy(() => import("@/routes/FitnessPage.jsx"));
const CommunityPage           = lazy(() => import("@/routes/CommunityPage.jsx"));
const TermsPage               = lazy(() => import("@/routes/TermsPage.jsx"));
const ConvictionPage          = lazy(() => import("@/routes/ConvictionPage.tsx"));

/* ── Simple skeleton fallback ── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
      <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6b7280', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/",                     element: <Homepage /> },
      { path: "/posts",                element: <Suspense fallback={<PageLoader />}><PostListPage /></Suspense> },
      { path: "/write",                element: <Suspense fallback={<PageLoader />}><Write /></Suspense> },
      { path: "/login",                element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register",             element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      { path: "/about",                element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: "/league",               element: <Suspense fallback={<PageLoader />}><LeaguePage /></Suspense> },
      { path: "/profile",              element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: "/admin",                element: <Suspense fallback={<PageLoader />}><AdminPage /></Suspense> },
      { path: "/fixtures",             element: <Suspense fallback={<PageLoader />}><FixturesPage /></Suspense> },
      { path: "/author",               element: <Suspense fallback={<PageLoader />}><AuthorDashboard /></Suspense> },
      { path: "/most-popular",         element: <Suspense fallback={<PageLoader />}><MostPopularPage /></Suspense> },
      { path: "/most-popular/league",  element: <Suspense fallback={<PageLoader />}><LeagueFixturesPage /></Suspense> },
      { path: "/authors",              element: <Suspense fallback={<PageLoader />}><AuthorsPage /></Suspense> },
      { path: "/authors/:name",        element: <Suspense fallback={<PageLoader />}><AuthorProfilePage /></Suspense> },
      { path: "/tools",                element: <Suspense fallback={<PageLoader />}><ToolsPage /></Suspense> },
      { path: "/analytics",            element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
      { path: "/roadmap",              element: <Suspense fallback={<PageLoader />}><RoadmapPage /></Suspense> },
      { path: "/shop",                 element: <Suspense fallback={<PageLoader />}><ShopPage /></Suspense> },
      { path: "/jobs",                 element: <Suspense fallback={<PageLoader />}><JobsPage /></Suspense> },
      { path: "/affiliate-disclosure", element: <Suspense fallback={<PageLoader />}><AffiliateDisclosurePage /></Suspense> },
      { path: "/donate",               element: <Suspense fallback={<PageLoader />}><DonationsPage /></Suspense> },
      { path: "/creator",              element: <Suspense fallback={<PageLoader />}><CreatorPage /></Suspense> },
      { path: "/tactics",              element: <Suspense fallback={<PageLoader />}><TacticsPage /></Suspense> },
      { path: "/fitness",              element: <Suspense fallback={<PageLoader />}><FitnessPage /></Suspense> },
      { path: "/community",            element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: "/terms",                element: <Suspense fallback={<PageLoader />}><TermsPage /></Suspense> },
      { path: "/conviction",           element: <Suspense fallback={<PageLoader />}><ConvictionPage /></Suspense> },
      { path: "/:slug",                element: <Suspense fallback={<PageLoader />}><SinglePostPage /></Suspense> },
      { path: "*",                     element: <NotFoundPage /> },
    ],
  },
]);

/* ── Register service worker for PWA ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <DarkModeProvider>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </DarkModeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);