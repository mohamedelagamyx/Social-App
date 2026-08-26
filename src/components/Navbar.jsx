import { NavLink, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          Mini<span className="brand-dot">Chat</span>
        </NavLink>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <HomeOutlinedIcon fontSize="small" />
                <span>Home</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <PersonOutlineOutlinedIcon fontSize="small" />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="/change-password"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <LockResetOutlinedIcon fontSize="small" />
                <span>Password</span>
              </NavLink>
              <button type="button" aria-label="Sign out" onClick={handleLogout}>
                <LogoutOutlinedIcon fontSize="small" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                <LoginOutlinedIcon fontSize="small" />
                <span>Log in</span>
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
                <PersonAddAltOutlinedIcon fontSize="small" />
                <span>Sign up</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
