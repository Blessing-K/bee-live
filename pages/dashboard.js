import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useCourses } from "../context/CoursesContext";
import DashboardCourseCard from "../components/DashboardCourseCard";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const router = useRouter();
  const { courses } = useCourses();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthSession({ forceRefresh: true });
        
        const user = await getCurrentUser();
        setUsername(user.username);
      } catch (error) {
        console.error('Auth failed:', error);
        router.push('/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <Layout><p>Loading session...</p></Layout>;
  }

  const weakCourses = courses.filter((course) => course.score <= 3);

  return (
    <Layout>
      <h1>Welcome, {username}!</h1>
      <p>Let&apos;s improve your academic performance today </p>
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