import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            setSuccess('Registration successful! Please check your email for the verification link.');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join(' ');
                setError(messages || 'Registration failed.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ye-auth-page">
            <div className="ye-auth-container">
                {/* Left panel — branding */}
                <div className="ye-auth-brand">
                    <div className="ye-brand-content">
                        <span className="ye-brand-icon">💼</span>
                        <h1>Get Started</h1>
                        <p>Create your account and start tracking your job applications with role-based access control.</p>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="ye-auth-form-panel">
                    <div className="ye-auth-card">
                        <h2>Create Account</h2>
                        <p className="ye-auth-subtitle">Fill in the details to join the platform</p>

                        {error && (
                            <div className="ye-alert ye-alert-error" id="register-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="ye-alert ye-alert-success" id="register-success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="ye-form">
                            <div className="ye-form-row">
                                <div className="ye-form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="ye-form-group">
                                    <label htmlFor="reg-email">Email</label>
                                    <input
                                        type="email"
                                        id="reg-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="ye-form-group">
                                <label htmlFor="reg-password">Password</label>
                                <input
                                    type="password"
                                    id="reg-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 8 characters"
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="ye-form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <button type="submit" className="ye-btn-primary" disabled={loading} id="register-submit">
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <p className="ye-auth-footer">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
