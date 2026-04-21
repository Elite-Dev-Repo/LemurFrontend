import { useAuth } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { filterPosts } from "../api/client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postOwner, setPostOwner] = useState("Guest");

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data } = await filterPosts(id);
      // we are accessing the correct data structure from your API
      setPosts(data.results || []);
      setPostOwner(data.results[0].author.username);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-5 animate-fadeUp px-1 md:px-0">
      <h1
        className="text-2xl font-bold"
        style={{
          fontFamily: "'Space Mono', serif",
          color: "var(--color-secondary)",
        }}
      >
        Currently Viewing
      </h1>

      <div className="card p-6 md:p-8 text-center space-y-4">
        <div
          className="avatar w-20 h-20 text-2xl mx-auto shadow-sm"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-primary)",
          }}
        >
          {postOwner[0].toUpperCase()}
        </div>
        <div className="space-y-1">
          <h2
            className="text-xl font-bold"
            style={{
              fontFamily: "'Space Mono', serif",
              color: "var(--color-secondary)",
            }}
          >
            {postOwner}
          </h2>
          <p className="text-sm" style={{ color: "rgba(58,58,60,0.5)" }}>
            @{postOwner.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="card p-6 flex flex-col items-start space-y-2">
        <h2 className="font-bold mb-2 text-center mx-auto">--Posts--</h2>

        {loading ? (
          <div className="w-10 h-10 border-[10px]  mx-auto border-dashed  border-secondary rounded-full animate-spin"></div>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="w-full transition-opacity"
            >
              <p className="text-sm p-2 hover:bg-slate-50 font-medium border-b border-gray-100 py-2 truncate">
                <span className="font-bold mr-2">-</span> {post.title}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm opacity-50">No posts found.</p>
        )}
      </div>
    </div>
  );
}
