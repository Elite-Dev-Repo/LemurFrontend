import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import { createPost } from "../api/client";
import { useCommunities } from "../hooks/useCommunities";
import { useAuth } from "../context/AuthContext";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { communities, loading: commLoading } = useCommunities();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="max-w-lg mx-auto card p-8 md:p-12 text-center space-y-4 mt-10">
        <p
          className="font-bold text-lg"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          Sign in to create a post
        </p>
        <Link to="/login" className="btn-primary inline-flex mx-auto">
          Sign in
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !communityId) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await createPost({
        title: title.trim(),
        content: content.trim(),
        community: communityId,
      });
      navigate(`/post/${data.id}`, { replace: true });
    } catch (err) {
      setError("Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-5 animate-fadeUp">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
          style={{ color: "rgba(58,58,60,0.5)" }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <h1
          className="text-xl md:text-2xl font-bold"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          Create a Post
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card p-5 md:p-6 space-y-4 md:space-y-5"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="avatar w-9 h-9 text-xs shrink-0">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              {user.username}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(58,58,60,0.45)" }}>
              Posting as @{user.username.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Community *
          </label>
          <div className="relative">
            <select
              className="input-field appearance-none pr-10 text-base"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              disabled={commLoading}
            >
              <option value="">
                {commLoading ? "Loading..." : "Choose a community"}
              </option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Title *
          </label>
          <input
            className="input-field text-base font-semibold"
            placeholder="Give your post a clear title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Content *
          </label>
          <textarea
            className="input-field text-base"
            placeholder="Write your post content here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ minHeight: "160px" }}
          />
        </div>

        {error && (
          <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-6"
          >
            <Send size={15} />
            {submitting ? "..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
