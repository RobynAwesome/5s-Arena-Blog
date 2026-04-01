import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

// IMPORTANT: Add your backend API URL to your .env file
// Example: VITE_API_URL=https://fivesarena.com/api
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Set your Google Client ID here or in .env as VITE_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("5s_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // On initial load, check for a token and fetch the user profile
  useEffect(() => {
    const token = localStorage.getItem("5s_token");
    if (token) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeaders(),
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid or expired
            localStorage.removeItem("5s_token");
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Invalid email or password.",
        };
      }
      localStorage.setItem("5s_token", data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Could not connect to the server." };
    }
  };

  // Register a new user
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Assuming 'name' is meant to be 'username' for backend
        body: JSON.stringify({ username: name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Registration failed.",
        };
      }
      localStorage.setItem("5s_token", data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Could not connect to the server." };
    }
  };

  // Login or Register with Google
  const googleLogin = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Google sign-in failed.",
        };
      }
      localStorage.setItem("5s_token", data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: "Google sign-in failed." };
    }
  };

  // Logout the user
  const logout = () => {
    localStorage.removeItem("5s_token");
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "Not authenticated." };
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || data.message || "Update failed." };
      }
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Could not connect to the server." };
    }
  };

  // NOTE: The functions below are placeholders for API calls.
  // They assume you have corresponding backend endpoints.
  const applyForAuthor = async (application) => {
    console.log("Applying for author with:", application);
    // Example API call:
    // const response = await fetch(`${API_URL}/author-applications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    //   body: JSON.stringify(application),
    // });
    // Handle response...
  };

  const approveAuthor = async (appId) => {
    console.log("Approving author:", appId);
    // Example API call:
    // const response = await fetch(`${API_URL}/admin/author-applications/${appId}/approve`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    // });
    // Handle response...
  };

  const rejectAuthor = async (appId) => {
    console.log("Rejecting author:", appId);
    // Example API call:
    // const response = await fetch(`${API_URL}/admin/author-applications/${appId}/reject`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    // });
    // Handle response...
  };

  const isAdmin = user?.role === "admin";
  const isAuthor = user?.role === "author" || user?.role === "admin";

  // Memoize the context value
  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      isAuthor,
      login,
      register,
      googleLogin,
      logout,
      updateProfile,
      applyForAuthor,
      approveAuthor,
      rejectAuthor,
    }),
    [user, loading, isAdmin, isAuthor],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
