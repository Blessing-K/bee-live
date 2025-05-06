import { createContext, useContext, useState } from "react";

const CoursesContext = createContext();

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUserCourses = async (userId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GET_COURSE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("Invalid data received:", data);
      }
    } catch (err) {
      console.error("Error loading user courses:", err);
    }
  };

  const addCourse = async (userId, courseName, score) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateAdvice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName }),
      });

      const data = await response.json();
      let advice = data.advice || "No advice generated.";
      advice = advice.replace(/(\d+\.)/g, "\n$1");

      await fetch(process.env.NEXT_PUBLIC_STORE_COURSE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseName,
          score: parseInt(score),
          advice,
        }),
      });

      const newCourse = {
        courseName,
        score: parseInt(score),
        advice,
      };

      setCourses((prev) => [...prev, newCourse]);
    } catch (error) {
      console.error("Error generating advice:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (userId, courseName) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DELETE_COURSE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.courseName !== courseName)
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <CoursesContext.Provider
      value={{ courses, addCourse, deleteCourse, loading, loadUserCourses }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
