import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signUp({
        username,  
        password,
        options: {
          userAttributes: {
            email, 
          }
        }
      });
      alert('Signup successful! Now log in.');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Error signing up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Create Account</h1>

      {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Already have an account? <Link href="/login" style={{ color: '#0070f3' }}>Login</Link>
      </p>
    </div>
  );
}
