import { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAuthErrorMessage, logAuthError } from "../lib/authErrors";

export default function VerifyEmail() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!username.trim()) {
      setError("Please enter your username.");
      setIsLoading(false);
      return;
    }

    if (!code.trim()) {
      setError("Please enter the verification code from your email.");
      setIsLoading(false);
      return;
    }

    try {
      await confirmSignUp({
        username,
        confirmationCode: code,
      });

      setSuccess("Email verified successfully! Redirecting to login...");
      setUsername("");
      setCode("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      logAuthError(error, "Email Verification");
      const userMessage = getAuthErrorMessage(error);
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Verify Your Email</h1>

        <p style={styles.instructionText}>
          We&apos;ve sent a verification code to your email address. Enter the
          code below to confirm your account.
        </p>

        {error && <div style={styles.errorText}>{error}</div>}
        {success && <div style={styles.successText}>{success}</div>}

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading || success}
            style={styles.input}
          />
          <input
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            required
            disabled={isLoading || success}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={isLoading || success}
            style={isLoading || success ? styles.buttonDisabled : styles.button}
          >
            {isLoading
              ? "Verifying..."
              : success
                ? "Verified!"
                : "Verify Email"}
          </button>
        </form>

        <div style={styles.helpText}>
          <p>Didn&apos;t receive the code?</p>
          <Link href="/resend-verification-code" style={styles.link}>
            Resend verification code
          </Link>
        </div>

        <p style={styles.footerText}>
          Already verified?{" "}
          <Link href="/login" style={styles.link}>
            Back to Login
          </Link>
        </p>
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
    maxWidth: "450px",
    padding: "32px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "16px",
    color: "#1e293b",
    fontSize: "24px",
  },
  instructionText: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
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
  successText: {
    color: "#16a34a",
    marginBottom: "16px",
    textAlign: "center",
    fontSize: "14px",
    backgroundColor: "#dcfce7",
    padding: "12px",
    borderRadius: "6px",
    lineHeight: "1.5",
    border: "1px solid #86efac",
  },
  helpText: {
    textAlign: "center",
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#f0f9ff",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#0369a1",
    border: "1px solid #bae6fd",
  },
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#64748b",
    fontSize: "14px",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "8px",
  },
};
