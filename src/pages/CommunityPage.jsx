import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash } from "lucide-react";
import { fetchPosts, fetchCommunities } from "../api/client";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { usePosts } from "../hooks/usePosts";
import empty from "../assets/empty.svg";

export default function CommunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { likePost, commentOnPost } = usePosts();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCommunities(), fetchPosts()])
      .then(([commsRes, postsRes]) => {
        const all = Array.isArray(commsRes.data)
          ? commsRes.data
          : (commsRes.data.results ?? []);
        const found = all.find((c) => String(c.id) === String(id));
        setCommunity(found ?? null);

        const allPosts = Array.isArray(postsRes.data)
          ? postsRes.data
          : (postsRes.data.results ?? []);
        const filtered = allPosts.filter(
          (p) => String(p.community?.id ?? p.community) === String(id),
        );
        setPosts(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-5 animate-fadeUp px-1 md:px-0">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium transition-colors py-2"
        style={{ color: "rgba(58,58,60,0.6)" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </button>

      {/* Community header */}
      {community ? (
        <div className="bg-secondary text-white p-5 md:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="p-1.5 md:p-2 rounded-xl"
              style={{
                background: "var(--color-secondary)",
                color: "var(--color-primary)",
              }}
            >
              <Hash size={18} md:size={20} strokeWidth={2.5} />
            </span>
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{
                fontFamily: "'Space Mono', serif",
                color: "var(--color-primary)",
              }}
            >
              {community.name}
            </h1>
          </div>
          {community.description && (
            <p className="text-sm leading-relaxed text-primary">
              {community.description}
            </p>
          )}
          <p className="text-xs" style={{ color: "rgba(58,58,60,0.4)" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      ) : (
        !loading && (
          <div className="card p-6">
            <p className="text-sm" style={{ color: "rgba(58,58,60,0.5)" }}>
              Community not found.
            </p>
          </div>
        )
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {posts.length === 0 ? (
            <div className="card p-10 text-center space-y-2">
              <div className="text-3xl">
                <img src={empty} alt="" className="mx-auto w-40" />
              </div>
              <p
                className="font-semibold"
                style={{
                  color: "var(--color-secondary)",
                  fontFamily: "'Space Mono', serif",
                }}
              >
                No posts in this community yet
              </p>
            </div>
          ) : (
            posts.map((post, i) => (
              <div
                key={post.id}
                className="animate-fadeUp"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "both",
                }}
              >
                <PostCard
                  post={post}
                  onLike={likePost}
                  onComment={commentOnPost}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
