import { useState } from "react";
import { useCourses } from "../context/CoursesContext";

export default function CourseForm() {
  const [courseName, setCourseName] = useState("");
  const [score, setScore] = useState("");
  const { addCourse, loading } = useCourses();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName || !score) return;
    addCourse(courseName, score);
    setCourseName("");
    setScore("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="course-input"
      />
      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="course-input"
      />
      <button type="submit" style={{ backgroundColor: "#3b82f6", color: "#fff" }}>
        + Add Course
      </button>
      {loading && <p style={{ marginLeft: "10px", color: "#6b7280" }}>Generating smart advice...</p>}
    </form>
  );
}
