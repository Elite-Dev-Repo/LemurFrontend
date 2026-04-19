import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, Calendar, Heart, MessageCircle } from "lucide-react";
import { fetchPost, toggleLike, addComment } from "../api/client";
import { useAuth } from "../context/AuthContext";
import PostSkeleton from "../components/PostSkeleton";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchPost(id);
      setPost(data);
    } catch {
      setError("Post not found or unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleLike = async () => {
    if (!user || !post) return;
    setPost((p) => ({
      ...p,
      like_count: p._liked ? p.like_count - 1 : p.like_count + 1,
      _liked: !p._liked,
    }));
    try {
      await toggleLike(post.id);
    } catch {
      setPost((p) => ({
        ...p,
        like_count: p._liked ? p.like_count - 1 : p.like_count + 1,
        _liked: !p._liked,
      }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting || !user) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(post.id, commentText.trim());
      setPost((p) => ({ ...p, comments: [...(p.comments ?? []), data] }));
      setCommentText("");
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 px-4 md:px-0">
        <div className="skeleton h-8 w-24 rounded-xl" />
        <PostSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="card p-12 text-center space-y-4">
          <p className="text-4xl">🔍</p>
          <p
            className="font-bold text-lg"
            style={{
              color: "var(--color-secondary)",
              fontFamily: "'Space Mono', serif",
            }}
          >
            {error ?? "Post not found"}
          </p>
          <button onClick={() => navigate(-1)} className="btn-ghost mx-auto">
            <ArrowLeft size={15} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const commentCount = post.comments?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeUp px-4 md:px-0 pb-24 md:pb-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium transition-colors py-1"
        style={{ color: "rgba(58,58,60,0.6)" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </button>

      {/* Main post card */}
      <article className="card p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="avatar w-10 h-10 md:w-12 md:h-12 text-sm md:text-base shrink-0"
            style={{
              background: "var(--color-secondary)",
              color: "var(--color-primary)",
            }}
          >
            {post.author?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-sm md:text-base truncate"
              style={{ color: "var(--color-secondary)" }}
            >
              {post.author?.username ?? "Anonymous"}
            </p>
            <p
              className="text-[10px] md:text-xs"
              style={{ color: "rgba(58,58,60,0.45)" }}
            >
              @{(post.author?.username ?? "anon").toLowerCase()}
            </p>
            {post.created_at && (
              <div
                className="flex items-center gap-1 mt-0.5 text-[10px] md:text-xs"
                style={{ color: "rgba(58,58,60,0.45)" }}
              >
                <Calendar size={10} />
                <span className="truncate">
                  {new Date(post.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {(post.community_name || post.community?.name) && (
            <span className="community-badge shrink-0 text-[10px] md:text-xs px-2 py-0.5">
              <Hash size={10} />
              {post.community_name ?? post.community?.name}
            </span>
          )}
        </div>

        {post.title && (
          <h1
            className="text-2xl md:text-3xl font-bold leading-tight mb-4"
            style={{
              fontFamily: "'Space Mono', serif",
              color: "var(--color-secondary)",
            }}
          >
            {post.title}
          </h1>
        )}

        <p className="text-[10px] font-mono mb-4 md:mb-5 opacity-30 truncate">
          {post.id}
        </p>

        <div
          className="prose max-w-none text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-6"
          style={{ color: "var(--color-main)" }}
        >
          {post.content}
        </div>

        <div
          className="flex flex-wrap items-center gap-2 pt-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <button
            onClick={handleLike}
            disabled={!user}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all"
            style={{
              background: post._liked
                ? "rgba(231,76,60,0.08)"
                : "rgba(33,40,66,0.05)",
              color: post._liked ? "#e74c3c" : "rgba(58,58,60,0.6)",
            }}
          >
            <Heart
              size={16}
              fill={post._liked ? "#e74c3c" : "none"}
              stroke={post._liked ? "#e74c3c" : "currentColor"}
            />
            <span>{post.like_count ?? 0}</span>
          </button>

          <div
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium"
            style={{
              background: "rgba(33,40,66,0.05)",
              color: "rgba(58,58,60,0.6)",
            }}
          >
            <MessageCircle size={16} />
            <span>{commentCount}</span>
          </div>
        </div>
      </article>

      {/* Comments section */}
      <section className="space-y-4">
        <h2
          className="text-base md:text-lg font-bold px-1"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          {commentCount} {commentCount === 1 ? "Reply" : "Replies"}
        </h2>

        {user ? (
          <form onSubmit={handleComment} className="card p-4">
            <div className="flex gap-3">
              <div className="avatar w-8 h-8 text-xs shrink-0">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  className="input-field text-base"
                  placeholder="Write your reply…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  style={{ resize: "none" }}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submitting}
                    className="btn-primary py-2 px-5 text-sm"
                  >
                    {submitting ? "..." : "Post Reply"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            className="card p-5 text-center text-sm"
            style={{ color: "rgba(58,58,60,0.5)" }}
          >
            <Link
              to="/login"
              className="font-semibold underline"
              style={{ color: "var(--color-secondary)" }}
            >
              Sign in
            </Link>{" "}
            to reply
          </div>
        )}

        {post.comments?.map((c, i) => (
          <div
            key={c.id}
            className="card p-4 flex gap-3 animate-fadeUp"
            style={{ animationDelay: `${i * 30}ms`, animationFillMode: "both" }}
          >
            <div className="avatar w-8 h-8 text-xs shrink-0">
              {c.user?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-semibold text-xs md:text-sm truncate"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {c.user?.username ?? "Anonymous"}
                </span>
                <span className="text-[10px] md:text-xs shrink-0 opacity-50">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed break-words"
                style={{ color: "var(--color-main)" }}
              >
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
