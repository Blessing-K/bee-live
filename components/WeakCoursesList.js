import CourseCard from "./CourseCard";

export default function WeakCoursesList({ courses }) {
  const weakCourses = courses.filter((course) => course.score < 3);

  if (weakCourses.length === 0) {
    return <p>No courses needing attention yet.</p>;
  }

  return (
    <>
      {weakCourses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </>
  );
}
