import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const data = err.response?.data;
            if (data?.non_field_errors) {
                setError(data.non_field_errors[0]);
            } else if (data?.detail) {
                setError(data.detail);
            } else {
                setError('Login failed. Please try again.');
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
                        <h1>Welcome back</h1>
                        <p>Sign in to continue managing your job applications and team.</p>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="ye-auth-form-panel">
                    <div className="ye-auth-card">
                        <h2>Sign In</h2>
                        <p className="ye-auth-subtitle">Enter your credentials to access your account</p>

                        {error && (
                            <div className="ye-alert ye-alert-error" id="login-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="ye-form">
                            <div className="ye-form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="ye-form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="ye-btn-primary" disabled={loading} id="login-submit">
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <p className="ye-auth-footer">
                            Don't have an account? <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
