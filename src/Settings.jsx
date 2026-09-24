import { useState } from 'react';

import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

import { auth } from './firebase';

function Settings({ user, onBack, onProfileUpdated }) {

  // Profile information
  const [username, setUsername] = useState(
    user.displayName || ''
  );

  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password management
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Update username
  async function handleProfileUpdate(event) {
    event.preventDefault();

    setProfileMessage('');
    setProfileError('');

    if (username.trim().length < 3) {
      setProfileError(
        'Username must contain at least 3 characters.'
      );
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile(auth.currentUser, {
        displayName: username.trim()
      });

      // Update the dashboard greeting
      onProfileUpdated();

      setProfileMessage(
        'Your username has been updated successfully.'
      );

    } catch (error) {
      console.error('Profile update failed:', error.code);

      setProfileError(
        'Unable to update your profile. Please try again.'
      );

    } finally {
      setProfileLoading(false);
    }
  }

  // Change account password
  async function handlePasswordChange(event) {
    event.preventDefault();

    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        'Your new password must contain at least 6 characters.'
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user available.');
      }

      // Verify the current password before updating
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(
        currentUser,
        newPassword
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordMessage(
        'Your password has been changed successfully.'
      );

    } catch (error) {
      console.error('Password change failed:', error.code);

      if (error.code === 'auth/invalid-credential') {
        setPasswordError(
          'Your current password is incorrect.'
        );
      } else if (error.code === 'auth/weak-password') {
        setPasswordError(
          'Please choose a stronger password.'
        );
      } else {
        setPasswordError(
          'Unable to change your password. Please try again.'
        );
      }

    } finally {
      setPasswordLoading(false);
    }
  }

  // Send password reset email
  async function handlePasswordReset() {
    setPasswordMessage('');
    setPasswordError('');

    setPasswordLoading(true);

    try {
      if (!user.email) {
        throw new Error('No email address available.');
      }

      await sendPasswordResetEmail(
        auth,
        user.email
      );

      setPasswordMessage(
        'Password reset instructions have been sent to your email.'
      );

    } catch (error) {
      console.error('Password reset failed:', error.code);

      setPasswordError(
        'Unable to send the reset email. Please try again.'
      );

    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <main className="container">

      <section className="panel">

        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <h1>Profile & Settings</h1>

        <p>
          Manage your account information and security.
        </p>

      </section>

      {/* Profile Information */}
      <section className="panel">

        <h2>My Profile</h2>

        <p>
          <strong>Email Address:</strong> {user.email}
        </p>

        <p>
          <strong>Account Created:</strong>{' '}
          {user.metadata.creationTime
            ? new Date(
                user.metadata.creationTime
              ).toLocaleDateString()
            : 'Not available'}
        </p>

        <form onSubmit={handleProfileUpdate}>

          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Enter your username"
            minLength={3}
            maxLength={20}
            disabled={profileLoading}
            required
          />

          {profileError && (
            <p className="auth-error" role="alert">
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p className="auth-success" role="status">
              {profileMessage}
            </p>
          )}

          <div className="actions">

            <button
              type="submit"
              className="primary-btn"
              disabled={profileLoading}
            >
              {profileLoading
                ? 'Saving...'
                : 'Save Profile'}
            </button>

          </div>

        </form>

      </section>

      {/* Password Management */}
      <section className="panel">

        <h2>Account Security</h2>

        <p>
          Change your password to keep your account secure.
        </p>

        <form onSubmit={handlePasswordChange}>

          <label htmlFor="currentPassword">
            Current Password
          </label>

          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            autoComplete="current-password"
            disabled={passwordLoading}
            required
          />

          <label htmlFor="newPassword">
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength={6}
            disabled={passwordLoading}
            required
          />

          <label htmlFor="confirmPassword">
            Confirm New Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength={6}
            disabled={passwordLoading}
            required
          />

          {passwordError && (
            <p className="auth-error" role="alert">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p className="auth-success" role="status">
              {passwordMessage}
            </p>
          )}

          <div className="actions">

            <button
              type="submit"
              className="primary-btn"
              disabled={passwordLoading}
            >
              {passwordLoading
                ? 'Updating...'
                : 'Change Password'}
            </button>

          </div>

        </form>

        <hr />

        <h3>Forgot Your Password?</h3>

        <p>
          You can also request a password reset email.
        </p>

        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={passwordLoading}
        >
          Send Password Reset Email
        </button>

      </section>

    </main>
  );
}

export default Settings;