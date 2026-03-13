import { useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Car, ShoppingBag,
    Users, BarChart3, LogOut, Menu, X,
    CalendarCheck, MessageCircle
} from 'lucide-react';

export default function OwnerLayout() {
    const { user, logout } = useAuth() as any;
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/owner/dashboard' },
        { icon: Car, label: 'Manage Vehicles', path: '/owner/inventory' },
        { icon: CalendarCheck, label: 'Bookings', path: '/owner/bookings' },
        { icon: ShoppingBag, label: 'Orders', path: '/owner/orders' },
        { icon: MessageCircle, label: 'Sales Leads', path: '/owner/leads' },
        { icon: Users, label: 'Customers', path: '/owner/customers' },
        { icon: BarChart3, label: 'Sales Reports', path: '/owner/reports' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Sidebar */}
            <aside style={{
                width: isOpen ? '280px' : '80px',
                background: '#0f172a',
                color: 'white',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {isOpen && (
                        <div
                            onClick={() => navigate('/')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                            <img
                                src="/logo.png"
                                alt="Sai Automobiles"
                                style={{ height: '50px', width: 'auto', filter: 'brightness(100)' }}
                            />
                        </div>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
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
                                    color: isActive ? 'white' : '#94a3b8',
                                    background: isActive ? '#0070f3' : 'transparent',
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

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
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
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{user?.name || 'Administrator'}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Dealership Owner</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#004e82', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                            {user?.name?.[0] || 'A'}
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
