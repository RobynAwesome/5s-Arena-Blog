import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter ( [
  {
    Path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us<Link></Link></Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div>ABout</div>,
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);