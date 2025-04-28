export default function CourseCard({ course, onDelete }) {
    return (
      <div className="course-card">
        <h3 className="course-title">
          {course.courseName}
          <span className="score-inline">(Score: {course.score})</span>
        </h3>
  
        {onDelete && (
          <button onClick={onDelete} className="delete-btn">
            Delete
          </button>
        )}
  
        <div style={{ marginTop: "16px" }}>
          <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>📚 Study Tips:</h4>
          {renderAdvice(course.advice)}
        </div>
      </div>
    );
  }
  
  function renderAdvice(advice) {
    if (!advice) return <p>No advice available yet.</p>;
  
    const points = advice.split(/\d+\.\s+/).filter(p => p.trim() !== "");
  
    return (
      <ul>
        {points.map((point, idx) => (
          <li key={idx}>{point.trim()}</li>
        ))}
      </ul>
    );
  }
  