import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(password);

        if (success) {
            navigate('/');
        } else {
            setError('Invalid password');
        }
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>🧠 See You Next Session</h1>
                    <p>Developer Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="password">Access Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter developer password"
                            autoFocus
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={isLoading} className="login-btn">
                        {isLoading ? 'Authenticating...' : 'Enter Portal'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Access restricted to development team only.</p>
                    <p className="hint">Contact Scott or Kiki for credentials.</p>
                </div>
            </div>
        </div>
    );
}
