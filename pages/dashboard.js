import { useCourses } from "../context/CoursesContext";
import DashboardCourseCard from "../components/DashboardCourseCard";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const { courses } = useCourses();
  const weakCourses = courses.filter((course) => course.score < 3);

  return (
    <Layout>
      <h1>Welcome, Student!</h1>
      <p>Let's improve your academic performance today 🚀</p>

      <h2>Courses Needing Most Attention:</h2>

      <div className="cards-grid">
        {weakCourses.length ? (
          weakCourses.map((course, index) => (
            <DashboardCourseCard key={index} course={course} />
          ))
        ) : (
          <p>No courses needing attention yet.</p>
        )}
      </div>
    </Layout>
  );
}
