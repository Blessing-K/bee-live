import CourseForm from "../components/CourseForm";
import { useCourses } from "../context/CoursesContext";
import CourseCard from "../components/CourseCard";
import Layout from "@/components/Layout";

export default function Courses() {
  const { courses, addCourse, deleteCourse } = useCourses();

  return (
    <Layout>
      <h1>My Courses</h1>
      <p>Manage and track your academic courses</p>

      <CourseForm addCourse={addCourse} />

      <div className="cards-grid" style={{ marginTop: "30px" }}>
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            course={course}
            onDelete={() => deleteCourse(index)}
          />
        ))}
      </div>
    </Layout>
  );
}
