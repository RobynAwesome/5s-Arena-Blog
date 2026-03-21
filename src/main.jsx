import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DarkModeProvider } from "@/context/DarkModeContext";
import "./index.css";
import Homepage from "@/routes/Homepage.jsx";
import PostListPage from "@/routes/PostListPage.jsx";
import Write from "@/routes/Write.jsx";
import LoginPage from "@/routes/LoginPage.jsx";
import RegisterPage from "@/routes/RegisterPage.jsx";
import SinglePostPage from "@/routes/SinglePostPage.jsx";
import AboutPage from "@/routes/AboutPage.jsx";
import NotFoundPage from "@/routes/NotFoundPage.jsx";
import MainLayout from "@/layouts/MainLayout.jsx";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </React.StrictMode>
);
