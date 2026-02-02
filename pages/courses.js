import { useEffect, useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import CourseForm from "../components/CourseForm";
import { useCourses } from "../context/CoursesContext";
import CourseCard from "../components/CourseCard";
import Layout from "@/components/Layout";

export default function Courses() {
  const { courses, addCourse, deleteCourse, updateCourse } = useCourses();
  const [userId, setUserId] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        await fetchAuthSession({ forceRefresh: true });
        const user = await getCurrentUser();
        setUserId(user.userId || user.username);
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUserId();
  }, []);

  if (!authChecked) return null;

  const sortedCourses = [...courses].sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreA - scoreB;
  });

  return (
    <Layout>
      <div className="modern-courses-page">
        {/* Page Header */}
        <div className="page-header">
          <h1>📚 My Courses</h1>
          <p>Track and improve your academic performance</p>
        </div>

        {/* Statistics */}
        <div className="course-stats">
          <div className="stat-badge">
            <span className="stat-number">{courses.length}</span>
            <span className="stat-text">Total Courses</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {sortedCourses.filter((c) => (c.score || 0) >= 7).length}
            </span>
            <span className="stat-text">Excelling</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {sortedCourses.filter((c) => (c.score || 0) <= 3).length}
            </span>
            <span className="stat-text">Need Focus</span>
          </div>
        </div>

        {/* Add Course Form */}
        <div className="add-course-section">
          <CourseForm userId={userId} addCourse={addCourse} />
        </div>

        {/* Courses Grid */}
        {sortedCourses.length > 0 ? (
          <div
            className="grid grid-2"
            style={{ marginTop: "var(--spacing-xl)" }}
          >
            {sortedCourses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                userId={userId}
                onDelete={deleteCourse}
                onUpdate={updateCourse}
              />
            ))}
          </div>
        ) : (
          <div
            className="card text-center"
            style={{
              padding: "var(--spacing-2xl)",
              marginTop: "var(--spacing-xl)",
            }}
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
                color: "var(--gray-700)",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Add your first course above to start tracking your academic
              performance!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .modern-courses-page {
          animation: fadeIn 0.5s ease-in;
        }

        .course-stats {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .stat-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--white);
          padding: var(--spacing-lg);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          min-width: 120px;
          transition: all var(--transition-base);
        }

        .stat-badge:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .stat-text {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-top: var(--spacing-xs);
        }

        .add-course-section {
          margin-bottom: var(--spacing-xl);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  );
}
