import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Chrome, Apple, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth() as any;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('Please fill in all fields');

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      const userData = res.data.user || res.data;
      const normalizedRole = role === 'seller' ? 'Owner' : 'Buyer';
      login({ ...userData, role: normalizedRole });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    setIsLoading(true);
    // Mocking social login success for demonstration
    setTimeout(() => {
      login({
        id: 'social-1',
        name: `${platform} User`,
        email: 'social@example.com',
        role: role === 'seller' ? 'Owner' : 'Buyer'
      });
      setIsLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* 1. Left Side: Login Form */}
      <div style={{ flex: '0 0 45%', padding: '40px 80px', display: 'flex', flexDirection: 'column' }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: 'auto' }}
        >
          <img
            src="/logo.png"
            alt="Sai Automobiles"
            style={{ height: '50px', width: 'auto' }}
          />
          <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            Sai Automobiles
          </span>
        </div>

        {/* Center Content */}
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Enter your credentials to access your account.</p>

          {/* Role Toggle */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <button
              onClick={() => setRole('buyer')}
              disabled={isLoading}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: role === 'buyer' ? 'white' : 'transparent',
                boxShadow: role === 'buyer' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: role === 'buyer' ? '#1e293b' : '#64748b'
              }}
            >
              Client / Buyer
            </button>
            <button
              onClick={() => setRole('seller')}
              disabled={isLoading}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: role === 'seller' ? 'white' : 'transparent',
                boxShadow: role === 'seller' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: role === 'seller' ? '#1e293b' : '#64748b'
              }}
            >
              Dealer / Seller
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}
            >
              {isLoading ? <Loader2 className="spin" size={20} /> : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '32px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Reset link sent!'); }} style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
            <span style={{ color: '#64748b' }}>Don't have an account? <Link to="/register" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link></span>
          </div>

          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ position: 'relative', background: '#f8fafc', padding: '0 16px', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Or continue with</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%',
                padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
              }}
            >
              <Chrome size={18} /> Google
            </button>
            <button
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%',
                padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
              }}
            >
              <Apple size={18} /> Apple
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}></div>
      </div>

      {/* 2. Right Side: Visual Image */}
      <div style={{ flex: '1', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Luxury Car"
        />
        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))'
        }}></div>

        {/* Quote */}
        <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px', color: 'white' }}>
          <p style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.4, maxWidth: '500px' }}>
            "The most seamless way to buy and sell premium pre-owned vehicles. Verified, trusted, and fast."
          </p>
          <div style={{ fontSize: '15px', fontWeight: 500, opacity: 0.9 }}>
            Sofia Davis — <span style={{ opacity: 0.7 }}>Verified Buyer</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}


