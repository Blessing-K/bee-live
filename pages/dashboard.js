import { useEffect, useState } from "react";
import { signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { useCourses } from "../context/CoursesContext";
import DashboardCourseCard from "../components/DashboardCourseCard";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { courses, loadUserCourses, loadingCourses, hasLoadedCourses } =
    useCourses();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession({ forceRefresh: true });
        const name = user.username;

        // Get userId from multiple possible sources
        const userId =
          user.userId || user.sub || session.userSub || user.username;

        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        setUsername(displayName);
        setUserId(userId);

        if (typeof window !== "undefined" && userId) {
          const firstLoginKey = `bee-live-seen-${userId}`;
          const hasSeen = window.localStorage.getItem(firstLoginKey);
          if (!hasSeen) {
            window.localStorage.setItem(firstLoginKey, "true");
            setIsFirstLogin(true);
          } else {
            setIsFirstLogin(false);
          }
        }

        // Load courses with the userId
        if (userId) {
          await loadUserCourses(userId);
        } else {
          console.warn("Could not determine userId from auth session");
        }
      } catch (error) {
        console.error("Auth check error:", error?.message || error);
      }
    };
    loadData();
  }, [loadUserCourses]);

  const weakCourses = courses
    .filter((course) => (course.score || 0) <= 3)
    .sort((a, b) => (a.score || 0) - (b.score || 0));

  const strongCourses = courses.filter((course) => (course.score || 0) >= 7);
  const averageScore =
    courses.length > 0
      ? (
          courses.reduce((sum, c) => sum + (c.score || 0), 0) / courses.length
        ).toFixed(1)
      : 0;

  const showInitialLoading = loadingCourses && !hasLoadedCourses;

  if (showInitialLoading) {
    return (
      <Layout>
        <div className="page-header text-center">
          <div className="animate-spin">⏳</div>
          <p>Loading your courses...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="modern-dashboard">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div>
            <h1>
              {isFirstLogin ? "Welcome" : "Welcome back"}, {username}! 👋
            </h1>
            <p>Here&apos;s your academic overview</p>
          </div>
        </div>

        {/* Statistics Cards */}
        {showInitialLoading ? (
          <div className="card text-center" style={{ padding: "var(--spacing-xl)" }}>
            <p style={{ margin: 0 }}>Loading courses...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                📚
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Courses</p>
                <h2 className="stat-value">{courses.length}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              >
                📊
              </div>
              <div className="stat-content">
                <p className="stat-label">Average Score</p>
                <h2 className="stat-value">{averageScore}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                }}
              >
                ⚡
              </div>
              <div className="stat-content">
                <p className="stat-label">Strong Courses</p>
                <h2 className="stat-value">{strongCourses.length}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                }}
              >
                ⚠️
              </div>
              <div className="stat-content">
                <p className="stat-label">Needs Attention</p>
                <h2 className="stat-value">{weakCourses.length}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Courses Needing Attention */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🎯 Courses Needing Attention</h2>
            <Link href="/courses" className="btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {showInitialLoading ? (
            <div
              className="card text-center"
              style={{ padding: "var(--spacing-xl)" }}
            >
              <p style={{ margin: 0 }}>Loading courses...</p>
            </div>
          ) : weakCourses.length > 0 ? (
            <div className="grid grid-3">
              {weakCourses.slice(0, 3).map((course, index) => (
                <DashboardCourseCard key={index} course={course} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div
              className="card text-center"
              style={{ padding: "var(--spacing-2xl)" }}
            >
              <div
                style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}
              >
                📚
              </div>
              <h3
                style={{
                  color: "var(--gray-900)",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                No courses yet
              </h3>
              <p
                style={{
                  color: "var(--gray-600)",
                  marginBottom: "var(--spacing-lg)",
                  fontSize: "1rem",
                }}
              >
                Get started by adding your first course!
              </p>
              <Link href="/courses" className="btn-primary">
                Add Your First Course
              </Link>
            </div>
          ) : (
            <div
              className="card"
              style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                🌟
              </div>
              <h3
                style={{
                  color: "var(--gray-900)",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                Great job!
              </h3>
              <p
                style={{
                  color: "var(--gray-700)",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                All your courses are performing well. Keep up the excellent
                work!
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modern-dashboard {
          animation: fadeIn 0.5s ease-in;
        }

        .dashboard-hero {
          margin-bottom: var(--spacing-2xl);
        }

        .dashboard-hero h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-hero p {
          color: var(--gray-600);
          font-size: 1.125rem;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .stat-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          animation: slideDown 0.5s ease-out;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-500);
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }

        .dashboard-section {
          margin-bottom: var(--spacing-2xl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </Layout>
  );
}
