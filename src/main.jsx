import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "@/routes/Homepage.jsx";
import PostListPage from "@/routes/PostListPage.jsx";
import Write from "@/routes/Write.jsx";
import LoginPage from "@/routes/LoginPage.jsx";
import RegisterPage from "@/routes/RegisterPage.jsx";
import SinglePostPage from "@/routes/SinglePostPage.jsx";

const router = createBrowserRouter([
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
    path: "/:slug",   
    element: <SinglePostPage />,
  },
  {
    path: "*",       
    element: <SinglePostPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);