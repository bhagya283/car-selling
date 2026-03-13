import { useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Package, Heart,
    Calendar, User, LogOut, Menu, X
} from 'lucide-react';

export default function BuyerLayout() {
    const { user, logout } = useAuth() as any;
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Package, label: 'My Orders', path: '/dashboard/orders' },
        { icon: Calendar, label: 'Test Drives', path: '/dashboard/test-drives' },
        { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: isOpen ? '280px' : '80px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', borderBottom: '1px solid #f1f5f9' }}>
                    {isOpen && (
                        <div
                            onClick={() => navigate('/')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                            <img
                                src="/logo.png"
                                alt="Sai Automobiles"
                                style={{ height: '50px', width: 'auto' }}
                            />
                        </div>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav style={{ padding: '20px 12px', flex: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#0070f3' : '#64748b',
                                    background: isActive ? '#f0f7ff' : 'transparent',
                                    marginBottom: '4px',
                                    justifyContent: isOpen ? 'flex-start' : 'center'
                                }}
                            >
                                <item.icon size={20} />
                                {isOpen && <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            background: '#fff1f2',
                            color: '#e11d48',
                            border: 'none',
                            cursor: 'pointer',
                            justifyContent: isOpen ? 'flex-start' : 'center'
                        }}
                    >
                        <LogOut size={20} />
                        {isOpen && <span style={{ fontWeight: 600 }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflow: 'auto' }}>
                <header style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{user?.name || 'Customer'}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>VIP Buyer</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0070f3', fontWeight: 800 }}>
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </header>
                <div style={{ padding: '32px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
