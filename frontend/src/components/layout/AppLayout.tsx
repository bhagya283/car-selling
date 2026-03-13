import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Search, PlusCircle,
    LogOut, User, Menu, X,
    Settings, LayoutDashboard, Gavel,
    Users, BarChart3, Package, Clock, Heart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = {
    all: [
        { label: 'Home', icon: LayoutDashboard, path: '/' },
        { label: 'Inventory', icon: Search, path: '/inventory' },
    ],
    Buyer: [
        { type: 'section', label: 'MY ACCOUNT' },
        { label: 'My Orders', icon: Package, path: '/dashboard/orders' },
        { label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
        { label: 'Test Drives', icon: Clock, path: '/dashboard/test-drives' },
        { label: 'Profile Settings', icon: User, path: '/dashboard/profile' },
    ],
    Owner: [
        { type: 'section', label: 'MANAGEMENT' },
        { label: 'Dashboard', icon: LayoutDashboard, path: '/owner/dashboard' },
        { label: 'Manage Vehicles', icon: Package, path: '/owner/inventory' },
        { label: 'Add New Vehicle', icon: PlusCircle, path: '/owner/add-vehicle' },
        { label: 'Orders', icon: Gavel, path: '/owner/orders' },

        { type: 'section', label: 'INTERACTION' },
        { label: 'Test Drives', icon: Clock, path: '/owner/test-drives' },
        { label: 'Customers', icon: Users, path: '/owner/customers' },
        { label: 'Revenue Reports', icon: BarChart3, path: '/owner/reports' },

        { type: 'section', label: 'SYSTEM' },
        { label: 'Settings', icon: Settings, path: '/owner/settings' },
    ],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth() as any;
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const normalizedRole = (user?.role?.toLowerCase() === 'seller' || user?.role?.toLowerCase() === 'owner') ? 'Owner' : 'Buyer';
    const navItems = [...sidebarItems.all, ...(sidebarItems[normalizedRole as keyof typeof sidebarItems] || [])];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* Sidebar */}
            <aside className="glass" style={{
                width: isSidebarOpen ? '280px' : '80px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 1000
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
                    {isSidebarOpen && <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>AutoSmart</h2>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
                    {navItems.map((item: any, idx: number) => {
                        if (item.type === 'section') {
                            return isSidebarOpen ? (
                                <div key={idx} style={{
                                    padding: '24px 14px 8px', fontSize: '11px', fontWeight: 800,
                                    color: 'rgba(255,255,255,0.4)', letterSpacing: '1px'
                                }}>
                                    {item.label}
                                </div>
                            ) : <div key={idx} style={{ height: '20px' }} />;
                        }

                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                to={item.path || '#'}
                                className="animate-up"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px',
                                    textDecoration: 'none',
                                    borderRadius: 'var(--radius-lg)',
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                    background: isActive ? 'var(--primary)' : 'transparent',
                                    marginBottom: '4px',
                                    fontWeight: isActive ? '600' : '500',
                                    transition: 'all 0.2s',
                                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                    position: 'relative'
                                }}
                            >
                                <Icon size={20} style={{ minWidth: '20px' }} />
                                {isSidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                                {isSidebarOpen && item.badge && (
                                    <span style={{
                                        background: '#ef4444', color: 'white', fontSize: '10px',
                                        padding: '2px 6px', borderRadius: '6px', fontWeight: 800
                                    }}>{item.badge}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            width: '100%',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.05)',
                            color: 'var(--danger)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                        }}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <header className="glass" style={{
                    height: '80px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 999
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{user?.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--primary)', margin: 0 }}>{user?.role}</p>
                        </div>
                        <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px var(--primary-glow)'
                        }}>
                            <User size={24} />
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
