import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lemur_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("lemur_refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}token/refresh/`,
            { refresh },
          );
          localStorage.setItem("lemur_access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  },
);

// ─── Auth ───────────────────────────────────────────────
export const authLogin = (username, password) =>
  api.post("token/", { username, password });

export const authRegister = (username, email, password) =>
  api.post("register/", { username, email, password });

// ─── Posts ──────────────────────────────────────────────
export const fetchPosts = () => api.get("posts/");
export const fetchPost = (id) => api.get(`posts/${id}/`);
export const createPost = (payload) => api.post("posts/", payload);

// ─── Likes ──────────────────────────────────────────────
export const toggleLike = (postId) =>
  api.post("like_post/", { post_id: postId });

// ─── Comments ───────────────────────────────────────────
export const addComment = (postId, content) =>
  api.post("create_comment/", { post_id: postId, content });

// ─── Communities ────────────────────────────────────────
export const fetchCommunities = () => api.get("list-communities/");

export default api;
