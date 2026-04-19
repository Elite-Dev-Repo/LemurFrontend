import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCommunities } from "../hooks/useCommunities";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ComposePost({ onSubmit }) {
  const { user } = useAuth();
  const { communities } = useCommunities();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div
        className="card p-5 text-center text-sm mb-4"
        style={{ color: "rgba(58,58,60,0.5)" }}
      >
        <Link
          to="/login"
          className="font-semibold underline"
          style={{ color: "var(--color-secondary)" }}
        >
          Sign in
        </Link>{" "}
        to start posting
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !communityId) {
      setError("Please fill in all fields.");
      toast.error("All fields are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        community: communityId,
      });
      setTitle("");
      setContent("");
      setCommunityId("");
      setOpen(false);
    } catch (err) {
      setError("Failed to create post.");
      toast.error("Failed to create post.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-4 md:p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="avatar w-9 h-9 md:w-10 md:h-10 text-xs md:text-sm shrink-0">
          {user.username[0].toUpperCase()}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 text-left px-4 py-2.5 rounded-xl text-sm border"
          style={{
            background: "rgba(33,40,66,0.05)",
            color: "rgba(58,58,60,0.5)",
            borderColor: "var(--color-border)",
          }}
        >
          {open ? "Composing…" : "What's on your mind?"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="space-y-3 animate-fadeIn">
          <input
            className="input-field text-base w-full" // text-base prevents iOS zoom
            placeholder="Post title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="input-field text-base w-full"
            placeholder="Write your post…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          <div className="relative">
            <select
              className="input-field appearance-none w-full text-sm"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
            >
              <option value="">Select a community *</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2 px-5 py-2"
            >
              <Send size={15} />
              {submitting ? "..." : "Publish"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
