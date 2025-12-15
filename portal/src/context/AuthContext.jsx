import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple hash function for password verification (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for existing session
        const session = localStorage.getItem('syns_dev_session');
        if (session) {
            const { expiry, username } = JSON.parse(session);
            if (new Date().getTime() < expiry) {
                setIsAuthenticated(true);
                setUser(username || 'Team Member');
            } else {
                localStorage.removeItem('syns_dev_session');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (password, username = 'Team Member') => {
        const hash = await hashPassword(password);
        const expectedHash = import.meta.env.VITE_DEV_PASSWORD_HASH;

        if (hash === expectedHash) {
            // Session expires in 7 days
            const session = {
                authenticated: true,
                username,
                expiry: new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
            };
            localStorage.setItem('syns_dev_session', JSON.stringify(session));
            setIsAuthenticated(true);
            setUser(username);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('syns_dev_session');
        setIsAuthenticated(false);
        setUser(null);
    };

    const setUsername = (newUsername) => {
        setUser(newUsername);
        const session = JSON.parse(localStorage.getItem('syns_dev_session') || '{}');
        session.username = newUsername;
        localStorage.setItem('syns_dev_session', JSON.stringify(session));
    };

    const changePassword = async (currentPassword, newPassword) => {
        // Note: In a real app, this would hit a backend API
        // For static GitHub Pages, password changes require updating the secret
        const currentHash = await hashPassword(currentPassword);
        const expectedHash = import.meta.env.VITE_DEV_PASSWORD_HASH;

        if (currentHash === expectedHash) {
            const newHash = await hashPassword(newPassword);
            // Return the new hash so user can update GitHub secret
            return { success: true, newHash };
        }
        return { success: false };
    };

    if (isLoading) {
        return <div className="loading">Checking authentication...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUsername, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
