import api from "./api";

export async function getAllPosts({ page = 1, limit = 9, sort, search, category } = {}) {
  try {
    const response = await api.get("/posts", {
      params: { page, limit, sort, search, category },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0, totalPages: 0, page };
  }
}

export async function getPostBySlug(slug) {
  try {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedPosts() {
  try {
    const response = await api.get("/posts/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getRecentPosts(limit = 6) {
  try {
    const response = await api.get("/posts", {
      params: { limit, sort: "recent" },
    });
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export async function getPopularPosts(limit = 5) {
  try {
    const response = await api.get("/posts", {
      params: { limit, sort: "popular" },
    });
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}

export async function getRelatedPosts(currentSlug, limit = 4) {
  // The backend doesn't have a related posts endpoint yet, so we'll fetch some and filter
  // Alternatively, we could add one. For now, let's just get recent ones as a fallback
  try {
    const post = await getPostBySlug(currentSlug);
    if (!post) return [];
    
    const response = await api.get("/posts", {
      params: { limit: limit + 1, category: post.category },
    });
    return response.data.posts.filter(p => p.slug !== currentSlug).slice(0, limit);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function getAdjacentPosts(currentSlug) {
  // This is hard with the current API. We might need a backend change or just return null for now
  // To keep it simple, we'll return nulls.
  return { prev: null, next: null };
}

export async function getAuthors() {
  try {
    const response = await api.get("/auth/authors"); // Assuming we add this or have it
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getPostsByAuthor(authorName) {
  try {
    const response = await api.get("/posts", {
      params: { search: authorName }, // Simple search by author name if supported
    });
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    return [];
  }
}
