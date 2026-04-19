import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";

export default function AppLayout() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-primary)" }}
    >
      {/* Changed to grid-cols-1 for mobile, 260px_1fr for desktop */}
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-screen">
        <LeftSidebar />
        {/* Added pb-20 so mobile content clears the bottom nav bar */}
        <main className="min-h-screen py-4 px-4 md:py-6 md:px-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
