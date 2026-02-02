export default function DashboardCourseCard({ course }) {
  return (
    <div className="course-card">
      <div className="course-card-header">
        <h3 className="course-title" style={{ margin: 0 }}>
          {course.courseName}
        </h3>
        <span className="score-badge">Score: {course.score}</span>
      </div>

      <div>
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
          📚 Study Tips:
        </h4>
        {renderAdvice(course.advice)}
      </div>

      <style jsx>{`
        .course-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .course-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

function renderAdvice(advice) {
  if (!advice) return <p>No advice available yet.</p>;

  const points = advice.split(/\d+\.\s+/).filter((p) => p.trim() !== "");

  return (
    <ul>
      {points.map((point, idx) => (
        <li key={idx}>{point.trim()}</li>
      ))}
    </ul>
  );
}
