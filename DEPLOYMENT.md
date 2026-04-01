# Deployment To-Do List

This document outlines the steps required to deploy the **5s Arena Blog** (Frontend & Backend).

## 1. Prerequisites
- [ ] Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster.
- [ ] Create an [ImageKit.io](https://imagekit.io/) account for image CDN.
- [ ] Create a [Google Cloud Console](https://console.cloud.google.com/) project for Google OAuth (if using).
- [ ] Choose deployment platforms:
  - **Option A (Recommended):** Single deployment (e.g., Render, Railway, Fly.io, Heroku) serving both Frontend and Backend.
  - **Option B:** Separate deployment (e.g., Vercel/Netlify for Frontend, Render/Heroku for Backend).

## 2. Backend Deployment (Express API)
- [ ] **Database Connection:** 
  - Obtain the Connection String from MongoDB Atlas.
  - Ensure the IP address of your deployment server is whitelisted in Atlas (or set to `0.0.0.0/0` for dynamic IPs).
- [ ] **Environment Variables:** Set the following on your backend hosting platform:
  - `MONGODB_URI`: Your MongoDB Atlas connection string.
  - `JWT_SECRET`: A strong, random string for signing tokens.
  - `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://5s-arena-blog.vercel.app`).
  - `NODE_ENV`: Set to `production` (enables static file serving from `dist/`).
  - `PORT`: Usually handled by the platform (default `5000`).
  - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (needed for backend verification).
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Start Command:** `npm run server`
- [ ] **Database Seeding (Optional):** Run `node server/seed.js` once after the initial deployment to populate the database with default posts and authors. **Warning:** This will clear existing data in the database.

## 3. Frontend Deployment (React/Vite)
- [ ] **Environment Variables:** Set the following in your frontend build settings:
  - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://5s-arena-api.onrender.com/api`).
  - `VITE_IK_URL_ENDPOINT`: Your ImageKit URL endpoint.
  - `VITE_IK_PUBLIC_KEY`: Your ImageKit public key.
  - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- [x] **Code Changes Required:**
  - [x] **CRITICAL:** Unified API URL to use `VITE_API_BASE_URL` across all services. (Done)
  - [x] **CRITICAL:** Fixed authentication endpoint in `AuthContext.jsx` to use `/auth/me`. (Done)
  - [x] **SECURITY:** Added authentication middleware to protect post and comment routes. (Done)
  - [x] **CONFIG:** Added static file serving to the Express server for single-service deployment. (Done)
- [ ] **Build Settings:**
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

## 4. Final Verification
- [ ] Verify frontend can reach backend API.
- [ ] Test Login/Registration flow.
- [ ] Test persistence of user session on page refresh (requires backend `GET /auth/me`).
- [ ] Test Image uploads/display via ImageKit.
- [ ] Verify SEO meta tags are working on social media (using tools like [metatags.io](https://metatags.io/)).

## 5. Security Checklist
- [x] **JWT_SECRET:** Ensure it is a strong secret on the server. (Handled)
- [x] **Route Protection:** Verify that only authors/admins can create/edit/delete posts. (Added middleware)
- [ ] **HTTPS:** Use `HTTPS` for both frontend and backend.
- [ ] **CORS:** Verify CORS is restricted to your frontend domain in production via `CLIENT_URL` env.
- [ ] **Secrets:** Ensure no `.env` files with production secrets are committed to Git.
