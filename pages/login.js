import { useState, useEffect } from 'react'; 
import { signIn, getCurrentUser } from 'aws-amplify/auth'; 
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        router.push('/dashboard'); 
      } catch (err) {
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      try {
        await getCurrentUser();
        router.push('/dashboard');
        return;
      } catch (notAuthed) {

      }

      const user = await signIn({
        username,
        password,
      });
  
      if (user) {
        router.push('/dashboard');  
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.name === 'UserNotFoundException'
        ? 'Account not found. Please sign up first.'
          :error.name === 'UserNotConfirmedException'
          ? 'Please confirm your email first.'
          : error.name === 'NotAuthorizedException'
          ? 'Invalid username or password.'
          : `Login failed: ${error.message}`
      );
    } finally {
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
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={isLoading} 
            style={isLoading ? styles.buttonDisabled : styles.button}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link href="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px'
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1e293b',
    fontSize: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    padding: '12px',
    backgroundColor: '#cbd5e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed'
  },
  errorText: {
    color: '#ef4444',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px'
  },
  footerText: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#64748b'
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
    textDecoration: 'none'
  }
};