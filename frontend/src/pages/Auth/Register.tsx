import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/auth/register', formData);
      alert('Account created successfully! Please login with your new credentials.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. This email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* 1. Left Side: Registration Form */}
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
        <div style={{ maxWidth: '400px', width: '100%', margin: '40px auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Join the Journey</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Enter your details to create your elite account.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Register as</label>
              <select
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                value={formData.role}
                disabled={isLoading}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', cursor: 'pointer' }}
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isLoading ? <Loader2 className="spin" size={20} /> : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Already have an account? <Link to="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link></span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}></div>
      </div>

      {/* 2. Right Side: Visual Image */}
      <div style={{ flex: '1', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Luxury Porsche"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))'
        }}></div>

        {/* Info Text */}
        <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px', color: 'white' }}>
          <p style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.4, maxWidth: '500px' }}>
            "Ready to drive your dream? Join our community of car enthusiasts and find your perfect match today."
          </p>
          <div style={{ fontSize: '15px', fontWeight: 500, opacity: 0.9 }}>
            The Sai Experience — <span style={{ opacity: 0.7 }}>Redefining Quality</span>
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
