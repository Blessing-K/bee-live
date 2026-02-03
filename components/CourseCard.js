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
      <div className="course-card-wrapper">
        <div className="course-card-header">
          <h3 className="course-title" style={{ margin: 0 }}>
            {course.courseName}
          </h3>
          <span className="score-badge">Score: {course.score}/10</span>
        </div>

        {isEditing && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Update Score (0-10):
            </label>
            <div className="course-card-edit-row">
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
        )}

        <div className="course-card-content">
          <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
            📚 Study Tips:
          </h4>
          {renderAdvice(course.advice)}
        </div>

        <div className="course-card-actions">
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

      <style jsx>{`
        .course-card-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 350px;
        }

        .edit-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .edit-btn:hover {
          background: linear-gradient(135deg, #0080ff 0%, #0066ff 100%);
          transform: translateY(-1px);
        }

        .delete-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #ff3333 0%, #cc0000 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .delete-btn:hover {
          background: linear-gradient(135deg, #ff5555 0%, #ff3333 100%);
          transform: translateY(-1px);
        }

        .score-badge {
          display: inline-block;
          padding: 4px 10px;
          background-color: #dbeafe;
          color: #2563eb;
          border-radius: 6px;
          font-weight: 500;
          font-size: 13px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .course-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .course-title {
          flex: 1;
          min-width: 0;
          word-break: break-word;
        }

        .course-card-content {
          flex: 1;
          margin-bottom: 16px;
        }

        .course-card-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .course-card-actions button {
          min-width: 120px;
          max-width: 160px;
        }

        .course-card-edit-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .course-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .score-badge {
            align-self: flex-start;
          }

          .course-card-actions {
            flex-direction: column;
          }

          .course-card-actions button {
            width: 100%;
          }

          .course-card-edit-row {
            flex-direction: column;
            align-items: stretch;
          }

          .course-card-edit-row button {
            width: 100%;
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
