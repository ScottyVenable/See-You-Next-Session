import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlayGame from './pages/PlayGame';
import Releases from './pages/Releases';
import Documents from './pages/Documents';
import Assets from './pages/Assets';
import Repository from './pages/Repository';
import Discussions from './pages/Discussions';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/play" element={<PlayGame />} />
                                    <Route path="/releases" element={<Releases />} />
                                    <Route path="/documents" element={<Documents />} />
                                    <Route path="/assets" element={<Assets />} />
                                    <Route path="/repository" element={<Repository />} />
                                    <Route path="/discussions" element={<Discussions />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
