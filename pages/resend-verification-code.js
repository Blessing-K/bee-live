import { useState } from "react";
import { resendSignUpCode } from "aws-amplify/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAuthErrorMessage, logAuthError } from "../lib/authErrors";

export default function ResendVerificationCode() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      await resendSignUpCode({
        username: email,
      });

      setSuccess(
        `Verification code sent to ${email}. Check your email and use the code to verify your account.`,
      );
      setEmail("");

      setTimeout(() => {
        router.push("/verify-email");
      }, 3000);
    } catch (error) {
      logAuthError(error, "Resend Verification Code");
      const userMessage = getAuthErrorMessage(error);
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Resend Verification Code</h1>

        <p style={styles.instructionText}>
          Enter your email address and we&apos;ll send you a new verification
          code.
        </p>

        {error && <div style={styles.errorText}>{error}</div>}
        {success && <div style={styles.successText}>{success}</div>}

        <form onSubmit={handleResend} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || success}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={isLoading || success}
            style={isLoading || success ? styles.buttonDisabled : styles.button}
          >
            {isLoading ? "Sending..." : success ? "Code Sent!" : "Send Code"}
          </button>
        </form>

        <p style={styles.footerText}>
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
    maxWidth: "400px",
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
    marginBottom: "24px",
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
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    textDecoration: "none",
  },
};
