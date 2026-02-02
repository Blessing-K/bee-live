import { useState } from "react";
import { useCourses } from "../context/CoursesContext";

export default function CourseForm({ userId }) {
  const [courseName, setCourseName] = useState("");
  const [score, setScore] = useState("");
  const { addCourse, loading } = useCourses();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName || !score || !userId) return;
    addCourse(userId, courseName, score);
    setCourseName("");
    setScore("");
  };

  return (
    <form onSubmit={handleSubmit} className="course-form">
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
      <button type="submit" className="btn-primary course-submit">
        + Add Course
      </button>
      {loading && <p className="course-loading">Generating smart advice...</p>}
    </form>
  );
}
