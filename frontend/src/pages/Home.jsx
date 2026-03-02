import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, Users, Briefcase } from 'lucide-react';

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Track Your <span className="gradient-text">Job Applications</span> Effortlessly
                    </h1>
                    <p className="hero-subtitle">
                        A powerful role-based platform to manage job applications, users and workflows all in one place.
                    </p>
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-dashboard-btn">
                                Go to Dashboard <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                                    Get Started <ArrowRight size={20} />
                                </Link>
                                <Link to="/login" className="btn btn-outline btn-lg" id="hero-login-btn">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><Shield size={32} /></div>
                        <h3>Role-Based Access</h3>
                        <p>Admin, Manager and User roles with fine-grained permissions for every action.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Users size={32} /></div>
                        <h3>User Management</h3>
                        <p>Full CRUD capabilities for managing users, roles and profiles securely.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Briefcase size={32} /></div>
                        <h3>Job Tracking</h3>
                        <p>Organize applications, monitor statuses and stay on top of your career journey.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
