import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Bee-Live
      </div>
      <nav className="nav-links">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/goals">Goals</Link>
      </nav>
    </aside>
  );
}
