import { useEffect, useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import CourseForm from "../components/CourseForm";
import { useCourses } from "../context/CoursesContext";
import CourseCard from "../components/CourseCard";
import Layout from "@/components/Layout";

export default function Courses() {
  const { courses, addCourse, deleteCourse } = useCourses();
  const [userId, setUserId] = useState('');
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
      <div className="courses-page">
        <h1>My Courses</h1>
        <p>Manage and track your academic courses</p>

        <div className="course-form courses-grid">
          <CourseForm userId={userId} addCourse={addCourse} />
        </div>

        <div className="cards-grid" style={{ marginTop: "30px" }}>
          {sortedCourses.map((course, index) => (
            <CourseCard
              key={index}
              course={course}
              userId={userId}
              onDelete={deleteCourse}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
