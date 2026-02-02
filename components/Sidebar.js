import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "aws-amplify/auth";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => router.pathname === path;

  return (
    <aside className="modern-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">🐝</div>
          <div className="logo-text">
            <h2>Bee-Live</h2>
            <p>Stay Focused</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/dashboard"
          className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </Link>

        <Link
          href="/courses"
          className={`nav-item ${isActive("/courses") ? "active" : ""}`}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">Courses</span>
        </Link>

        <Link
          href="/goals"
          className={`nav-item ${isActive("/goals") ? "active" : ""}`}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Goals</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>

      <style jsx>{`
        .modern-sidebar {
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg) var(--spacing-md);
          box-shadow: var(--shadow-xl);
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: var(--spacing-lg);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .logo-icon {
          font-size: 2.5rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .logo-text h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text p {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .nav-item {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 12px;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 700;
          font-size: 18px;
          position: relative;
          margin-bottom: 8px;
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 32px;
          width: 5px;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 0 4px 4px 0;
        }

        .nav-item:hover {
          background: rgba(59, 130, 246, 0.2);
          color: #ffffff;
          transform: translateX(3px);
        }

        .nav-item.active {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.3) 0%,
            rgba(37, 99, 235, 0.3) 100%
          );
          color: #ffffff;
          font-weight: 800;
        }

        .nav-item.active::before {
          opacity: 1;
        }

        .nav-icon {
          font-size: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .nav-label {
          font-size: 18px;
          color: #ffffff;
          white-space: nowrap;
          flex: 1;
          font-weight: inherit;
        }

        .sidebar-footer {
          padding-top: var(--spacing-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center;
          gap: 10px;
          padding: 16px 20px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f1f5f9;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 17px;
        }

        .logout-btn .nav-icon {
          font-size: 22px;
        }

        .logout-btn .nav-label {
          font-size: 17px;
          font-weight: 600;
          flex: 0 0 auto;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #f87171;
          color: #ffffff;
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .modern-sidebar {
            width: 100%;
            height: auto;
            position: relative;
            padding: var(--spacing-md) var(--spacing-md);
          }

          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: space-between;
            padding: 0 var(--spacing-sm);
          }

          .nav-label {
            display: inline;
            font-size: 14px;
          }

          .nav-item {
            padding: 10px 12px;
            font-size: 14px;
            width: auto;
            flex: 1 1 0;
            justify-content: center !important;
          }

          .logout-btn {
            padding: 10px 12px;
            font-size: 14px;
            gap: 8px;
            justify-content: center;
          }
        }
      `}</style>
    </aside>
  );
}
