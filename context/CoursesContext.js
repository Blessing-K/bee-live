import { createContext, useContext, useState } from "react";

const CoursesContext = createContext();

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const addCourse = async (courseName, score) => {
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

  const deleteCourse = (index) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, deleteCourse, loading }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
