import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as usersApi from '../api/usersApi';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  username: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  password: '',
  rePassword: '',
};

export default function SignUp() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Enter your full name.';
    if (!form.username.trim()) errs.username = 'Choose a username.';
    if (!form.email.trim()) {
      errs.email = 'Enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!form.gender.trim()) errs.gender = 'Choose your gender.';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Enter your date of birth.';
    if (!form.password) {
      errs.password = 'Choose a password.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(form.password)) {
      errs.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
    }
    if (form.rePassword !== form.password) {
      errs.rePassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        gender: form.gender.trim(),
        dateOfBirth: form.dateOfBirth,
      };

      const res = await usersApi.signup(payload);
      const token = res.data?.token || res.token;
      const user = res.data?.user || res.data;
      if (token) {
        login(token, user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      const normalizedErrors = (() => {
        if (!err.errors) return [];
        if (Array.isArray(err.errors)) return err.errors.flat();
        if (typeof err.errors === 'string') return [err.errors];
        return Object.values(err.errors).flat();
      })();

      setFormError(err.message);
      if (normalizedErrors.length) {
        setFormError(`${err.message}: ${normalizedErrors.join(', ')}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Join the board</h1>
        <p className="auth-subtitle">Create an account to start posting</p>

        {formError && <div className="form-error-banner">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              aria-label="Full name"
            />
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              aria-label="Username"
            />
            {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-label="Email"
            />
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              autoComplete="sex"
              aria-label="Gender"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {fieldErrors.gender && <div className="field-error">{fieldErrors.gender}</div>}
          </div>

          <div className="field">
            <label htmlFor="dateOfBirth">Date of birth</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              autoComplete="bday"
              aria-label="Date of birth"
            />
            {fieldErrors.dateOfBirth && (
              <div className="field-error">{fieldErrors.dateOfBirth}</div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-label="Password"
            />
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          <div className="field">
            <label htmlFor="rePassword">Confirm password</label>
            <input
              id="rePassword"
              name="rePassword"
              type="password"
              value={form.rePassword}
              onChange={handleChange}
              autoComplete="new-password"
              aria-label="Confirm password"
            />
            {fieldErrors.rePassword && (
              <div className="field-error">{fieldErrors.rePassword}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
