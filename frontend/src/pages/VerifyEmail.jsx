import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const uid = searchParams.get('uid');
        const token = searchParams.get('token');

        if (!uid || !token) {
            setStatus('error');
            setMessage('Invalid verification link. Missing parameters.');
            return;
        }

        const verify = async () => {
            try {
                const res = await api.get(`/auth/email-verify/?uid=${uid}&token=${token}`);
                setStatus('success');
                setMessage(res.data.message || 'Email verified successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="auth-page">
            <div className="auth-card verify-card">
                {status === 'loading' && (
                    <div className="verify-status">
                        <Loader size={48} className="spinner" />
                        <h2>Verifying your email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verify-status success">
                        <CheckCircle size={48} />
                        <h2>Email Verified!</h2>
                        <p>{message}</p>
                        <Link to="/login" className="btn btn-primary" id="verify-login-btn">
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-status error">
                        <XCircle size={48} />
                        <h2>Verification Failed</h2>
                        <p>{message}</p>
                        <Link to="/register" className="btn btn-outline">
                            Try Registering Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
