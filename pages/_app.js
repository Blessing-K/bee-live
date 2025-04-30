import '@/styles/globals.css';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { CoursesProvider } from '../context/CoursesContext';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner'; // Create this simple component

Amplify.configure(awsExports);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuthState() {
      try {
        await getCurrentUser();
        // If on login page while authenticated, redirect to dashboard
        if (router.pathname === '/login' || router.pathname === '/signup') {
          router.push('/dashboard');
        }
      } catch (error) {
        // If not on auth pages while unauthenticated, redirect to login
        if (router.pathname !== '/login' && router.pathname !== '/signup') {
          router.push('/login');
        }
      } finally {
        setAuthChecked(true);
      }
    }

    checkAuthState();
  }, [router.pathname]); // Only run when path changes

  if (!authChecked) {
    return (
      <CoursesProvider>
        <LoadingSpinner />
      </CoursesProvider>
    );
  }

  return (
    <CoursesProvider>
      <Component {...pageProps} />
    </CoursesProvider>
  );
}