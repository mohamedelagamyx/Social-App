import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as usersApi from '../api/usersApi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [login, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login: setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim() || !password) {
      setError('Enter your email/username and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await usersApi.signin({ login: login.trim(), password });
      const token = res.data?.token || res.token;
      const user = res.data?.user || res.data;
      if (!token) throw new Error('Sign in did not return a token.');
      setSession(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to see what's new on the board</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login">Email or username</label>
            <input
              id="login"
              name="login"
              value={login}
              onChange={(e) => setLoginField(e.target.value)}
              autoComplete="username"
              aria-label="Email or username"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
