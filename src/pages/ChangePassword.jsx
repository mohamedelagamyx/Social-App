import { useState } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import * as usersApi from '../api/usersApi';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!password || !newPassword || !rePassword) {
      setError('Fill in all three fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== rePassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await usersApi.changePassword({ password, newPassword, rePassword });
      const nextToken = res.data?.token || res.token;
      if (nextToken) login(nextToken, user);
      setSuccess(true);
      setPassword('');
      setNewPassword('');
      setRePassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowBackOutlinedIcon fontSize="small" />
        <span>Back</span>
      </button>
      <h1 className="page-title">Change password</h1>
      <p className="page-subtitle">Your password will be rotated immediately.</p>

      {error && <div className="form-error-banner">{error}</div>}
      {success && (
        <div
          className="form-error-banner"
          style={{
            background: 'rgba(62,122,82,0.12)',
            borderColor: 'rgba(62,122,82,0.35)',
            color: 'var(--good)',
          }}
        >
          Password updated.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 380 }}>
        <div className="field">
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="confirm-new-password">Confirm new password</label>
          <input
            id="confirm-new-password"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
