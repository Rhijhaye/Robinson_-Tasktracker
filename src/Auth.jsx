
import { useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { auth } from './firebase';

function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;

        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;

        case 'auth/weak-password':
          setError('Please use a stronger password.');
          break;

        case 'auth/invalid-credential':
          setError('Incorrect email or password.');
          break;

        default:
          setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegistering(!isRegistering);
    setError('');
    setPassword('');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Task Tracker</h1>

        <p>
          {isRegistering
            ? 'Create your account to get started.'
            : 'Welcome back! Sign in to continue.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete={
              isRegistering ? 'new-password' : 'current-password'
            }
            minLength={isRegistering ? 6 : undefined}
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegistering
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={switchMode}
          >
            {isRegistering ? 'Log In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;