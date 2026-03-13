import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, LayoutDashboard } from 'lucide-react';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth() as any;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Inventory', path: '/inventory' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* Navbar */}
            <nav style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '4px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <img
                        src="/logo.png"
                        alt="Sai Automobiles"
                        onClick={() => navigate('/')}
                        style={{ height: '70px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
                    />

                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? '#0f172a' : '#64748b',
                                        transition: 'color 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {link.name}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: '#004e82',
                                            borderRadius: '2px'
                                        }} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Search size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => navigate('/inventory')} />
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    const role = user.role?.toLowerCase();
                                    if (role === 'owner' || role === 'seller') {
                                        navigate('/owner/dashboard');
                                    } else {
                                        navigate('/dashboard');
                                    }
                                }}
                                style={{
                                    background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px',
                                    borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <LayoutDashboard size={18} /> Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                style={{ background: 'none', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#64748b' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#0f172a' }}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{ background: '#004e82', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '80px 40px', borderTop: '1px solid #e2e8f0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>
                        <div>
                            <div
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer', marginBottom: '24px' }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Sai Automobiles"
                                    style={{ height: '80px', width: 'auto' }}
                                />
                            </div>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>The premier destination for high-quality certified pre-owned vehicles. Quality, transparency, and service at every turn.</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
                                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Inventory</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <span>All Cars</span>
                                <span>SUVs</span>
                                <span>Sedans</span>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px' }}>Support</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                                <span>Terms of Service</span>
                                <span>Privacy Policy</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        <p>© 2026 Sai Automobiles. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
