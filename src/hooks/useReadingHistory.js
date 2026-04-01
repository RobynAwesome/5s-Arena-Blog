import { useState, useCallback } from "react";

const STORAGE_KEY = "5s_reading_history";
const MAX_ITEMS = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    // Migration: if items are just IDs (strings/numbers), clear it to avoid errors
    if (data.length > 0 && typeof data[0] !== 'object') {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

export function useReadingHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addToHistory = useCallback((post) => {
    if (!post || !post.id) return;

    setHistory((prev) => {
      // If post.id is already the most recent entry, do nothing
      if (prev[0]?.id === post.id) return prev;

      // Extract only needed fields to save space
      const minimalPost = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        image: post.image || post.coverImage,
      };

      // Remove existing occurrence (if any), then prepend
      const filtered = prev.filter((p) => p.id !== post.id);
      const updated = [minimalPost, ...filtered].slice(0, MAX_ITEMS);

      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
