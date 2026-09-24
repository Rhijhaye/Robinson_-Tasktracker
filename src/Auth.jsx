import { useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

import { auth } from './firebase';

function Auth() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (mode === 'register' && username.trim().length < 3) {
      setError('Username must contain at least 3 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        // Create a new Firebase account
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        // Save the username to the user's Firebase profile
        await updateProfile(userCredential.user, {
          displayName: username.trim()
        });

      } else if (mode === 'login') {
        // Sign in with an existing account
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      } else if (mode === 'reset') {
        // Send password recovery email
        await sendPasswordResetEmail(
          auth,
          email.trim()
        );

        setSuccess(
          'If an account exists for this email, you will receive password reset instructions shortly.'
        );
      }

    } catch (err) {
      console.error('Authentication error:', err.code);

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

        case 'auth/too-many-requests':
          setError(
            'Too many attempts. Please wait before trying again.'
          );
          break;

        case 'auth/network-request-failed':
          setError(
            'Network error. Please check your connection.'
          );
          break;

        default:
          setError(
            'Something went wrong. Please try again.'
          );
      }

    } finally {
      setLoading(false);
    }
  }

  function changeMode(newMode) {
    setMode(newMode);
    setError('');
    setSuccess('');
    setPassword('');
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Task Tracker</h1>

        <p>
          {mode === 'register'
            ? 'Create your account to get started.'
            : mode === 'reset'
              ? 'Enter your email to reset your password.'
              : 'Welcome back! Sign in to continue.'}
        </p>

        <form onSubmit={handleSubmit}>

          {/* Username field for registration */}
          {mode === 'register' && (
            <>
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                minLength={3}
                maxLength={20}
                autoComplete="username"
                disabled={loading}
                required
              />
            </>
          )}

          {/* Email address */}
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            disabled={loading}
            required
          />

          {/* Password field for login and registration */}
          {mode !== 'reset' && (
            <>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete={
                  mode === 'register'
                    ? 'new-password'
                    : 'current-password'
                }
                minLength={
                  mode === 'register' ? 6 : undefined
                }
                disabled={loading}
                required
              />
            </>
          )}

          {/* Error message */}
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {/* Success message */}
          {success && (
            <p className="auth-success" role="status">
              {success}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="primary-btn auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'register'
                ? 'Create Account'
                : mode === 'reset'
                  ? 'Send Reset Email'
                  : 'Log In'}
          </button>

        </form>

        {/* Forgot password link */}
        {mode === 'login' && (
          <div className="forgot-password">
            <button
              type="button"
              onClick={() => changeMode('reset')}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Registration and login navigation */}
        <p className="auth-switch">

          {mode === 'register'
            ? 'Already have an account?'
            : mode === 'reset'
              ? 'Remember your password?'
              : "Don't have an account?"}

          <button
            type="button"
            onClick={() =>
              changeMode(
                mode === 'login' ? 'register' : 'login'
              )
            }
          >
            {mode === 'login'
              ? 'Register'
              : 'Log In'}
          </button>

        </p>

      </div>

    </div>
  );
}

export default Auth;