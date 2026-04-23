import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Loader2,
} from "lucide-react";

import searchsvg from "../assets/search.svg";
import PostCard from "../components/PostCard";
import ComposePost from "../components/ComposePost";
import PostSkeleton from "../components/PostSkeleton";
import { usePosts } from "../hooks/usePosts";
import home from "../assets/home.svg";
import LemurLogo from "../components/LemurLogo";
import { useState } from "react";
import { searchPosts } from "../api/client";

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const {
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
  } = usePosts();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await searchPosts(searchQuery);
      // Ensure we handle the data structure correctly (assuming results is the array)
      setSearchResults(data.results || data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 pt-2 pb-24 md:pb-8 space-y-4 relative">
      {/* Search Pop-up Overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm overflow-y-auto pb-10"
          onClick={closeSearch}
        >
          <div
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl animate-fadeUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-bold"
                style={{ fontFamily: "'Space Mono', serif" }}
              >
                Search Posts
              </h3>
              <button
                onClick={closeSearch}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search for something..."
                autoFocus
                value={searchQuery}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResults([]);
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
                style={{ borderColor: "var(--color-secondary-light)" }}
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-4 py-3 rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                {searching ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
              </button>
            </div>

            {/* Search Results Area */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {searchResults.length > 0
                ? searchResults.map((post) => (
                    <div key={post.id} className="animate-fadeUp">
                      <PostCard
                        post={post}
                        onLike={likePost}
                        onComment={commentOnPost}
                      />
                    </div>
                  ))
                : !searching &&
                  searchQuery && (
                    <p className="text-center text-sm py-4 opacity-50">
                      <img src={searchsvg} className="w-20 mx-auto" alt="" />
                    </p>
                  )}
            </div>
          </div>
        </div>
      )}

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
            <LemurLogo />
          </div>
          Latest Posts
        </h1>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setShowSearch(true)}>
            <Search
              size={34}
              strokeWidth={2}
              className="p-2 rounded-lg hover:bg-black/10"
            />
          </button>
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

      {/* Pagination */}
      {(prevUrl || nextUrl) && !loading && (
        <div className="flex items-center justify-center gap-3 pt-2 pb-4">
          <button
            onClick={loadPrev}
            disabled={!prevUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: prevUrl
                ? "var(--color-secondary)"
                : "rgba(33,40,66,0.08)",
              color: prevUrl ? "var(--color-primary)" : "rgba(58,58,60,0.4)",
            }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            Previous
          </button>

          <button
            onClick={loadNext}
            disabled={!nextUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: nextUrl
                ? "var(--color-secondary)"
                : "rgba(33,40,66,0.08)",
              color: nextUrl ? "var(--color-primary)" : "rgba(58,58,60,0.4)",
            }}
          >
            Next
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
