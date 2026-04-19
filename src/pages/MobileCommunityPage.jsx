import React from "react";
import { Hash, ChevronRight, Users, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommunities } from "../hooks/useCommunities";

const MobileCommunityPage = () => {
  const { communities, loading } = useCommunities();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeUp pb-24 px-4 pt-4">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          Communities
        </h1>
        <div
          className="p-2 rounded-full bg-secondary/5"
          style={{ color: "var(--color-secondary)" }}
        >
          <Compass size={22} />
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-3">
        <label
          className="text-[10px] font-bold uppercase tracking-widest px-1"
          style={{ color: "rgba(58,58,60,0.4)" }}
        >
          Your Spaces
        </label>

        <div className="card divide-y divide-gray-50 overflow-hidden">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
            ))
          ) : communities.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Users size={32} className="mx-auto opacity-20" />
              <p className="text-sm" style={{ color: "rgba(58,58,60,0.5)" }}>
                You haven't joined any communities yet.
              </p>
              <Link
                to="/"
                className="text-sm font-bold underline"
                style={{ color: "var(--color-secondary)" }}
              >
                Explore Feed
              </Link>
            </div>
          ) : (
            communities.map((c) => (
              <Link
                key={c.id}
                to={`/community/${c.id}`}
                className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "var(--color-primary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <Hash
                      size={18}
                      style={{ color: "var(--color-secondary)" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {c.name}
                    </h3>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(58,58,60,0.5)" }}
                    >
                      {c.memberCount || 0} members
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="opacity-30" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Discovery Section */}
      <div
        className="card p-6 text-center space-y-3"
        style={{
          background:
            "linear-gradient(to bottom right, #fff, var(--color-primary))",
        }}
      >
        <h4
          className="font-bold text-sm"
          style={{ fontFamily: "'Space Mono', serif" }}
        >
          Looking for more?
        </h4>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(58,58,60,0.6)" }}
        >
          New specialized communities are curated weekly. Check back soon for
          fresh topics.
        </p>
      </div>
    </div>
  );
};

export default MobileCommunityPage;
