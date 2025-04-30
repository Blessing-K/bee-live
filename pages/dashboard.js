import { useEffect, useState } from 'react';
import { signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import { useCourses } from "../context/CoursesContext";
import DashboardCourseCard from "../components/DashboardCourseCard";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const router = useRouter();
  const { courses } = useCourses();
  const [username, setUsername] = useState('');
  const [authChecked, setAuthChecked] = useState(false); // changed from loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthSession({ forceRefresh: true });
        const user = await getCurrentUser();
        const name = user.username;
        setUsername(name.charAt(0).toUpperCase() + name.slice(1));
      } catch (error) {
        router.replace('/login'); // faster than push, avoids history entry
      } finally {
        setAuthChecked(true); // signal that auth check is done
      }
    };

    checkAuth();
  }, [router]);

  if (!authChecked) {
    return null; // don't render anything at all until auth check is done
  }

  const weakCourses = courses.filter((course) => course.score <= 3);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  return (
    <Layout>
      <h1>Welcome, {username}!</h1>
      <button onClick={handleLogout} className="logout-button">Sign Out</button>
      <p>Let&apos;s improve your academic performance today</p>
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
