import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Homepage from "@/routes/Homepage.jsx";
import PostListPage from "@/routes/PostListPage.jsx";
import Write from "@/routes/Write.jsx";   
import LoginPage from "@/routes/LoginPage.jsx";
import RegisterPage from "@/routes/RegisterPage.jsx"; // ✅ fixed spelling

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/post",
    element: <PostListPage />,
  },
  {
    path: "/slug",
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);