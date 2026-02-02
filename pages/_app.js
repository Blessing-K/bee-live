import "@/styles/modern.css";
import "@/styles/globals.css";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import awsExports from "../aws-exports";
import { CoursesProvider } from "../context/CoursesContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

Amplify.configure(awsExports);

const PROTECTED_ROUTES = ["/dashboard", "/courses", "/goals"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authState, setAuthState] = useState(null); // null = checking, true = authenticated, false = not authenticated

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setAuthState(true);
      } catch (err) {
        setAuthState(false);
      }
    };

    checkAuth();
  }, []);

  // Re-check auth on route changes (needed for login/logout redirects)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setAuthState(true);
      } catch (err) {
        setAuthState(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  // Still checking auth
  if (authState === null) {
    return null;
  }

  const isProtectedRoute = PROTECTED_ROUTES.includes(router.pathname);
  const isAuthRoute =
    router.pathname === "/login" || router.pathname === "/signup";

  // User is NOT authenticated
  if (authState === false) {
    // Trying to access protected route - redirect to login without rendering
    if (isProtectedRoute) {
      router.replace("/login");
      return null;
    }
    // Safe to show public/auth pages
    return (
      <CoursesProvider>
        <Component {...pageProps} />
      </CoursesProvider>
    );
  }

  // User IS authenticated
  if (authState === true) {
    // Trying to access login/signup - redirect to dashboard without rendering
    if (isAuthRoute) {
      router.replace("/dashboard");
      return null;
    }
    // Safe to show authenticated pages
    return (
      <CoursesProvider>
        <Component {...pageProps} />
      </CoursesProvider>
    );
  }
}
