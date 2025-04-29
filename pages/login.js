import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
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
        error.name === 'UserNotConfirmedException'
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
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Welcome Back</h1>

      {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
        <button type="submit" disabled={isLoading} style={{ background: isLoading ? '#ccc' : '#0070f3', color: 'white', padding: '10px', border: 'none', borderRadius: '4px' }}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Don't have an account? <Link href="/signup" style={{ color: '#0070f3' }}>Sign up</Link>
      </p>
    </div>
  );
}
