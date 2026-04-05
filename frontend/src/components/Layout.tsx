import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Car, LogOut, User, Gavel, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth() as any;
  const navigate = useNavigate();
  const menuItems = [
    { name: 'Marketplace', icon: Home, path: '/', role: 'all' },
    { name: 'My Listings', icon: Car, path: '/seller-dashboard', role: 'Seller' },
    { name: 'Auctions', icon: Gavel, path: '/auctions', role: 'all' },
    { name: 'Admin Panel', icon: UserCog, path: '/admin', role: 'Admin' },
  ];
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#1e293b', borderRight: '1px solid #334155', padding: '20px' }}>
        <h2 style={{ color: '#6366f1', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>AutoSmart</h2>
        <nav>
          {menuItems.filter(item => item.role === 'all' || item.role === user?.role).map((item) => (
            <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', marginBottom: '8px', transition: '0.3s' }}>
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', position: 'absolute', bottom: '20px', width: '220px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: '#f43f5e', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{user?.name || 'Guest'}</p>
              <small style={{ color: '#6366f1' }}>{user?.role || 'Visitor'}</small>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
