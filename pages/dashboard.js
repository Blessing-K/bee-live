import { useEffect, useState } from 'react';
import { signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import { useCourses } from "../context/CoursesContext";
import DashboardCourseCard from "../components/DashboardCourseCard";
import Layout from "@/components/Layout";
import Link from 'next/link'; 

export default function Dashboard() {
  const router = useRouter();
  const { courses, loadUserCourses } = useCourses();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const user = await getCurrentUser();
        const name = user.username;
        const sub = session.userSub;
        setUsername(name.charAt(0).toUpperCase() + name.slice(1));
        setUserId(sub);
        await loadUserCourses(sub);
      } catch (error) {
        router.replace('/login');
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router, loadUserCourses]);

  if (!authChecked) {
    return null;
  }

  if (!authChecked) return null;

  const weakCourses = courses
  .filter((course) => (course.score || 0) <= 3)
  .sort((a, b) => (a.score || 0) - (b.score || 0));

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

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      margin: '1.5rem 0'
    },
    tab: {
      padding: '0.75rem 1rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b'
    },
    activeTab: {
      padding: '0.75rem 1rem',
      borderBottom: '2px solid #3b82f6',
      fontWeight: '600',
      color: '#1e293b'
    },
    emptyState: {
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      margin: '1.5rem 0'
    },
    ctaButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      marginTop: '1rem'
    }
  };

  return (
    <Layout>
      <div style={styles.header}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Welcome, {username}!</h1>
        <button 
          onClick={handleLogout} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2973B2',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={activeTab === 'dashboard' ? styles.activeTab : styles.tab}
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push('/courses')} 
          style={activeTab === 'courses' ? styles.activeTab : styles.tab}
        >
          My Courses
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <p>Let&apos;s improve your academic performance today</p>
          
          <h2>Courses Needing Most Attention:</h2>
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {weakCourses.length ? (
              weakCourses.map((course, index) => (
                <DashboardCourseCard key={index} course={course} />
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No courses needing attention yet</p>
                {courses.length === 0 && (
                  <>
                    <p>Get started by adding your first course!</p>
                    <button 
                      onClick={() => router.push('/courses')}
                      style={styles.ctaButton}
                    >
                      Add Courses
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}