import { RefreshCw } from "lucide-react";
import PostCard from "../components/PostCard";
import ComposePost from "../components/ComposePost";
import PostSkeleton from "../components/PostSkeleton";
import { usePosts } from "../hooks/usePosts";
import home from "../assets/home.svg";
import LemurLogo from "../components/LemurLogo";

export default function HomePage() {
  const { posts, loading, error, reload, submitPost, likePost, commentOnPost } =
    usePosts();

  return (
    /* Added px-4 for mobile gutters and pb-24 to clear the mobile bottom nav */
    <div className="max-w-2xl mx-auto px-4 md:px-0 pt-2 pb-24 md:pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-xl flex items-center gap-2 md:text-2xl font-bold"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          <div className="md:hidden">
            <LemurLogo />{" "}
          </div>
          Latest Posts
        </h1>
        <button
          onClick={reload}
          className="p-2 rounded-xl transition-colors"
          style={{ color: "rgba(58,58,60,0.4)" }}
          title="Refresh"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(33,40,66,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <RefreshCw size={17} strokeWidth={2} />
        </button>
      </div>

      {/* Compose */}
      <ComposePost onSubmit={submitPost} />

      {/* Feed */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div
          className="card p-8 text-center space-y-3"
          style={{ color: "rgba(58,58,60,0.5)" }}
        >
          <p className="text-sm">{error}</p>
          <button onClick={reload} className="btn-ghost mx-auto">
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="card p-12 text-center space-y-2">
          <div className="text-5xl mb-3">
            <img src={home} alt="" className="mx-auto w-1/2 md:w-1/3" />
          </div>
          <p
            className="font-bold text-lg"
            style={{
              color: "var(--color-secondary)",
              fontFamily: "'Space Mono', serif",
            }}
          >
            No posts yet
          </p>
          <p className="text-sm" style={{ color: "rgba(58,58,60,0.5)" }}>
            Be the first to share something with the community!
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        posts.map((post, i) => (
          <div
            key={post.id}
            className="animate-fadeUp"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
          >
            <PostCard post={post} onLike={likePost} onComment={commentOnPost} />
          </div>
        ))}
    </div>
  );
}
