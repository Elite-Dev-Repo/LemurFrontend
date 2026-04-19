import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Hash, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "sonner";

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

export default function PostCard({
  post,
  onLike,
  onComment,
  expanded = false,
}) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(expanded);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const commentCount = post.comments?.length ?? post.comment_count ?? 0;

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    onLike?.(user.id, post.id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting || !user) return;
    setSubmitting(true);
    try {
      await onComment?.(user.id, post.id, commentText.trim());
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article
      className="card p-4 md:p-5 animate-fadeUp mb-3 md:mb-4"
      style={{ animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 md:gap-3 mb-3">
        <div className="avatar w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm shrink-0 mt-0.5">
          {post.author?.username?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-1.5 md:gap-x-2 gap-y-0.5">
            <span
              className="font-semibold text-xs md:text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              {post.author?.username ?? "Anonymous"}
            </span>
            <span
              className="text-[10px] md:text-xs"
              style={{ color: "rgba(58,58,60,0.45)" }}
            >
              @{(post.author?.username ?? "anon").toLowerCase()}
            </span>
            {post.created_at && (
              <>
                <span
                  className="hidden xs:inline"
                  style={{ color: "rgba(58,58,60,0.25)" }}
                >
                  ·
                </span>
                <span
                  className="flex items-center gap-1 text-[10px] md:text-xs"
                  style={{ color: "rgba(58,58,60,0.45)" }}
                >
                  <Calendar size={10} md:size={11} />
                  {timeAgo(post.created_at)}
                </span>
              </>
            )}
          </div>
          {(post.community_name || post.community?.name) && (
            <span className="community-badge mt-1 text-[9px] md:text-[11px]">
              <Hash size={10} />
              {post.community_name ?? post.community?.name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block group">
        {post.title && (
          <h2
            className="font-bold text-base md:text-lg leading-snug mb-2 group-hover:underline decoration-1"
            style={{
              fontFamily: "'Space Mono', serif",
              color: "var(--color-secondary)",
            }}
          >
            {post.title}
          </h2>
        )}
        <p
          className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words"
          style={{ color: "var(--color-main)" }}
        >
          {expanded
            ? post.content
            : post.content?.length > 280
              ? post.content.slice(0, 280) + "…"
              : post.content}
        </p>
      </Link>

      <p
        className="text-[10px] font-mono mt-2 mb-3 truncate"
        style={{ color: "rgba(58,58,60,0.25)" }}
      >
        {post.id}
      </p>

      {/* Action bar */}
      <div
        className="flex items-center justify-between md:justify-start gap-1 md:gap-4 pt-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowComments((v) => !v);
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium"
          style={{
            color: showComments
              ? "var(--color-secondary)"
              : "rgba(58,58,60,0.5)",
          }}
        >
          <MessageCircle size={17} />
          <span>{commentCount}</span>
        </button>

        <button
          onClick={handleLike}
          disabled={!user}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium"
          style={{
            color: post._liked ? "#e74c3c" : "rgba(58,58,60,0.5)",
            cursor: user ? "pointer" : "not-allowed",
          }}
        >
          <Heart
            size={17}
            fill={post._liked ? "#e74c3c" : "none"}
            stroke={post._liked ? "#e74c3c" : "currentColor"}
          />
          <span>{post.like_count ?? 0}</span>
        </button>

        <button
          className="flex items-center px-2 py-1.5 rounded-lg ml-auto"
          style={{ color: "rgba(58,58,60,.5)" }}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard?.writeText(
              window.location.origin + `/post/${post.id}`,
            );
            toast.success("Copied to clipboard!");
          }}
        >
          <Share2 size={17} />
        </button>
      </div>

      {showComments && (
        <div
          className="mt-4 pt-4 space-y-3"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {post.comments?.length > 0 ? (
            post.comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div className="avatar w-7 h-7 text-xs shrink-0">
                  {c.user?.username?.[0]?.toUpperCase() ?? "?"}
                </div>

                <div
                  className="flex-1 rounded-xl px-3 py-2 text-sm"
                  style={{ background: "rgba(33,40,66,0.04)" }}
                >
                  <span
                    className="font-semibold mr-2"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {c.user?.username}
                  </span>

                  <span style={{ color: "var(--color-main)" }}>
                    {c.content}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p
              className="text-sm text-center py-2"
              style={{ color: "rgba(58,58,60,0.4)" }}
            >
              No replies yet
            </p>
          )}

          {/* Comment input */}

          {user ? (
            <form onSubmit={handleComment} className="flex gap-2 pt-1">
              <div className="avatar w-7 h-7 text-xs shrink-0">
                {user.username[0].toUpperCase()}
              </div>

              <div
                className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  border: "1.5px solid var(--color-border-dark)",

                  background: "#fff",
                }}
              >
                <input
                  className="flex-1 bg-transparent text-sm outline-none"
                  placeholder="Write a reply…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ color: "var(--color-main)" }}
                />

                <button
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="text-xs font-bold transition-opacity disabled:opacity-30"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {submitting ? "…" : "Reply"}
                </button>
              </div>
            </form>
          ) : (
            <p
              className="text-xs text-center"
              style={{ color: "rgba(58,58,60,0.4)" }}
            >
              <Link
                to="/login"
                className="underline"
                style={{ color: "var(--color-secondary)" }}
              >
                Sign in
              </Link>{" "}
              to reply
            </p>
          )}
        </div>
      )}
    </article>
  );
}
