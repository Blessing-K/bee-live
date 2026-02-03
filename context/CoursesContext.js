import { createContext, useContext, useState, useCallback } from "react";

const CoursesContext = createContext();

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false);

  const loadUserCourses = useCallback(async (userId) => {
    if (!hasLoadedCourses) {
      setLoadingCourses(true);
    }
    try {
      const response = await fetch("/api/getCourses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data && typeof data === "object") {
        console.warn("Expected array of courses, got object:", data);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error loading user courses:", err.message);
    } finally {
      setLoadingCourses(false);
      setHasLoadedCourses(true);
    }
  }, [hasLoadedCourses]);

  const addCourse = useCallback(async (userId, courseName, score) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateAdvice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Generate advice error: ${response.status} ${response.statusText}`,
          errorText,
        );
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Generate advice returned non-JSON response:", errorText);
        return;
      }

      const data = await response.json();
      let advice = data.advice || "No advice generated.";
      advice = advice.replace(/(\d+\.)/g, "\n$1");

      const storeResponse = await fetch("/api/storeCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseName,
          score: parseInt(score),
          advice,
        }),
      });

      if (!storeResponse.ok) {
        const errorText = await storeResponse.text();
        console.error(
          `Store API error: ${storeResponse.status} ${storeResponse.statusText}`,
          errorText,
        );
        return;
      }

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
  }, []);

  const deleteCourse = useCallback(async (userId, courseName) => {
    try {
      const response = await fetch("/api/deleteCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.courseName !== courseName),
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, []);

  const updateCourse = useCallback(
    async (userId, courseName, newScore) => {
      const scoreInt = parseInt(newScore);
      console.log("Updating course:", { userId, courseName, score: scoreInt });

      try {
        const response = await fetch("/api/updateCourse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseName, score: scoreInt }),
        });

        const responseText = await response.text();
        console.log("Update response status:", response.status);
        console.log("Update response:", responseText);

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${responseText}`);
        }

        console.log("Update successful, reloading courses from database");
        // Reload courses from database to get fresh data
        await loadUserCourses(userId);
        console.log("Courses reloaded successfully");
      } catch (err) {
        console.error("Update error:", err);
        alert(`Failed to update course: ${err.message}`);
        throw err;
      }
    },
    [loadUserCourses],
  );

  return (
    <CoursesContext.Provider
      value={{
        courses,
        addCourse,
        deleteCourse,
        updateCourse,
        loading,
        loadingCourses,
        hasLoadedCourses,
        loadUserCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
