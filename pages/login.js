import { useState, useEffect } from "react";
import { signIn, getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  getAuthErrorMessage,
  logAuthError,
  isRetryableError,
} from "../lib/authErrors";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setRetryCount(0);

    try {
      // Validate input
      if (!username.trim()) {
        setError("Please enter your username.");
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        setError("Please enter your password.");
        setIsLoading(false);
        return;
      }

      const user = await signIn({
        username,
        password,
      });

      if (user) {
        // Don't set isLoading to false here - let redirect happen
        await router.push("/dashboard");
      }
    } catch (error) {
      logAuthError(error, "Login");
      const userMessage = getAuthErrorMessage(error);
      setError(userMessage);

      // Track retryable errors
      if (isRetryableError(error)) {
        setRetryCount((prev) => prev + 1);
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back</h1>

        {error && <div style={styles.errorText}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? styles.buttonDisabled : styles.button}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>

        {retryCount > 3 && (
          <p style={styles.warningText}>
            Having trouble logging in? Make sure you&apos;ve verified your email
            address. Check your spam folder for the verification email.
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#1e293b",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    padding: "12px",
    backgroundColor: "#cbd5e1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: "16px",
    textAlign: "center",
    fontSize: "14px",
    backgroundColor: "#fee2e2",
    padding: "12px",
    borderRadius: "6px",
    lineHeight: "1.5",
    border: "1px solid #fca5a5",
  },
  warningText: {
    color: "#d97706",
    marginTop: "16px",
    textAlign: "center",
    fontSize: "13px",
    backgroundColor: "#fef3c7",
    padding: "10px",
    borderRadius: "6px",
    lineHeight: "1.4",
    border: "1px solid #fcd34d",
  },
  footerText: {
    textAlign: "center",
    marginTop: "16px",
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    textDecoration: "none",
  },
};
