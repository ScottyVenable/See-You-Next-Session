import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/', label: '📊 Dashboard', exact: true },
    { path: '/play', label: '🎮 Play Game' },
    { path: '/releases', label: '📦 Releases' },
    { path: '/documents', label: '📄 Documents' },
    { path: '/assets', label: '🎨 Assets' },
    { path: '/repository', label: '💻 Repository' },
    { path: '/discussions', label: '💬 Discussions' },
    { path: '/settings', label: '⚙️ Settings' },
];

export default function Layout({ children }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>🧠 SYNS</h1>
                    <p>Dev Portal</p>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
