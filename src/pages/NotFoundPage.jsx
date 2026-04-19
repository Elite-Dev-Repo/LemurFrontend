import { Link } from "react-router-dom";
import notfound from "../assets/404.svg";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-6"
      style={{ background: "var(--color-primary)" }}
    >
      <div className="text-center space-y-4 md:space-y-5 animate-fadeUp">
        <div className="w-3/4 mx-auto md:w-1/4">
          <img src={notfound} alt="" className="w-50" />
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          404
        </h1>
        <p
          className="text-base md:text-lg"
          style={{ color: "rgba(58,58,60,0.55)" }}
        >
          This page has wandered off into the trees.
        </p>
        <Link to="/" className="btn-primary inline-flex mx-auto mt-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
