import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">💼</span>
                    Job Tracker
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <div className="nav-user-info">
                                <User size={16} />
                                <span className="user-name">{user.name}</span>
                                <span className="user-role-badge">{user.role}</span>
                            </div>
                            <button onClick={handleLogout} className="nav-btn nav-btn-logout" id="logout-btn">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" id="login-link">
                                <LogIn size={18} />
                                Login
                            </Link>
                            <Link to="/register" className="nav-btn nav-btn-primary" id="register-link">
                                <UserPlus size={18} />
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
