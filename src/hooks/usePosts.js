import { useState, useEffect, useCallback } from "react";
import { fetchPosts, createPost, toggleLike, addComment } from "../api/client";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchPosts();
      setPosts(Array.isArray(data) ? data : (data.results ?? []));
    } catch {
      setError("Could not load posts. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submitPost = useCallback(async (payload) => {
    const { data } = await createPost(payload);
    setPosts((p) => [data, ...p]);
    return data;
  }, []);

  const likePost = useCallback(async (userId, postId) => {
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
      // revert
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

  const commentOnPost = useCallback(async (userId, postId, content) => {
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
    reload: load,
    submitPost,
    likePost,
    commentOnPost,
  };
}
