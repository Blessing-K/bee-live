import { useState } from "react";

export default function CourseCard({ course, userId, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newScore, setNewScore] = useState(course.score);

  const handleUpdate = () => {
    if (newScore >= 0 && newScore <= 10) {
      onUpdate(userId, course.courseName, newScore);
      setIsEditing(false);
    }
  };

  return (
    <div className="course-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 className="course-title" style={{ margin: 0 }}>
          {course.courseName}
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
            {isEditing ? "Cancel" : "Edit Score"}
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(userId, course.courseName)}
              className="delete-btn"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            Update Score (0-10):
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              min="0"
              max="10"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "2px solid #3b82f6",
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            <button
              onClick={handleUpdate}
              className="btn-primary"
              style={{ padding: "8px 16px" }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "12px" }}>
          <span className="score-badge">Score: {course.score}/10</span>
        </div>
      )}

      <div style={{ marginTop: "16px" }}>
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
          📚 Study Tips:
        </h4>
        {renderAdvice(course.advice)}
      </div>

      <style jsx>{`
        .edit-btn {
          padding: 6px 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .edit-btn:hover {
          background-color: #2563eb;
        }

        .score-badge {
          display: inline-block;
          padding: 4px 10px;
          background-color: #dbeafe;
          color: #2563eb;
          border-radius: 6px;
          font-weight: 500;
          font-size: 13px;
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
