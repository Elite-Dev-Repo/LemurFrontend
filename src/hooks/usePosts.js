import { useState, useEffect, useCallback } from "react";
import { fetchPosts, createPost, toggleLike, addComment } from "../api/client";
import api from "../api/client";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [prevUrl, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFromUrl = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      // If url is null fetch the default first page
      const { data } = url ? await api.get(url) : await fetchPosts();
      setPrevUrl(data.previous ?? null);
      setNextUrl(data.next ?? null);
      setPosts(Array.isArray(data) ? data : (data.results ?? []));
      // Scroll back to top of feed on page change
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not load posts. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFromUrl(null);
  }, [loadFromUrl]);

  const reload = useCallback(() => loadFromUrl(null), [loadFromUrl]);
  const loadPrev = useCallback(
    () => prevUrl && loadFromUrl(prevUrl),
    [prevUrl, loadFromUrl],
  );
  const loadNext = useCallback(
    () => nextUrl && loadFromUrl(nextUrl),
    [nextUrl, loadFromUrl],
  );

  const submitPost = useCallback(async (payload) => {
    const { data } = await createPost(payload);
    setPosts((p) => [data, ...p]);
    return data;
  }, []);

  const likePost = useCallback(async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              like_count: p._liked ? p.like_count - 1 : p.like_count + 1,
              _liked: !p._liked,
            },
      ),
    );
    try {
      await toggleLike(postId);
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id !== postId
            ? p
            : {
                ...p,
                like_count: p._liked ? p.like_count - 1 : p.like_count + 1,
                _liked: !p._liked,
              },
        ),
      );
    }
  }, []);

  const commentOnPost = useCallback(async (postId, content) => {
    const { data } = await addComment(postId, content);
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : { ...p, comments: [...(p.comments ?? []), data] },
      ),
    );
    return data;
  }, []);

  return {
    posts,
    loading,
    error,
    prevUrl,
    nextUrl,
    reload,
    loadPrev,
    loadNext,
    submitPost,
    likePost,
    commentOnPost,
  };
}
